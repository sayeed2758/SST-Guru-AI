# Backend Setup — Cloudflare Worker

## Why a backend?
Never put an AI API key directly in GitHub Pages JavaScript. Anyone can inspect the browser code.

## Deploy
1. Open Cloudflare Dashboard → Workers & Pages.
2. Create a Worker.
3. Paste `worker.js`.
4. Add an encrypted Worker secret named `OPENAI_API_KEY`.
5. Optional: add a Worker variable named `MODEL` if you want a different supported model.
6. Deploy.
7. Copy the Worker URL.

Then edit:

`frontend/assets/js/config.js`

and set:

`API_URL: "https://YOUR-WORKER.workers.dev"`

## Test
Open the Worker URL. You should receive:

`{"error":"SST GURU backend is running."}`

Then open the GitHub Pages site and ask an SST question.

## Security notes
- Keep the API key only as a Worker secret.
- For a public site, add rate limiting/authentication before sharing widely.
- Never commit `.env` or API keys to GitHub.
