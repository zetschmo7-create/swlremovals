import type { Lead } from './store';
export const MAX_DAILY_SENDS=5;
export const DEFAULT_RESEARCH_QUERY='independent estate agencies in Wimbledon, Putney, Wandsworth, Earlsfield and Southfields';
export type OutreachSettings={autoFollowup:boolean;autoInitial:boolean;autoResearch:boolean;dailyCap:number;researchQuery:string;firecrawl?:string};
export function normaliseSettings(raw:Partial<OutreachSettings>={}):OutreachSettings{return {autoFollowup:raw.autoFollowup===true,autoInitial:raw.autoInitial===true,autoResearch:raw.autoResearch===true,dailyCap:Math.min(MAX_DAILY_SENDS,Math.max(1,Math.floor(Number(raw.dailyCap)||MAX_DAILY_SENDS))),researchQuery:typeof raw.researchQuery==='string'&&raw.researchQuery.trim()?raw.researchQuery.trim().slice(0,300):DEFAULT_RESEARCH_QUERY,...(raw.firecrawl?{firecrawl:raw.firecrawl}:{})}}
export function londonDay(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function eligibleInitial(l:Lead){return !!(l.email&&l.consent?.trim()&&!l.sentAt&&!l.suppressed&&!l.repliedAt&&!['declined','sending','uncertain'].includes(l.status))}
export function eligibleFollowup(l:Lead,now=new Date()){return !!(l.email&&l.consent?.trim()&&l.sentAt&&l.followupAt&&Date.parse(l.followupAt)<=now.getTime()&&!l.followupSentAt&&!l.suppressed&&!l.repliedAt&&!['declined','sending','uncertain'].includes(l.status))}
export function dailyQueue(leads:Lead[],s:OutreachSettings,used:number,now=new Date()){
 const initial=s.autoInitial?leads.filter(eligibleInitial).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).map(l=>({id:l.id,followup:false})):[];
 const followups=s.autoFollowup?leads.filter(l=>eligibleFollowup(l,now)).sort((a,b)=>a.followupAt.localeCompare(b.followupAt)).map(l=>({id:l.id,followup:true})):[];
 return [...initial,...followups].slice(0,Math.max(0,s.dailyCap-used));
}
