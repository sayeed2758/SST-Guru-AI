# LIVE AI BACKEND

The frontend is fully usable without this backend through its local SST demo brain.

For deep open-ended AI:
1. Create a Cloudflare Worker.
2. Paste `worker.js`.
3. Add an encrypted Worker Secret named `OPENAI_API_KEY`.
4. Optional: add `MODEL`.
5. Deploy and copy the Worker URL.
6. In the SST GURU website open Settings and paste the Worker URL.

Never put the API key in GitHub frontend code.

For a public site, add rate limiting or authentication before sharing widely.
