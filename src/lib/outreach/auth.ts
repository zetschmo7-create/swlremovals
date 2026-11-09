import { createHmac, timingSafeEqual, scryptSync } from 'node:crypto';
import { cookies } from 'next/headers';
import { PREFIX, redis } from './store';
export const COOKIE='swl_outreach_session';
export function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function passwordValid(password:string){const [salt,hash]=(process.env.OUTREACH_PASSWORD_HASH||'').split(':');return !!salt&&!!hash&&equal(scryptSync(password,salt,32).toString('hex'),hash)}
function sign(value:string){if(!process.env.OUTREACH_SESSION_SECRET)throw new Error('Login is not configured.');return createHmac('sha256',process.env.OUTREACH_SESSION_SECRET).update(value).digest('hex')}
export function sessionToken(){const value=Buffer.from(JSON.stringify({exp:Date.now()+8*3600000})).toString('base64url');return value+'.'+sign(value)}
export async function authed(){try{const t=(await cookies()).get(COOKIE)?.value||'',parts=t.split('.');return parts.length===2&&equal(parts[1],sign(parts[0]))&&JSON.parse(Buffer.from(parts[0],'base64url').toString()).exp>Date.now()}catch{return false}}
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin}
export async function loginRate(r:Request){const ip=(r.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim();const k=PREFIX+'login:'+createHmac('sha256',process.env.OUTREACH_SESSION_SECRET||'rate').update(ip).digest('hex');const n=await redis<number>(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n",1,k]);return n<=10}
