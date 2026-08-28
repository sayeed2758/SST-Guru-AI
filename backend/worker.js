/*
SST GURU AI — secure live backend
Deploy as a Cloudflare Worker.
Add secret: OPENAI_API_KEY
Optional variable: MODEL
*/
const SYSTEM = `
You are SST GURU AI — a specialist Social Science teaching assistant.

DOMAIN:
Only Social Science and closely related educational concepts: History, Geography, Civics/Political Science, Economics, society, culture, maps and timelines.
For unrelated questions, politely state that you are SST-focused and do not behave as a general-purpose assistant.

USER:
The user is an SST teacher. They may encounter unfamiliar historical terms and even basic Geography/Civics distinctions. They prefer simple Hinglish unless another language is requested.

STYLE:
- Patient expert teacher + storyteller.
- Simple first, deeper next.
- Use analogies, examples and mental pictures.
- History: chronology + cause → event → consequence.
- Geography: precise definitions and everyday-vs-geographic distinctions.
- Civics: explicitly untangle similar concepts.
- Economics: practical examples.
- Never invent facts. Mark disputed/uncertain claims.
- Do not call a source official unless the supplied metadata establishes that.

MODES:
normal = concept explanation
story = chronological narrative with setting, groups, conflict, turning point, consequences, recap
word = simple English + Hinglish + SST context + example + memory trick
difference = clean comparison + examples + memory trick
exam = key concepts + answer structure + practice questions
teacher = classroom-ready explanation + analogy + common student confusion
`;

const CORS = {
 "Access-Control-Allow-Origin":"*",
 "Access-Control-Allow-Headers":"Content-Type",
 "Access-Control-Allow-Methods":"POST, OPTIONS"
};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json",...CORS}});

export default {
 async fetch(req,env){
  if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
  const url=new URL(req.url);
  if(url.pathname!="/chat")return json({service:"SST GURU AI",status:"ok"});
  if(req.method!="POST")return json({error:"POST /chat required"},405);
  try{
   if(!env.OPENAI_API_KEY)return json({error:"OPENAI_API_KEY secret is missing."},500);
   const body=await req.json();
   const message=String(body.message||"").trim();
   const mode=String(body.mode||"normal");
   const history=Array.isArray(body.history)?body.history.slice(-14):[];
   const context=Array.isArray(body.context)?body.context.slice(0,8):[];
   const prefs=body.prefs||{};
   if(!message)return json({error:"Message is required."},400);

   const sourceText=context.map(x=>`[${x.subject||"SST"}] ${x.title}: ${x.text}`).join("\n\n");
   const userContent=`Mode: ${mode}
Language/style preference: ${prefs.language||"Hinglish"}
Detail: ${prefs.detail||"Deep but simple"}
Teaching level: ${prefs.teacherLevel||"CBSE / School"}

Retrieved SST material:
${sourceText||"(No matching local material.)"}

User question:
${message}`;

   const messages=[
    {role:"system",content:SYSTEM},
    ...history.map(m=>({role:m.role==="assistant"?"assistant":"user",content:String(m.content).slice(0,7000)})),
    {role:"user",content:userContent}
   ];
   const r=await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.OPENAI_API_KEY}`},
    body:JSON.stringify({model:env.MODEL||"gpt-4o-mini",temperature:.32,messages})
   });
   const data=await r.json();
   if(!r.ok)return json({error:data?.error?.message||"Provider error"},502);
   const answer=data?.choices?.[0]?.message?.content;
   if(!answer)return json({error:"Empty response"},502);
   return json({answer,mode});
  }catch(e){return json({error:e.message||"Server error"},500)}
 }
};