import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { randomUUID } from 'node:crypto';
import { addEvent, allLeads, events, patchLead, PREFIX, readLead, redis, settings, withLock } from './store';
const ORIGIN='https://www.swlremovals.co.uk';
export function mailConfig(){return {host:process.env.SMTP_HOST||'smtp.hostinger.com',port:Number(process.env.SMTP_PORT||465),user:process.env.SMTP_USER||'',pass:process.env.SMTP_PASS||''}}
export function mailReady(){const c=mailConfig();return !!c.user&&!!c.pass}
export function escapeHtml(v:string){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))}
export async function sendLead(id:string,followup=false){return withLock('send:'+id,async()=>{
 const lead=await readLead(id);if(!lead)throw new Error('Lead not found.');
 if(lead.suppressed||lead.repliedAt||lead.status==='declined')throw new Error('Sending stopped for this contact.');
 if(!lead.email||!lead.consent.trim())throw new Error('Record when the agency requested or agreed to receive this email before sending through Hostinger.');
 if(!followup&&lead.sentAt)throw new Error('An introduction was already sent.');
 if(followup&&(!lead.sentAt||lead.followupSentAt||!lead.followupAt||Date.parse(lead.followupAt)>Date.now()))throw new Error('No follow-up is due.');
 if(lead.status==='sending'||lead.status==='uncertain')throw new Error('Check the mailbox before retrying this send.');
 const c=mailConfig();if(!mailReady()||c.user.toLowerCase()!=='info@swlremovals.co.uk')throw new Error('The SWL Hostinger sender needs verification in Connections.');
 const config=await settings(),day=new Date().toISOString().slice(0,10);const count=await redis<number>(['EVAL',"local n=tonumber(redis.call('GET',KEYS[1]) or '0'); if n>=tonumber(ARGV[1]) then return -1 end; n=redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1],172800); return n",1,PREFIX+'daily:'+day,config.dailyCap]);if(count===-1)throw new Error('Daily sending cap reached.');
 const token=randomUUID(),messageId=`<swl-outreach-${randomUUID()}@swlremovals.co.uk>`;
 const subject=followup?'Re: '+lead.subject:lead.subject;
 const body=followup?`Hi ${lead.company} team,\n\nJust following up on my introduction below. Happy to chat if having a local removals contact would be useful.\n\nKind regards,\nPatrick\nSouth West London Removals\n\n---\n${lead.body}`:lead.body;
 if(!subject.trim()||subject.length>200||/[\r\n]/.test(subject)||!body.trim()||body.length>15000)throw new Error('Check the email subject and message.');
 const previous=(await events()).find(e=>e.leadId===id&&e.kind==='sent');
 const unsub=ORIGIN+'/api/outreach/unsubscribe/'+token;
 await redis(['SET',PREFIX+'token:'+token,JSON.stringify({leadId:id,tracking:lead.tracking}), 'EX',31536000]);
 await patchLead(id,{status:'sending'});await addEvent({leadId:id,kind:'sending',subject,messageId,token});
 const transport=nodemailer.createTransport({host:c.host,port:c.port,secure:c.port===465,requireTLS:c.port!==465,auth:{user:c.user,pass:c.pass},connectionTimeout:12000,socketTimeout:25000});
 try{const result=await transport.sendMail({from:{name:'Patrick – South West London Removals',address:c.user},to:lead.email,replyTo:c.user,subject,text:body+'\n\nStop further emails: '+unsub,html:'<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">'+escapeHtml(body)+'</div><p><a href="'+unsub+'">Stop further emails</a></p>'+(lead.tracking?'<img src="'+ORIGIN+'/api/outreach/track/'+token+'" width="1" height="1" alt="" />':''),messageId,inReplyTo:followup?previous?.messageId:undefined,references:followup?previous?.messageId:undefined,headers:{'List-Unsubscribe':`<${unsub}>`}});
 if(!result.accepted?.length)throw new Error('SMTP did not accept the recipient.');
 const now=new Date().toISOString();await patchLead(id,followup?{status:'sent',followupSentAt:now}:{status:'sent',sentAt:now,followupAt:new Date(Date.now()+5*86400000).toISOString()});await addEvent({leadId:id,kind:followup?'followup_sent':'sent',subject,messageId,detail:'Accepted by Hostinger SMTP; delivery is not confirmed.'});
 return {ok:true};
 }catch{await patchLead(id,{status:'uncertain'});await addEvent({leadId:id,kind:'send_uncertain',subject,messageId,detail:'Sending did not complete cleanly. Check the mailbox before any retry.'});throw new Error('Send could not be confirmed. Check Hostinger before retrying to avoid duplicates.');}finally{transport.close()}
})}
export async function testMailbox(){const c=mailConfig();if(!mailReady()||c.user.toLowerCase()!=='info@swlremovals.co.uk')throw new Error('SWL mailbox credentials are not configured.');const transport=nodemailer.createTransport({host:c.host,port:c.port,secure:c.port===465,requireTLS:c.port!==465,auth:{user:c.user,pass:c.pass},connectionTimeout:10000,socketTimeout:12000});try{await transport.verify()}finally{transport.close()}const inbox=new ImapFlow({host:process.env.IMAP_HOST||'imap.hostinger.com',port:993,secure:true,auth:{user:c.user,pass:c.pass},logger:false,connectionTimeout:12000,socketTimeout:15000});try{await inbox.connect();await inbox.mailboxOpen('INBOX',{readOnly:true})}finally{await inbox.logout().catch(()=>{})}return {ok:true}}
export async function syncReplies(){return withLock('inbox',async()=>{
 const c=mailConfig();if(!mailReady())throw new Error('Mailbox is not configured.');
 const leads=(await allLeads()).filter(l=>l.sentAt),history=await events();
 if(!leads.length){await redis(['SET',PREFIX+'lastSync',new Date().toISOString()]);return {matched:0,note:'No sent outreach emails to match yet.'}}
 const client=new ImapFlow({host:process.env.IMAP_HOST||'imap.hostinger.com',port:993,secure:true,auth:{user:c.user,pass:c.pass},logger:false,connectionTimeout:12000,socketTimeout:20000});
 let matched=0;await client.connect();try{const lock=await client.getMailboxLock('INBOX');try{const exists=client.mailbox?client.mailbox.exists:0;if(exists){for await(const msg of client.fetch(`${Math.max(1,exists-499)}:*`,{uid:true,envelope:true,headers:['in-reply-to','references','auto-submitted','content-type']})){
 const env=msg.envelope;if(!env)continue;const headers=msg.headers?.toString()||'';
 if(/auto-submitted:\s*(?!no\b)\S+/i.test(headers)||/multipart\/report/i.test(headers)||/mailer-daemon|postmaster/i.test(env.from?.[0]?.address||''))continue;
 const from=(env.from?.[0]?.address||'').toLowerCase(),at=env.date?new Date(env.date).toISOString():'';
 const lead=leads.find(l=>l.email===from&&at>=l.sentAt&&history.some(e=>e.leadId===l.id&&e.messageId&&(env.inReplyTo===e.messageId||headers.includes(e.messageId))));
 if(!lead)continue;const unique=await redis(['SET',PREFIX+'reply:'+lead.id+':'+msg.uid,'1','NX']);if(!unique)continue;
 await patchLead(lead.id,{repliedAt:at,status:lead.suppressed?'suppressed':'replied',followupAt:''});await addEvent({leadId:lead.id,kind:'reply',subject:env.subject||'',detail:'Matched reply from the agency address in Hostinger INBOX.'});matched++;
 }}}finally{lock.release()}}finally{await client.logout().catch(()=>{})}
 await redis(['SET',PREFIX+'lastSync',new Date().toISOString()]);return {matched};
})}
