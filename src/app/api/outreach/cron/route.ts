import { equal } from '@/lib/outreach/auth';
import { runDailyOutreach } from '@/lib/outreach/automation';
export const maxDuration=300;export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(r:Request){if(!process.env.CRON_SECRET||!equal(r.headers.get('authorization')||'','Bearer '+process.env.CRON_SECRET))return new Response('Unauthorized',{status:401});try{const result=await runDailyOutreach();return Response.json(result,{status:result.errors.length?503:200})}catch{return Response.json({error:'Daily outreach is already running or temporarily unavailable.'},{status:503})}}
