import { addLead, allLeads, decrypt, domain, publicUrl, settings } from './store';
export async function research(query:string){
 const s=await settings(),key=process.env.FIRECRAWL_API_KEY||(s.firecrawl?decrypt(s.firecrawl):'');
 if(!key)throw new Error('Connect Firecrawl in the Connections tab first. Your ChatGPT connection does not supply a website API key.');
 const headers={Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
 const exclude=[...new Set((await allLeads()).map(l=>domain(l.website)).filter(Boolean))].slice(0,50).map(d=>'-site:'+d).join(' ');
 const search=await fetch('https://api.firecrawl.dev/v2/search',{method:'POST',headers,body:JSON.stringify({query:query+' estate agents contact official website South West London '+exclude,limit:5,sources:['web']}),signal:AbortSignal.timeout(20000)});
 if(!search.ok)throw new Error('Firecrawl search failed. Check the API key and account credits.');
 const result=await search.json(),hits=Array.isArray(result.data)?result.data:(result.data?.web||[]);let added=0,skipped=0;
 // Reads can run together; contact writes stay sequential and atomic.
 const pages=await Promise.allSettled(hits.slice(0,5).map(async(hit:{url:string})=>{
  if(!publicUrl(hit.url||''))throw new Error('Invalid source URL');
  const res=await fetch('https://api.firecrawl.dev/v2/scrape',{method:'POST',headers,body:JSON.stringify({url:hit.url,onlyMainContent:false,formats:['markdown',{type:'json',prompt:'Extract this estate agency name, area, official website, publicly published shared business email and telephone. Use only generic organizational inboxes such as info, sales, lettings, branch or office; exclude named employees and personal addresses. Do not guess missing data. Set isAgency false for directories, portals and articles rather than an agency official website.',schema:{type:'object',properties:{company:{type:'string'},area:{type:'string'},website:{type:'string'},email:{type:'string'},phone:{type:'string'},isAgency:{type:'boolean'}},required:['company','isAgency']}}]}),signal:AbortSignal.timeout(25000)});
  if(!res.ok)throw new Error('Page unavailable');const page=(await res.json()).data,d=page?.json;
  if(!d?.company||d.isAgency!==true)throw new Error('Not an agency source');
  if(d.email&&!String(page.markdown||'').toLowerCase().includes(String(d.email).toLowerCase()))d.email='';
  const website=publicUrl(d.website||'')?d.website:hit.url;
  if(domain(website)!==domain(hit.url))throw new Error('Not an official contact source');
  return {...d,website,source:hit.url};
 }));
 for(const page of pages){if(page.status==='rejected'){skipped++;continue}try{await addLead(page.value);added++}catch(e){if(e instanceof Error&&e.message.includes('already'))skipped++;else throw e}}
 return {added,skipped};
}
