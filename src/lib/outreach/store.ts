import { normaliseSettings, type OutreachSettings } from './policy';
import { blobCommand } from './blob-state';
import { randomUUID, createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
export const PREFIX = 'swl:outreach:v1:';
export type Lead = { id: string; company: string; area: string; website: string; email: string; phone: string; source: string; createdAt: string; status: string; consent: string; notes: string; subject: string; body: string; sentAt: string; repliedAt: string; openedAt: string; followupAt: string; followupSentAt: string; suppressed: boolean; tracking: boolean };
export type MailEvent = { id: string; leadId: string; kind: string; at: string; subject?: string; messageId?: string; detail?: string; token?: string };
export async function redis<T = unknown>(command: unknown[]): Promise<T> {
  if(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) return blobCommand<T>(command);
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) throw new Error('Persistent storage is not configured.');
  const r = await fetch(process.env.KV_REST_API_URL, {method:'POST', headers:{Authorization:`Bearer ${process.env.KV_REST_API_TOKEN}`,'Content-Type':'application/json'}, body:JSON.stringify(command),cache:'no-store',signal:AbortSignal.timeout(15000)});
  if (!r.ok) throw new Error('Storage is temporarily unavailable.');
  const d = await r.json(); if (d.error) { console.error('SWL outreach storage command error:',String(d.error).slice(0,200)); throw new Error('Storage operation failed.'); } return d.result as T;
}
export async function readLead(id: string): Promise<Lead | null> {
  const raw = await redis<string[]>(['HGETALL',PREFIX+'lead:'+id]); if (!raw?.length) return null;
  const fields: Record<string, unknown> = {}; for(let i=0;i<raw.length;i+=2) fields[raw[i]]=JSON.parse(raw[i+1]); return fields as Lead;
}
export async function patchLead(id: string, patch: Partial<Lead>) { const entries=Object.entries(patch); if(entries.length) await redis(['HSET',PREFIX+'lead:'+id,...entries.flatMap(([k,v])=>[k,JSON.stringify(v)])]); }
export async function allLeads(): Promise<Lead[]> { const ids=await redis<string[]>(['SMEMBERS',PREFIX+'leads']); return (await Promise.all(ids.map(readLead))).filter((v):v is Lead=>!!v).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); }
export function domain(value:string) {try{return new URL(value).hostname.toLowerCase().replace(/^www\./,'')}catch{return ''}}
export function draft(company:string,area='South West London') {return `Hi ${company} team,

When a buyer asks, "Can you recommend a reliable removals company?", we'd love to be a local contact your team can confidently pass on.

I'm Patrick from South West London Removals. We offer free, no-obligation, in-person surveys, so your clients in ${area||'South West London'} can meet a member of our team before deciding to book.

With a fleet of vehicles and experienced crews, we handle everything from one-bedroom apartments to substantial, high-value homes, including moves involving specialist items. We offer packing, furniture dismantling and reassembly, and nationwide collection and delivery.

Our polite, professional teams take pride in careful moves, planned around completion-day timings to help everything run smoothly.

Through our wider group, we can also help with property maintenance and repairs through Ryan Group.

If you'd like to get to know us first, Nathan, our owner, would be happy to arrange a quick phone call or a brief visit to your branch. Whichever suits your team.

Who would be the best person to arrange that with?

Kind regards,
Patrick
South West London Removals
info@swlremovals.co.uk
https://www.swlremovals.co.uk`;}
export function draftSubject(area:string){return `A local removals contact for your ${area||'South West London'} clients`.replace(/[\r\n]/g,' ').slice(0,200)}
export async function addLead(input: Partial<Lead>) {
 const company=String(input.company||'').trim().slice(0,180),email=String(input.email||'').trim().toLowerCase();
 if(!company || (email && !/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email)) || /[\r\n]/.test(email)) throw new Error('Enter an agency name and valid email address.');
 const website=String(input.website||'').trim(); if(website && !publicUrl(website)) throw new Error('Use a public HTTPS website.');
 const id=randomUUID(), key=email?'email:'+email:'domain:'+domain(website)+':'+company.toLowerCase();
 const agency=domain(website)||email.split('@')[1]||company.toLowerCase();
 const lead:Lead={id,company,email,website,area:String(input.area||'').slice(0,150),phone:String(input.phone||'').slice(0,50),source:String(input.source||website).slice(0,2000),createdAt:new Date().toISOString(),status:'new',consent:'',notes:'',subject:draftSubject(String(input.area||'')),body:draft(company,String(input.area||'')),sentAt:'',repliedAt:'',openedAt:'',followupAt:'',followupSentAt:'',suppressed:false,tracking:false};
 const outcome=JSON.parse(await redis<string>(['EVAL',`-- SWL_CREATE_LEAD
local existing=redis.call('GET',KEYS[1]) or redis.call('GET',KEYS[2]);
if existing and redis.call('HGET',ARGV[3]..existing,'id') then
 if redis.call('SISMEMBER',KEYS[4],existing)==1 then return cjson.encode({duplicate=true}) end;
 redis.call('SADD',KEYS[4],existing); return cjson.encode({id=existing,recovered=true});
end;
redis.call('SET',KEYS[1],ARGV[1]); redis.call('SET',KEYS[2],ARGV[1]);
for field,value in pairs(cjson.decode(ARGV[2])) do redis.call('HSET',KEYS[3],field,cjson.encode(value)) end;
redis.call('SADD',KEYS[4],ARGV[1]); return cjson.encode({id=ARGV[1]});`,4,PREFIX+'dedup:'+key,PREFIX+'agency:'+agency,PREFIX+'lead:'+id,PREFIX+'leads',id,JSON.stringify(lead),PREFIX+'lead:']));
 if(outcome.duplicate)throw new Error('This agency or email is already in your SWL list.');
 return outcome.recovered?(await readLead(outcome.id))!:lead;
}
export function publicUrl(value:string) {try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname.includes('.')&&!/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)&&!u.hostname.includes(':')&&!/^\d+(\.\d+)*$/.test(u.hostname)&&!/\.(local|internal|test)$/.test(u.hostname)}catch{return false}}
export async function addEvent(event: Omit<MailEvent,'id'|'at'>) { const e={...event,id:randomUUID(),at:new Date().toISOString()};await redis(['LPUSH',PREFIX+'events',JSON.stringify(e)]);await redis(['LTRIM',PREFIX+'events',0,1999]);return e; }
export async function events():Promise<MailEvent[]> {return (await redis<string[]>(['LRANGE',PREFIX+'events',0,1999])).map(v=>JSON.parse(v));}
export async function settings():Promise<OutreachSettings> {const v=await redis<string|null>(['GET',PREFIX+'settings']);return normaliseSettings(v?JSON.parse(v):{});}
function encryptionKey(){if(!process.env.OUTREACH_SESSION_SECRET)throw new Error('Secret storage is unavailable.');return createHash('sha256').update(process.env.OUTREACH_SESSION_SECRET).digest()}
export function encrypt(value:string){const iv=randomBytes(12),c=createCipheriv('aes-256-gcm',encryptionKey(),iv);return Buffer.concat([iv,c.update(value),c.final(),c.getAuthTag()]).toString('base64')}
export function decrypt(value:string){const b=Buffer.from(value,'base64'),c=createDecipheriv('aes-256-gcm',encryptionKey(),b.subarray(0,12));c.setAuthTag(b.subarray(-16));return Buffer.concat([c.update(b.subarray(12,-16)),c.final()]).toString()}
export async function withLock<T>(name:string,fn:()=>Promise<T>,seconds=180):Promise<T>{const token=randomUUID(),key=PREFIX+'lock:'+name;const ok=await redis(['SET',key,token,'NX','EX',seconds]);if(!ok)throw new Error('This operation is already running.');try{return await fn()}finally{await redis(['EVAL',"if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end",1,key,token])}}
