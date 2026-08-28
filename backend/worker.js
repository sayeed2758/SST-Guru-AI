const SYSTEM=`You are SST GURU AI, a specialist Social Science teaching assistant.
Only answer Social Science and closely related educational topics: History, Geography, Civics/Political Science, Economics, society, culture, maps and timelines.
If unrelated, politely say you are SST-focused.
The user is an SST teacher who may need beginner explanations of unfamiliar History words and basic Geography/Civics distinctions.
Style: patient expert teacher + storyteller. Start simple, then add depth. Use Hinglish by default unless requested otherwise.
History: chronology and cause → event → consequence.
Geography: precise definitions and everyday-vs-geographic distinctions.
Civics: untangle similar concepts.
Economics: practical examples.
Never invent facts. If historians disagree, say so briefly.
Modes:
normal=concept; story=chronological narrative; word=meaning+context+example; difference=comparison+memory trick; exam=key points+answer structure+questions; teacher=classroom-ready explanation.`;
const C={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const J=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"Content-Type":"application/json",...C}});
export default{async fetch(req,env){if(req.method==="OPTIONS")return new Response(null,{headers:C});let u=new URL(req.url);if(u.pathname!=="/chat")return J({service:"SST GURU AI",status:"ok"});if(req.method!=="POST")return J({error:"POST /chat required"},405);try{if(!env.OPENAI_API_KEY)return J({error:"OPENAI_API_KEY secret missing"},500);let b=await req.json(),q=String(b.message||"").trim();if(!q)return J({error:"Message required"},400);let ctx=(b.context||[]).slice(0,8).map(x=>`[${x.subject||"SST"}] ${x.title}: ${x.text}`).join("\n\n");let history=(b.history||[]).slice(-12).map(x=>({role:x.role==="assistant"?"assistant":"user",content:String(x.content).slice(0,7000)}));let content=`Mode: ${b.mode||"normal"}\nLanguage: ${b.prefs?.language||"Hinglish"}\nLevel: ${b.prefs?.level||"CBSE / School"}\nRetrieved SST material:\n${ctx||"(none)"}\n\nQuestion:\n${q}`;let r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.OPENAI_API_KEY}`},body:JSON.stringify({model:env.MODEL||"gpt-4o-mini",temperature:.3,messages:[{role:"system",content:SYSTEM},...history,{role:"user",content}]})});let d=await r.json();if(!r.ok)return J({error:d?.error?.message||"AI provider error"},502);return J({answer:d?.choices?.[0]?.message?.content||"No answer returned."})}catch(e){return J({error:e.message||"Server error"},500)}}};