# SST Knowledge Base

`assets/js/knowledge.js` contains a tiny starter retrieval layer so the app can ground common questions.

For the full personalized version, add your own structured SST sources:
- NCERT chapter notes
- glossary
- chapter-wise concepts
- timelines
- geography terms
- civics definitions
- economics concepts

Recommended record shape:

{
  id: "unique-id",
  tags: ["keywords"],
  title: "Topic title",
  text: "Short, reliable source passage."
}

For large books/PDFs, move to a proper vector/RAG database instead of putting the entire book into browser JavaScript.
