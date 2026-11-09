import { get, put, head, BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';
export type Snapshot=Record<string,{value:unknown;expires?:number}>;
const PATH='swl-outreach/state-v1.json';
/** The small SWL workspace uses a private, version-checked document. No public contact URLs. */
export function applyCommand(state:Snapshot,command:unknown[],now=Date.now()):{result:unknown;changed:boolean}{
 const c=command.map(String),op=c[0],key=c[1];
 const value=(k:string)=>{const entry=state[k];return entry&&(!entry.expires||entry.expires>now)?entry.value:undefined};
 const set=(k:string,v:unknown,expires?:number)=>{state[k]={value:v,...(expires?{expires}:{})}};
 const arr=(k:string)=>(value(k) as string[]|undefined)||[];
 const object=(k:string)=>(value(k) as Record<string,string>|undefined)||{};
 const inc=(k:string)=>{const n=Number(value(k)||0)+1;set(k,String(n),state[k]?.expires);return n};
 let result:unknown=null,changed=true;
 if(op==='GET'){result=value(key)??null;changed=false}
 else if(op==='HGETALL'){result=Object.entries(object(key)).flat();changed=false}
 else if(op==='SMEMBERS'){result=arr(key);changed=false}
 else if(op==='LRANGE'){const end=Number(c[3]);result=arr(key).slice(Number(c[2]),end<0?undefined:end+1);changed=false}
 else if(op==='SET'){if(c.includes('NX')&&value(key)!==undefined){result=null;changed=false}else{const ex=c.indexOf('EX');set(key,command[2],ex>=0?now+Number(c[ex+1])*1000:undefined);result='OK'}}
 else if(op==='DEL'){result=0;for(const k of c.slice(1)){if(value(k)!==undefined)result=Number(result)+1;delete state[k]}}
 else if(op==='HSET'){set(key,{...object(key),...Object.fromEntries(c.slice(2).reduce<string[][]>((a,v,i,all)=>{if(i%2===0)a.push([v,all[i+1]]);return a},[]))});result=(c.length-2)/2}
 else if(op==='SADD'){const before=arr(key),after=[...new Set([...before,...c.slice(2)])];set(key,after);result=after.length-before.length}
 else if(op==='LPUSH'){const next=[...c.slice(2).reverse(),...arr(key)];set(key,next);result=next.length}
 else if(op==='LTRIM'){const end=Number(c[3]);set(key,arr(key).slice(Number(c[2]),end<0?undefined:end+1));result='OK'}
 else if(op==='EVAL'){
  // These are the four fixed atomic operations used by this app, not an arbitrary script interpreter.
  const script=c[1],n=Number(c[2]),keys=c.slice(3,3+n),args=c.slice(3+n),k=keys[0];
  if(script.includes('SWL_CREATE_LEAD')){
   const existing=value(keys[0])||value(keys[1]),stored=existing?object(args[2]+String(existing)):null;
   if(stored?.id){
    if(arr(keys[3]).includes(String(existing))){result=JSON.stringify({duplicate:true});changed=false}
    else{set(keys[3],[...new Set([...arr(keys[3]),String(existing)])]);result=JSON.stringify({id:existing,recovered:true})}
   }else{
    const lead=JSON.parse(args[1]);set(keys[0],args[0]);set(keys[1],args[0]);
    set(keys[2],Object.fromEntries(Object.entries(lead).map(([k,v])=>[k,JSON.stringify(v)])));
    set(keys[3],[...new Set([...arr(keys[3]),args[0]])]);result=JSON.stringify({id:args[0]});
   }
  }else if(script.includes("redis.call('EXISTS'")){
   if(keys.some(k=>value(k)!==undefined)){result=0;changed=false}else{keys.forEach(k=>set(k,args[0]));result=1}
  }else if(script.includes("redis.call('get'")){
   if(value(k)===args[0]){delete state[k];result=1}else{result=0;changed=false}
  }else if(script.includes('n>=tonumber')){
   if(Number(value(k)||0)>=Number(args[0])){result=-1;changed=false}else{result=inc(k);state[k].expires=now+172800000}
  }else if(script.includes("redis.call('INCR'")){
   result=inc(k);if(Number(result)===1)state[k].expires=now+900000;
  }else throw new Error('Unsupported atomic storage operation.');
 }else throw new Error('Unsupported storage operation.');
 if(changed)for(const k of Object.keys(state))if(state[k].expires&&state[k].expires!<=now)delete state[k];
 return {result,changed};
}
export async function blobCommand<T>(command:unknown[]):Promise<T>{
 for(let attempt=0;attempt<12;attempt++){
  const mutating=!['GET','HGETALL','SMEMBERS','LRANGE'].includes(String(command[0]));
  // The API's conditional-write ETag comes from head(), not the HTTP GET header.
  // Read it before the body: a concurrent update then causes a safe failed CAS.
  let metadata:Awaited<ReturnType<typeof head>>|null=null;
  if(mutating){try{metadata=await head(PATH)}catch(e){if(!(e instanceof BlobNotFoundError))throw e}}
  const current=await get(PATH,{access:'private',useCache:false});
  if(mutating&&!!metadata!==!!current)continue;
  const state:Snapshot=current?.statusCode===200?JSON.parse(await new Response(current.stream).text()):{};
  const {result,changed}=applyCommand(state,command);
  if(!changed)return result as T;
  try{const body=JSON.stringify(state);if(body.length>8000000)throw new Error('Workspace storage limit reached. Export and archive old contacts.');
   await put(PATH,body,{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:!!metadata,ifMatch:metadata?.etag,cacheControlMaxAge:60});return result as T;
  }catch(e){if(e instanceof BlobPreconditionFailedError||(e instanceof Error&&/precondition|already exists/i.test(e.message)))continue;throw e}
 }
 throw new Error('Another update is in progress. Please try again.');
}
