# 📚 SST GURU AI

A personalized Social Science AI assistant designed for an SST teacher.

## Included
- Premium responsive web UI
- SST-only system behavior
- Ask SST chat
- Story Mode
- Difficult Word Explainer
- Difference Maker
- Exam Mode
- Teacher Mode
- Local conversation history
- Light/Dark theme
- Built-in starter knowledge retrieval
- Secure backend architecture
- Cloudflare Worker backend
- Mobile responsive design

## Important
The project is complete as a working starter architecture, but the AI provider is not connected until you deploy the backend and add your API key.

### Quick start
1. Upload the project to a GitHub repository.
2. Deploy `backend/worker.js` as a Cloudflare Worker.
3. Add your provider API key to the Worker secret `OPENAI_API_KEY`.
4. Copy the Worker URL.
5. Edit `assets/js/config.js` and paste the URL into `API_URL`.
6. Enable GitHub Pages for the repository.
7. Open the GitHub Pages URL.

## Suggested next upgrade
For a truly deep SST knowledge system, replace the starter knowledge array with a RAG pipeline using your NCERT PDFs, notes, glossaries and chapter material. Keep source metadata so the AI can say where a fact came from.

## Project structure
sst-guru-ai/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── chat.css
│   └── js/
│       ├── app.js
│       ├── config.js
│       └── knowledge.js
├── backend/
│   ├── worker.js
│   └── README.md
├── data/
│   └── README.md
└── README.md
