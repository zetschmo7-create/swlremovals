import { allLeads, PREFIX, redis, settings, withLock } from './store';
import { dailyQueue, eligibleInitial, londonDay } from './policy';
import { research } from './research';
import { sendLead, syncReplies } from './mail';
export type RunSummary={at:string;day:string;sent:number;researchAdded:number;researchStatus:string;eligible:number;held:number;errors:string[]};
export async function automationPreview(){const [leads,s,used,last]=await Promise.all([allLeads(),settings(),redis<string|null>(['GET',PREFIX+'daily:'+londonDay()]),redis<string|null>(['GET',PREFIX+'lastRun'])]);return {today:londonDay(),sentOrAttemptedToday:Number(used||0),remaining:Math.max(0,s.dailyCap-Number(used||0)),eligible:leads.filter(eligibleInitial).length,held:leads.filter(l=>l.email&&!l.sentAt&&!l.suppressed&&!l.consent?.trim()).length,queued:dailyQueue(leads,s,Number(used||0)).length,lastRun:last?JSON.parse(last) as RunSummary:null}}
export async function runDailyOutreach(){return withLock('daily-run',async()=>{
 const s=await settings(),day=londonDay();const result:RunSummary={at:new Date().toISOString(),day,sent:0,researchAdded:0,researchStatus:s.autoResearch?'pending':'paused',eligible:0,held:0,errors:[]};
 try{
  if(s.autoResearch){
   if(!process.env.FIRECRAWL_API_KEY&&!s.firecrawl)result.researchStatus='needs_firecrawl_connection';
   else if(await redis(['SET',PREFIX+'research-day:'+day,'started','NX','EX',172800])){
    try{const found=await withLock('research',()=>research(s.researchQuery));result.researchAdded=found.added;result.researchStatus='completed'}catch{result.researchStatus='failed';result.errors.push('Lead research failed. Check Firecrawl credentials and credits.');}
   }else result.researchStatus='already_attempted_today';
  }
  // Sync must succeed before any message is sent. A failed sync stops the run.
  if(s.autoInitial||s.autoFollowup)await syncReplies();
  const leads=await allLeads(),used=Number(await redis(['GET',PREFIX+'daily:'+day])||0);result.eligible=leads.filter(eligibleInitial).length;result.held=leads.filter(l=>l.email&&!l.sentAt&&!l.suppressed&&!l.consent?.trim()).length;
  for(const next of dailyQueue(leads,s,used)){
   // Re-read pause controls between sends; sendLead rechecks consent, replies and suppression.
   const latest=await settings();if(next.followup?!latest.autoFollowup:!latest.autoInitial)break;
   try{await sendLead(next.id,next.followup);result.sent++}catch{result.errors.push('A send was stopped or could not be confirmed. Review the agency activity before retrying.');break}
  }
 }catch{result.errors.push('Mailbox or storage check failed. Automatic sending stopped.');}
 await redis(['SET',PREFIX+'lastRun',JSON.stringify(result)]);return result;
 },330)}
