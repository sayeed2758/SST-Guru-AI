# 📚 SST GURU AI v3 — Layers 1–14

This is a substantial working starter build designed for an SST teacher.

## Layer coverage

1. Premium responsive UI/UX
2. Dedicated learning modes
3. Conversation engine
4. Local personal preferences
5. Local conversation history + export
6. AI backend connector
7. SST-only rules/prompt
8. Starter SST knowledge base
9. Retrieval layer (browser-side starter RAG)
10. Accuracy-oriented backend instructions
11. Explanation engine / modes
12. Timeline + visual learning foundation
13. Quiz + Teacher Studio + Exam tools
14. Personal SST Library with local indexing

## Buttons already wired
- Ask SST
- Story / Word / Difference / Exam / Teacher modes
- New Conversation
- Theme
- Clear Local Data
- Export Chat
- Voice input
- Read aloud
- Copy
- Make Simpler
- Timeline Builder
- Quiz Lab
- Library upload/index/remove
- Settings

## Important
The local SST demo brain works for built-in topics and provides structured fallback responses for other SST questions.
For true deep open-ended AI, deploy `backend/worker.js`, add `OPENAI_API_KEY` to the Worker, and paste the Worker URL in Settings.

## GitHub Pages
Upload the project files to the root of a GitHub repository and enable GitHub Pages from the repository's Pages settings.

## Production upgrade
For a truly deep source-grounded assistant:
NCERT/notes → extract → clean/chunk → embeddings → vector DB → retrieve → answer with source labels.
