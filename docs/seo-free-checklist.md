# SWL free SEO operations

Authorised 19 October 2026: execute the free actions from the user's 11-page SEO and lead growth checklist. Existing limits still apply: no paid purchases, billing or plan changes, URL changes, deletion, unsupported business facts, or unsolicited outreach. Prioritise `/wimbledon-removals`. Never import Ryan Removals policies.

## Current work and next actions

| Workstream | Evidence / status | Next action |
| --- | --- | --- |
| Wimbledon page | Existing title, canonical, local access guidance and FAQs improved 18 October | Check GSC page/query data after verified connection. Improve this URL rather than create a duplicate. |
| Blog | Repository renderer, index, sitemap and article ID registry implemented | Publish only finished, checked articles on/after their scheduled date. Never publish future content early. |
| Lead interactions | Existing GA4 tag `G-5YWQH7FKBC`; phone, WhatsApp, form-open and form-ready signals added | Verify GA delivery/account access. Clicks and form preparation are not confirmed enquiries or bookings. |
| Standalone quote | Previous form displayed success without sending data | Explicit WhatsApp handoff to verified SWL number. User must press Send in WhatsApp. No video upload is claimed. |
| MoveFlow intake | Existing modal tenant loads; intake header still has old phone, malformed WhatsApp URL and a different return domain | Queue tenant configuration review. Do not guess a different tenant or claim submission receipt. |
| Search Console | 19 October: Google account reports no access to domain property; Distribb disconnected | User completes ownership verification and Google authorisation. Then inspect index coverage, sitemap and Wimbledon metrics. |
| Business details | Verified GBP manager accessible; correct current phone, 24-hour opening | Keep site/listings consistent. Address: 30 Durham Rd, Raynes Park, London SW20 0TW. Phone: 020 8080 5865. WhatsApp: 07522 908555. Email: info@swlremovals.co.uk. |
| Structured data | Removed unsourced aggregate rating; hours matched to verified GBP | Use verifiable organisation/service facts only. No awards or invented ratings. |
| Crawlers | robots allows public site, excludes admin | Recheck after releases. Do not expose admin/API data for AI crawlers. |
| Citations | Separate citation task already has previous receipts and live/pending lists | Recheck duplicates and current free tiers. Update existing records. Count only verified live URLs as live. |
| GBP | Primary category moving service; contact details current. Revised description submitted 19 October and confirmed as current. New Wimbledon planning post submitted and pending Google review | Check post approval before counting it live; review services and post useful weekly advice. Use only real supplied photos. Never invent images of actual jobs. |
| Reviews | No verified completed-job customer feed available to this workflow | Prepare neutral review-request wording and verified review link; do not contact customers without separate explicit messaging authorisation. |
| Hubs/town pages | Existing location data contains 100 pages. Walton-on-Thames, Farnham, Dorking, Camberley and Wallington already exist | Audit Chertsey, Byfleet, Egham, Bagshot, Horley and Ewell as candidate gaps, not confirmed demand. Add only genuinely missing served areas, distinct local facts and relevant links. Preserve existing URLs. |
| Costs and local PR | Real SWL price ranges and completed-job data not supplied | Queue questions; never reuse Ryan prices, competitor prices or hypothetical jobs as SWL evidence. |
| Free link opportunities | Supplier mentions, local organisations, relevant directories and unlinked mentions | Research and prepare factual opportunities. No reciprocal link schemes, cold messages or journalist responses without explicit sending authority. |
| Paid actions | Which?, Checkatrade, BAR fees, sponsorships, editorial placements, paid tool tiers | Excluded unless user separately approves a specific charge. A PDF calling a service free is not proof of its current terms. |
| Measurement | No verified SWL GSC/GA reporting source connected | Establish baseline first. Never use Surrey Removals' metrics as SWL performance or promise rankings/leads. |

## Repository publishing procedure

1. Read Distribb project 2021 and the exact article/brief. Recheck required links, word target, images, CTA and editorial restrictions. Leave anything currently being written alone.
2. Fetch current main and current live page. Preserve the article ID and slug. Check `src/content/blog/<articleId>.json` to prevent duplicates. Do not add a record before its existing publication date/time in Europe/London.
3. Store the reviewed HTML fragment exactly in `content`. Include articleId, slug, title, description, publishedDate (actual first-publication date), sourceModifiedAt, featureImage, featureAlt, wordTarget and requiredLinks. This is reviewed repository content, not a public-input endpoint.
4. Run `node scripts/validate-blog.mjs`, focused ESLint and the production build. Review required links/images, desktop and mobile layout, title/canonical, FAQ and table of contents. Take a rollback commit reference.
5. Commit only intended changes via the connected GitHub tools. Verify the exact repo and Vercel project/team before release. Reject a moved main-branch lease and reread rather than overwriting others' changes.
6. Wait for the exact deployment to be READY. Open article, index, sitemap and image URLs. Confirm the article appears on the index. Compare the rendered article body with the saved Distribb copy.
7. Distribb has no supported external-live-URL setter in its documented article update fields. Do not invent a Published state or claim its CMS integration is connected. The repository record and verified URL prove website publication. Report the separate Distribb status accurately and escalate supported reconciliation if needed.

No new paid CMS, database, webhook service or scheduled hosting process is needed for this publishing route. The existing ChatGPT tasks perform checked repository updates. Existing provider subscriptions and hosting limits remain the user's responsibility; do not buy additional capacity.
