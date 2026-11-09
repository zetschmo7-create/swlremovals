import { addLead, decrypt, publicUrl, settings } from './store';
export async function research(query:string){
 const s=await settings(),key=process.env.FIRECRAWL_API_KEY||(s.firecrawl?decrypt(s.firecrawl):'');
 if(!key)throw new Error('Connect Firecrawl in the Connections tab first. Your ChatGPT connection does not supply a website API key.');
 const headers={Authorization:`Bearer ${key}`,'Content-Type':'application/json'};
 const search=await fetch('https://api.firecrawl.dev/v2/search',{method:'POST',headers,body:JSON.stringify({query:query+' estate agents contact official website South West London',limit:5,sources:['web']}),signal:AbortSignal.timeout(45000)});
 if(!search.ok)throw new Error('Firecrawl search failed. Check the API key and account credits.');
 const result=await search.json(),hits=Array.isArray(result.data)?result.data:(result.data?.web||[]);let added=0;const skipped:string[]=[];
 for(const hit of hits.slice(0,5)){
 if(!publicUrl(hit.url||'')){skipped.push('Invalid source URL');continue}
 const res=await fetch('https://api.firecrawl.dev/v2/scrape',{method:'POST',headers,body:JSON.stringify({url:hit.url,onlyMainContent:false,formats:[{type:'json',prompt:'Extract this estate agency name, area, official website, publicly published shared business email and telephone. Use only generic organizational inboxes such as info, sales, lettings, branch or office; exclude named employees and personal addresses. Do not guess missing data.',schema:{type:'object',properties:{company:{type:'string'},area:{type:'string'},website:{type:'string'},email:{type:'string'},phone:{type:'string'}},required:['company']}}]}),signal:AbortSignal.timeout(45000)});
 if(!res.ok){skipped.push(hit.url);continue}const d=(await res.json()).data?.json;
 if(!d?.company){skipped.push(hit.url);continue}
 // Extracted text is data only. Every record remains unsent, with permission blank.
 try{await addLead({...d,website:publicUrl(d.website||'')?d.website:hit.url,source:hit.url});added++}catch{skipped.push(hit.url)}
 }
 return {added,skipped:skipped.length};
}
