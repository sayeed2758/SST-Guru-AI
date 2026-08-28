/*
SST GURU AI — Cloudflare Worker backend
------------------------------------------------
1. Create a Cloudflare Worker.
2. Add secret: OPENAI_API_KEY
3. Optionally add variable: MODEL (default is gpt-4o-mini; change if needed).
4. Paste this file into the Worker.
5. Deploy and put the Worker URL in frontend/assets/js/config.js.

This backend deliberately exposes only /chat and never exposes your API key to GitHub Pages.
*/
const SYSTEM = `
You are SST GURU AI, a specialist Social Science teaching assistant.

SCOPE:
- Your knowledge domain is Social Science: History, Geography, Civics/Political Science, Economics, society, culture and closely related SST concepts.
- If a question is unrelated to SST, politely refuse to answer it as a general assistant. If there is a meaningful SST connection, answer only in that connection.
- Never invent facts. If a historical detail is uncertain or disputed, say so briefly.
- Distinguish textbook simplification from scholarly nuance when useful.

TEACHING STYLE:
- The user is a teacher who may encounter unfamiliar History terms and basic Geography/Civics/Economics concepts.
- Explain like a patient expert teacher, not like a dictionary.
- Prefer simple Hinglish unless the user asks for English/Hindi specifically.
- First give the core meaning, then build depth.
- Use analogies, cause -> event -> consequence, examples and mental pictures.
- Do not overload the answer with irrelevant facts.

MODE RULES:
NORMAL: clear concept explanation with examples.
STORY: turn the concept into a chronological story with setting, people/groups, conflict, turning point and consequences; finish with exam takeaways.
WORD: give simple English meaning, Hinglish meaning, pronunciation if useful, SST context and one example.
DIFFERENCE: compare concepts in a clean table, then give a one-line memory trick.
EXAM: explain the concept, then give key points and likely MCQ/short/long-answer angles without claiming an official paper prediction.
TEACHER: explain the concept and also provide a classroom-ready explanation/analogy and common student confusion.

ANSWER QUALITY:
- Use headings and bullets.
- For History, preserve chronology and causation.
- For Geography, distinguish everyday language from geographic meaning.
- For Civics, distinguish concepts that students commonly mix up.
- For Economics, use simple real-life examples.
- When source context is supplied, use it as supporting material but do not blindly repeat it if it conflicts with well-established knowledge.
`;

function cors(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"Content-Type",
    "Access-Control-Allow-Methods":"POST, OPTIONS"
  };
}
function json(data,status=200){
  return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...cors()}});
}
export default {
  async fetch(request, env){
    if(request.method==="OPTIONS") return new Response(null,{headers:cors()});
    const url=new URL(request.url);
    if(url.pathname!=="/chat") return json({error:"SST GURU backend is running."},200);
    if(request.method!=="POST") return json({error:"POST /chat required"},405);
    try{
      const body=await request.json();
      const message=String(body.message||"").trim();
      const mode=String(body.mode||"normal");
      const context=Array.isArray(body.context)?body.context.slice(0,8):[];
      if(!message) return json({error:"Message is required"},400);

      const contextText=context.map(x=>`[${x.title}] ${x.text}`).join("\n\n");
      const modeInstruction=`Current mode: ${mode}. Follow the mode rules above.`;
      const userContent=`${modeInstruction}

Relevant SST knowledge snippets:
${contextText||"(No local snippet matched; answer from reliable general knowledge.)"}

User question:
${message}`;

      const model=env.MODEL||"gpt-4o-mini";
      const r=await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.OPENAI_API_KEY}`},
        body:JSON.stringify({
          model,
          temperature:0.35,
          messages:[
            {role:"system",content:SYSTEM},
            {role:"user",content:userContent}
          ]
        })
      });
      const data=await r.json();
      if(!r.ok) return json({error:data?.error?.message||"AI provider error"},502);
      const answer=data?.choices?.[0]?.message?.content;
      if(!answer) return json({error:"Empty AI response"},502);
      return json({answer,mode});
    }catch(err){
      return json({error:err.message||"Server error"},500);
    }
  }
};