import test from 'node:test';
import assert from 'node:assert/strict';
import { encrypt, decrypt, publicUrl, domain } from './store';
import { escapeHtml } from './mail';
test('private addresses and credential-bearing URLs cannot become research targets',()=>{for(const value of ['http://example.com','https://127.0.0.1','https://10.1.2.3','https://192.168.0.1','https://169.254.169.254','https://172.16.0.1','https://localhost','https://test.internal','https://user:password@example.com','https://[::1]','https://2130706433','https://example.com:444'])assert.equal(publicUrl(value),false,value);assert.equal(publicUrl('https://www.example.co.uk/contact'),true);assert.equal(domain('https://www.example.co.uk/contact'),'example.co.uk')});
test('saved API keys use authenticated encryption and reject modified data',()=>{process.env.OUTREACH_SESSION_SECRET='test-secret-only';const encrypted=encrypt('fc-test-key');assert.ok(!encrypted.includes('fc-test-key'));assert.equal(decrypt(encrypted),'fc-test-key');const b=Buffer.from(encrypted,'base64');b[15]^=1;assert.throws(()=>decrypt(b.toString('base64')))});
test('outgoing free text cannot inject email HTML',()=>{assert.equal(escapeHtml('<img src=x onerror="bad"> &'), '&lt;img src=x onerror=&quot;bad&quot;&gt; &amp;')});

test('suppressed, replied, unpermitted and ambiguous contacts cannot send',async()=>{
 const {sendLead}=await import('./mail');const {PREFIX}=await import('./store');const original=globalThis.fetch;
 process.env.KV_REST_API_URL='https://redis.example.test';process.env.KV_REST_API_TOKEN='unit-test';
 for(const patch of [{suppressed:true},{repliedAt:'2026-11-09T00:00:00Z'},{consent:''},{status:'uncertain',consent:'Requested by phone 9 November'}]){
 const lead={id:'lead',email:'info@example.com',status:'new',consent:'',suppressed:false,repliedAt:'',...patch};let calls=0;
 globalThis.fetch=async(_input,init)=>{calls++;const cmd=JSON.parse(String(init?.body));let result:unknown='OK';if(cmd[0]==='HGETALL')result=Object.entries(lead).flatMap(([k,v])=>[k,JSON.stringify(v)]);if(cmd[0]==='EVAL')result=1;assert.ok(String(cmd[1]||'').includes(PREFIX)||cmd[0]==='EVAL');return Response.json({result})};
 await assert.rejects(sendLead('lead'));assert.equal(calls,3,'only lock, contact read and lock release; no sending');
 }globalThis.fetch=original;
});

test('durable command adapter preserves deduplication, lock ownership and expiry',async()=>{
 const {applyCommand}=await import('./blob-state');const state:Record<string,{value:unknown;expires?:number}>={};
 assert.equal(applyCommand(state,['SET','lock','owner','NX','EX',10],1000).result,'OK');
 assert.equal(applyCommand(state,['SET','lock','other','NX','EX',10],1001).result,null);
 assert.equal(applyCommand(state,['EVAL',"if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end",1,'lock','other'],1002).result,0);
 assert.equal(applyCommand(state,['SET','lock','next','NX','EX',10],12000).result,'OK');
 const claim=['EVAL',"if redis.call('EXISTS',KEYS[1])==1 or redis.call('EXISTS',KEYS[2])==1 then return 0 end",2,'email:agency','domain:agency','lead'];
 assert.equal(applyCommand(state,claim,12001).result,1);assert.equal(applyCommand(state,claim,12002).result,0);
 applyCommand(state,['HSET','record','name','"Agency"','email','"info@example.com"']);applyCommand(state,['HSET','record','status','"sent"']);assert.deepEqual(applyCommand(state,['HGETALL','record']).result,['name','"Agency"','email','"info@example.com"','status','"sent"']);
 applyCommand(state,['LPUSH','events','event1']);applyCommand(state,['LPUSH','events','event2']);assert.deepEqual(applyCommand(state,['LRANGE','events',0,1]).result,['event2','event1']);
});

test('agency creation is atomic and repairs an interrupted earlier import',async()=>{
 const {applyCommand}=await import('./blob-state');const state:Record<string,{value:unknown;expires?:number}>={'dedup:email':{value:'orphan'},'agency:domain':{value:'orphan'}};
 const create=['EVAL','-- SWL_CREATE_LEAD',4,'dedup:email','agency:domain','lead:new','leads','new',JSON.stringify({id:'new',company:'Agency',email:'info@example.com'}),'lead:'];
 assert.deepEqual(JSON.parse(String(applyCommand(state,create).result)),{id:'new'});
 assert.deepEqual(applyCommand(state,['SMEMBERS','leads']).result,['new']);
 assert.deepEqual(JSON.parse(String(applyCommand(state,create).result)),{duplicate:true});
 state.leads={value:[]};assert.deepEqual(JSON.parse(String(applyCommand(state,create).result)),{id:'new',recovered:true});assert.deepEqual(applyCommand(state,['SMEMBERS','leads']).result,['new']);
});

test('daily queue enforces five total emails and excludes unpermitted or stopped contacts',async()=>{
 const {dailyQueue,normaliseSettings}=await import('./policy');
 const base={email:'info@example.com',consent:'Requested information by phone',sentAt:'',suppressed:false,repliedAt:'',status:'new',createdAt:'2026-11-09T00:00:00Z'};
 const leads=Array.from({length:9},(_,i)=>({...base,id:String(i)})) as import('./store').Lead[];
 const s=normaliseSettings({dailyCap:100,autoInitial:true});assert.equal(s.dailyCap,5);assert.equal(dailyQueue(leads,s,0).length,5);assert.equal(dailyQueue(leads,s,4).length,1);assert.equal(dailyQueue(leads,s,5).length,0);
 const blocked=[{consent:''},{suppressed:true},{repliedAt:'2026-11-09'},{status:'uncertain'},{status:'sending'},{status:'declined'},{sentAt:'2026-11-09'}].map((p,i)=>({...base,id:String(i),...p})) as import('./store').Lead[];
 assert.equal(dailyQueue(blocked,s,0).length,0);assert.equal(dailyQueue(leads,normaliseSettings(),0).length,0);
});
test('manual sends and follow-ups consume one shared atomic daily allowance',async()=>{
 const {applyCommand}=await import('./blob-state');const state:Record<string,{value:unknown;expires?:number}>={};
 const command=['EVAL',"local n=tonumber(redis.call('GET',KEYS[1]) or '0'); if n>=tonumber(ARGV[1]) then return -1 end; n=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1],172800); return n",1,'daily:2026-11-09',5];
 assert.deepEqual(Array.from({length:9},()=>applyCommand(state,command).result),[1,2,3,4,5,-1,-1,-1,-1]);
});
test('daily limits use the UK calendar date across summer and winter',async()=>{const {londonDay}=await import('./policy');assert.equal(londonDay(new Date('2026-07-01T23:30:00Z')),'2026-07-02');assert.equal(londonDay(new Date('2026-11-09T23:30:00Z')),'2026-11-09')});
