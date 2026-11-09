import { after } from 'next/server';
import { equal } from '@/lib/outreach/auth';
import { syncReplies } from '@/lib/outreach/mail';
export const runtime='nodejs';export const maxDuration=60;
export async function POST(r:Request){const secret=process.env.OUTREACH_HOSTINGER_WEBHOOK_SECRET;if(!secret||!equal(r.headers.get('authorization')||'','Bearer '+secret))return new Response('Unauthorized',{status:401});
 // Webhook content is deliberately ignored: inbound messages cannot issue commands or trigger sends.
 after(async()=>{try{await syncReplies()}catch{console.warn('SWL outreach reply check deferred to next sync.')}});return Response.json({accepted:true},{status:202})}
