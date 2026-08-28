SST GURU AI V8 — TRUE SST BRAIN
===================================

WHAT THIS VERSION CHANGES
--------------------------
V7 had an offline starter knowledge brain. V8 adds a real server-side AI backend.
The GitHub frontend remains safe: NO API key is stored in index.html.

The Worker sends questions to Gemini with a strict SST-only system instruction.
The assistant can answer broad SST questions rather than only the built-in examples.

SST scope:
- History: India + World, ancient/medieval/modern, political/social/economic/cultural
- Geography: physical + human + economic + environmental
- Civics/Political Science
- Economics
- School/CBSE-style explanations, exam answers, comparisons, timelines and teaching help

FILES
-----
index.html                 -> Upload/replace your GitHub Pages index.html
backend/worker.js          -> Cloudflare Worker backend
backend/wrangler.jsonc    -> Worker config

SETUP
-----
1. Keep index.html in your GitHub Pages root.
2. Deploy backend/worker.js as a Cloudflare Worker.
3. Add a Worker SECRET named GEMINI_API_KEY.
4. The Worker config already sets GEMINI_MODEL=gemini-3.7-flash.
5. Copy your deployed Worker URL.
6. In SST GURU AI -> Settings, paste the Worker URL.
7. Save Settings.
8. Ask any SST question.

SECURITY
--------
Never put GEMINI_API_KEY in GitHub/frontend code.
Use Cloudflare Worker Secrets.

Optional CLI:
  cd backend
  npx wrangler deploy
  npx wrangler secret put GEMINI_API_KEY

Then set the deployed Worker URL in the website Settings.

TEST
----
Open:
  https://YOUR-WORKER-URL/health

Expected:
  {"ok":true,"service":"SST GURU AI","mode":"SST-only","live":true}

Then test the website:
  "Hyksos kaun the?"
  "Why did the French Revolution happen?"
  "River, sea aur ocean mein difference?"
  "Mercantilism ka simple meaning?"
  "Explain the causes of Indian nationalism like a story."
  "Class 8 ke students ko latitude longitude kaise samjhaun?"

IMPORTANT
---------
Without the backend, the site still works with its offline SST brain.
For broad "anything in SST" capability, connect the Worker.

V8 is deliberately SST-only. If asked a non-SST question, it redirects the user
back to History, Geography, Civics/Political Science or Economics.
