# SWL partnership dashboard

URL: `/admin/outreach` (`/admin` redirects here). This uses its own login and does not reset Jarvis credentials.

## Configuration

- Connected private Vercel Blob store `swl-outreach-private`: durable state at `swl-outreach/state-v1.json`. Uses fresh reads and ETag conditional writes to prevent lost updates. The previous Jarvis Redis integration was uninstalled and is not modified. Legacy KV support remains only when no Blob store is configured.
- `OUTREACH_PASSWORD_HASH`: scrypt salt:hex hash; `OUTREACH_SESSION_SECRET`: random session/encryption secret. Changing the latter invalidates sessions and encrypted integration settings.
- Existing `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SWL Hostinger mailbox. Only `info@swlremovals.co.uk` is allowed as sender. `IMAP_HOST` optionally overrides `imap.hostinger.com`.
- `FIRECRAWL_API_KEY`, or an API key entered into the dashboard's Connections form. Stored AES-256-GCM encrypted in private storage and never returned to the browser. ChatGPT OAuth does not provision this app's API access.
- `CRON_SECRET`: protects daily 08:00 UTC reply-sync/follow-up job.
- `OUTREACH_HOSTINGER_WEBHOOK_SECRET`: Hostinger `message.received` notification bearer secret. POST `/api/outreach/webhook` ignores notification content and performs an inbox reply check; it never sends mail.

No secrets or runtime contact records are committed to Git. Authenticated mutations require same-origin requests; login attempts are rate limited in private storage. Pages and APIs are non-indexable; contact API responses are private/no-store.

## Workflow

Seed imports only Elizabeth Wightwick and Douglas & Gordon East Putney, the two SWL-assigned contacts. Ryan contacts are excluded. Research finds up to five official pages, extracts public organizational contact details and imports unsent prospects. Deduplication blocks duplicate email addresses and agency domains. Review retrieved records before use.

Hostinger solicited-email policy is enforced by requiring recorded permission before every send. Initial introductions require an explicit dashboard action. Automatic follow-ups default off; when enabled, one follow-up is due after five days. A reply-sync failure stops the scheduled send run. Replies are matched by agency address plus message references, not subject alone. INBOX scan is bounded to the newest 500 messages. Moved/deleted messages, different reply addresses and reference-stripping mail systems may need manual review. Bounce/auto-reply messages do not count as human replies.

SMTP acceptance is not delivery confirmation. A send with an ambiguous outcome is marked `uncertain` and blocked from automatic retry. Check the real mailbox before resolving it. Copies of sent introductions are recorded in the dashboard; SMTP does not automatically append messages to Hostinger Sent.

Open tracking defaults off per contact. Only enable with appropriate permission. An image-load signal cannot establish a human read; Apple/privacy proxies can load automatically and clients can block images. Tokens expire in one year. Unsubscribe requires a POST confirmation so mail scanners visiting links do not automatically suppress contacts.

No bulk initial campaign is launched on deployment. Daily send cap defaults to ten (including follow-ups), configurable to a maximum of thirty. Research uses normal Firecrawl credits.

## Validation

`npx tsc --noEmit`; `npm run build`; `node --import tsx --test src/lib/outreach/outreach.test.ts` when tsx is installed.
