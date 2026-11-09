import { equal } from '@/lib/outreach/auth';
import { allLeads, settings } from '@/lib/outreach/store';
import { syncReplies, sendLead } from '@/lib/outreach/mail';
export const maxDuration=300;export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(r:Request){if(!process.env.CRON_SECRET||!equal(r.headers.get('authorization')||'','Bearer '+process.env.CRON_SECRET))return new Response('Unauthorized',{status:401});try{const sync=await syncReplies();const s=await settings();let sent=0;if(s.autoFollowup){for(const l of (await allLeads()).filter(l=>l.sentAt&&!l.followupSentAt&&l.followupAt&&Date.parse(l.followupAt)<=Date.now()&&!l.repliedAt&&!l.suppressed&&l.consent).slice(0,s.dailyCap)){await sendLead(l.id,true);sent++}}return Response.json({sync,sent})}catch{return Response.json({error:'Outreach sync failed; sending stopped.'},{status:503})}}
