import test from 'node:test';
import assert from 'node:assert/strict';
import { encrypt, decrypt, publicUrl, domain } from './store';
import { escapeHtml } from './mail';
test('private addresses and credential-bearing URLs cannot become research targets',()=>{for(const value of ['http://example.com','https://127.0.0.1','https://10.1.2.3','https://192.168.0.1','https://169.254.169.254','https://172.16.0.1','https://localhost','https://test.internal','https://user:password@example.com','https://[::1]','https://2130706433','https://example.com:444'])assert.equal(publicUrl(value),false,value);assert.equal(publicUrl('https://www.example.co.uk/contact'),true);assert.equal(domain('https://www.example.co.uk/contact'),'example.co.uk')});
test('saved API keys use authenticated encryption and reject modified data',()=>{process.env.OUTREACH_SESSION_SECRET='test-secret-only';const encrypted=encrypt('fc-test-key');assert.ok(!encrypted.includes('fc-test-key'));assert.equal(decrypt(encrypted),'fc-test-key');const b=Buffer.from(encrypted,'base64');b[15]^=1;assert.throws(()=>decrypt(b.toString('base64')))});
test('outgoing free text cannot inject email HTML',()=>{assert.equal(escapeHtml('<img src=x onerror="bad"> &'), '&lt;img src=x onerror=&quot;bad&quot;&gt; &amp;')});

test('suppressed, replied, unpermitted and ambiguous contacts cannot send',async()=>{
 const {sendLead}=await import('./mail');const {PREFIX}=await import('./store');const original=globalThis.fetch;
 process.env.KV_REST_API_URL='https://redis.example.test';process.env.KV_REST_API_TOKEN='unit-test';
 for(const patch of [{suppressed:true},{repliedAt:'2026-11-09T00:00:00Z'},{consent:''},{status:'uncertain',consent:'Requested by phone 9 November'}]){
 const lead={id:'lead',email:'info@example.com',status:'new',consent:'',suppressed:false,repliedAt:'',...patch};let calls=0;
 globalThis.fetch=async(_input,init)=>{calls++;const cmd=JSON.parse(String(init?.body));let result:unknown='OK';if(cmd[0]==='HGETALL')result=Object.entries(lead).flatMap(([k,v])=>[k,JSON.stringify(v)]);if(cmd[0]==='EVAL')result=1;assert.ok(String(cmd[1]||'').includes(PREFIX)||cmd[0]==='EVAL');return Response.json({result})};
 await assert.rejects(sendLead('lead'));assert.equal(calls,3,'only lock, contact read and lock release; no sending');
 }globalThis.fetch=original;
});
