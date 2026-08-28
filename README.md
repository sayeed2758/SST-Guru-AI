# SST GURU AI — NEXT v5 (OFFLINE-FIRST WORKING)

This build fixes the main issue visible in the screenshots: questions now get an immediate local SST answer even when no backend is connected.

## Main improvement
- Offline-first answer engine
- Follow-up understanding: "Ha samjhao", "aur detail", "continue" can use the previous topic
- Stronger starter knowledge: Hitler, French Revolution, Industrial Revolution, Hyksos, River/Sea/Ocean, Weather/Climate, Latitude/Longitude, Democracy/Republic, Constitution, Inflation, GDP, Mercantilism, etc.
- Story Mode gives an actual chronology for Hitler and French Revolution
- No "Backend URL not configured" dead-end
- If a valid backend URL is configured, live AI is attempted first; if it fails, local answer is shown
- All previous UI tools retained
- Mobile responsive

## Upload
Replace the old frontend files with the complete contents of this ZIP.

## Live AI
Deploy `backend/worker.js` to Cloudflare Workers, add the secret `OPENAI_API_KEY`, then paste only the Worker URL in Settings.

Never expose the API key in GitHub frontend code.
