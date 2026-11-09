import { randomUUID, createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
export const PREFIX = 'swl:outreach:v1:';
export type Lead = { id: string; company: string; area: string; website: string; email: string; phone: string; source: string; createdAt: string; status: string; consent: string; notes: string; subject: string; body: string; sentAt: string; repliedAt: string; openedAt: string; followupAt: string; followupSentAt: string; suppressed: boolean; tracking: boolean };
export type MailEvent = { id: string; leadId: string; kind: string; at: string; subject?: string; messageId?: string; detail?: string; token?: string };
export async function redis<T = unknown>(command: unknown[]): Promise<T> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) throw new Error('Persistent storage is not configured.');
  const r = await fetch(process.env.KV_REST_API_URL, {method:'POST', headers:{Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}`,'Content-Type':'application/json'}, body:JSON.stringify(command),cache:'no-store',signal:AbortSignal.timeout(15000)});
  if (!r.ok) throw new Error('Storage is temporarily unavailable.');
  const d = await r.json(); if (d.error) throw new Error('Storage operation failed.'); return d.result as T;
}
export async function readLead(id: string): Promise<Lead | null> {
  const raw = await redis<string[]>(['HGETALL',PREFIX+'lead:'+id]); if (!raw?.length) return null;
  const fields: Record<string, unknown> = {}; for(let i=0;i<raw.length;i+=2) fields[raw[i]]=JSON.parse(raw[i+1]); return fields as Lead;
}
export async function patchLead(id: string, patch: Partial<Lead>) { const entries=Object.entries(patch); if(entries.length) await redis(['HSET',PREFIX+'lead:'+id,...entries.flatMap(([k,v])=>[k,JSON.stringify(v)])]); }
export async function allLeads(): Promise<Lead[]> { const ids=await redis<string[]>(['SMEMBERS',PREFIX+'leads']); return (await Promise.all(ids.map(readLead))).filter((v):v is Lead=>!!v).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
export function domain(value:string) {try{return new URL(value).hostname.toLowerCase().replace(/^www\./,'')}catch{return ''}}
export function draft(company:string) {return `Hi ${company} team,\n\nI'm Patrick from South West London Removals. We help buyers and tenants with house moves, packing and storage across South West London.\n\nWould it be useful to have a reliable local removals contact for your clients? We can arrange a free survey and provide a clear, tailored quotation.\n\nHappy to have a quick chat about how we could work together.\n\nKind regards,\nPatrick\nSouth West London Removals\ninfo@swlremovals.co.uk\nhttps://swlremovals.co.uk\n\nIf you'd prefer no further contact, reply and let me know.`;}
export async function addLead(input: Partial<Lead>) {
 const company=String(input.company||'').trim().slice(0,180),email=String(input.email||'').trim().toLowerCase();
 if(!company || (email && !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) || /[\r\n]/.test(email)) throw new Error('Enter an agency name and valid email address.');
 const website=String(input.website||'').trim(); if(website && !publicUrl(website)) throw new Error('Use a public HTTPS website.');
 const id=randomUUID(), key=email?'email:'+email:'domain:'+domain(website)+':'+company.toLowerCase();
 const agency=domain(website)||email.split('@')[1]||company.toLowerCase();
 const claimed=await redis<number>(['EVAL',"if redis.call('EXISTS',KEYS[1])==1 or redis.call('EXISTS',KEYS[2])==1 then return 0 end; redis.call('SET',KEYS[1],ARGV[1]); redis.call('SET',KEYS[2],ARGV[1]); return 1",2,PREFIX+'dedup:'+key,PREFIX+'agency:'+agency,id]); if(!claimed) throw new Error('This agency or email is already in your SWL list.');
 const lead:Lead={id,company,email,website,area:String(input.area||'').slice(0,150),phone:String(input.phone||'').slice(0,50),source:String(input.source||website).slice(0,2000),createdAt:new Date().toISOString(),status:'new',consent:'',notes:'',subject:'A local removals partner for your clients',body:draft(company),sentAt:'',repliedAt:'',openedAt:'',followupAt:'',followupSentAt:'',suppressed:false,tracking:false};
 try{await patchLead(id,lead);await redis(['SADD',PREFIX+'leads',id]);}catch(e){await redis(['DEL',PREFIX+'dedup:'+key,PREFIX+'agency:'+agency]);throw e} return lead;
}
export function publicUrl(value:string) {try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname.includes('.')&&!/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)&&!u.hostname.includes(':')&&!/^\d+(\.\d+)*$/.test(u.hostname)&&!/\.(local|internal|test)$/.test(u.hostname)}catch{return false}}
export async function addEvent(event: Omit<MailEvent,'id'|'at'>) { const e={...event,id:randomUUID(),at:new Date().toISOString()};await redis(['LPUSH',PREFIX+'events',JSON.stringify(e)]);await redis(['LTRIM',PREFIX+'events',0,1999]);return e; }
export async function events():Promise<MailEvent[]> {return (await redis<string[]>(['LRANGE',PREFIX+'events',0,1999])).map(v=>JSON.parse(v));}
export async function settings():Promise<{autoFollowup:boolean;dailyCap:number;firecrawl?:string}> {const v=await redis<string|null>(['GET',PREFIX+'settings']);return v?JSON.parse(v):{autoFollowup:false,dailyCap:10};}
function encryptionKey(){if(!process.env.OUTREACH_SESSION_SECRET)throw new Error('Secret storage is unavailable.');return createHash('sha256').update(process.env.OUTREACH_SESSION_SECRET).digest()}
export function encrypt(value:string){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',encryptionKey(),iv);return Buffer.concat([iv,c.update(value),c.final(),c.getAuthTag()]).toString('base64')}
export function decrypt(value:string){const b=Buffer.from(value,'base64'),c=createDecipheriv('aes-256-gcm',encryptionKey(),b.subarray(0,12));c.setAuthTag(b.subarray(-16));return Buffer.concat([c.update(b.subarray(12,-16)),c.final()]).toString()}
export async function withLock<T>(name:string,fn:()=>Promise<T>):Promise<T>{const token=randomUUID(),key=PREFIX+'lock:'+name;const ok=await redis(['SET',key,token,'NX','EX',180]);if(!ok)throw new Error('This operation is already running.');try{return await fn()}finally{await redis(['EVAL',"if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end",1,key,token])}}
