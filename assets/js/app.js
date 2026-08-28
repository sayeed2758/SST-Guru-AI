(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const STORE = "sst_guru_v3";

  const state = JSON.parse(localStorage.getItem(STORE) || "null") || {
    theme:"light", screen:"ask", mode:"normal", messages:[], docs:[], prefs:{
      language:"Hinglish", detail:"Deep but simple", teacherLevel:"CBSE / School"
    }
  };
  const modeLabel = {normal:"Ask SST",story:"Story Mode",word:"Word Explainer",difference:"Difference Maker",exam:"Exam Mode",teacher:"Teacher Studio"};

  const demoAnswers = [
    {match:["river","sea","ocean"], answer:`### 🌊 River vs Sea vs Ocean

**River:** natural **flowing** watercourse. It usually has a source and flows toward a lower area.

**Sea:** a generally smaller part of an ocean, often partly enclosed by land.

**Ocean:** a **vast interconnected** body of salt water.

### 🧠 Memory trick
**River = flows**  
**Sea = partly enclosed**  
**Ocean = enormous salt-water body**

**Bonus:** A **lake** is mainly a body of water surrounded by land.`},
    {match:["french revolution"], answer:`### 📖 French Revolution — story mode

Imagine **France in 1789**.

The old political and social order had deep inequalities. Privileged groups had special advantages, while ordinary people faced economic pressure and food hardship. The government also faced a serious financial crisis.

Then the pressure became political action.

**1789 → Revolution begins**

The **Storming of the Bastille** became a famous symbol of the Revolution. The old order was challenged and events moved toward the abolition of the monarchy and the establishment of a republic.

### 🔗 Cause → Event → Consequence
**Social inequality + financial crisis + political conflict**
→ **Revolution**
→ **Old order challenged**
→ **Republican politics**

### 🎯 Remember
Bastille was an important event, **not the only cause** of the Revolution.`},
    {match:["mercantilism"], answer:`### 🔎 Mercantilism

**Simple English:** a family of early-modern economic ideas and state policies that linked trade and economic regulation with state power and wealth.

**Hinglish:** State trade ko strongly regulate karke apni economic aur political power badhana chahti thi.

### 🧠 Example
Socho ek country keh rahi hai: “Important trade hamare control mein rahe, useful resources aur markets se state ki strength badhe.”

Colonial trade was important in several European mercantilist systems.

**Memory:** **State + regulated trade + wealth/power**.`},
    {match:["democracy","republic"], answer:`### ⚖️ Democracy vs Republic

| Point | Democracy | Republic |
|---|---|---|
| Core idea | Political authority is based on the people | State is governed through public institutions/representatives, not hereditary monarchy |
| Focus | Popular participation and accountability | Form/structure of the state |
| Can they coexist? | Yes | Yes |

### 🧠 Easy trick
**Democracy → people’s political authority**

**Republic → non-hereditary public state structure**

So a country can be **both democratic and republican**.`},
    {match:["hyksos"], answer:`### 🏺 Hyksos

The **Hyksos** were rulers who controlled parts of ancient Egypt during the **Second Intermediate Period**, especially in northern Egypt.

### Story
Egypt was politically divided. During this period, Hyksos rulers established control in an important northern region.

Their origins and identity are more complex than saying they were simply one modern ethnic group.

### 🎯 Remember
**Hyksos = rulers connected with northern Egypt during the Second Intermediate Period.**`},
    {match:["inflation"], answer:`### 💰 Inflation

**Simple meaning:** general prices rise over time.

**Hinglish:** Jab economy mein overall cheezon aur services ki average prices badhti rehti hain, money ki purchasing power kam ho sakti hai.

**Example:** Agar same ₹100 mein pehle 5 items aate the aur kuch time baad sirf 4, purchasing power has fallen.

**Important:** One item becoming expensive by itself is not necessarily inflation; inflation refers to a broader and sustained rise in the general price level.`}
  ];

  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  function md(s){
    let x=esc(s);
    x=x.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>");
    x=x.replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h3>$1</h3>");
    x=x.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
    x=x.replace(/^\s*[-•] (.*)$/gm,"<li>$1</li>");
    x=x.replace(/(?:<li>.*?<\/li>\s*)+/gs,m=>`<ul>${m}</ul>`);
    x=x.replace(/\|(.+)\|/g,(m,row)=>{
      const cells=row.split("|").map(v=>v.trim()).filter(Boolean);
      return `<div class="table-line">${cells.map(c=>`<span>${c}</span>`).join("")}</div>`;
    });
    x=x.replace(/\n{2,}/g,"</p><p>").replace(/\n/g,"<br>");
    return `<div class="ai-answer"><p>${x}</p></div>`;
  }

  function save(){localStorage.setItem(STORE,JSON.stringify(state));}
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),1800)}
  function setTheme(){document.documentElement.dataset.theme=state.theme}
  function title(){ $("#screenTitle").textContent = modeLabel[state.screen] || {
      timeline:"Timeline",quiz:"Quiz Lab",library:"My SST Library"
    }[state.screen] || "SST GURU AI"; }

  function setScreen(screen){
    state.screen=screen;
    $("#sidebar").classList.remove("open");
    $$(".nav-item[data-screen]").forEach(b=>b.classList.toggle("active",b.dataset.screen===screen));
    title(); renderScreen();
    save();
  }

  function renderScreen(){
    const r={
      ask:renderAsk, story:()=>renderMode("story"), word:()=>renderMode("word"),
      difference:()=>renderMode("difference"), exam:()=>renderMode("exam"),
      teacher:()=>renderMode("teacher"), timeline:renderTimeline,
      quiz:renderQuiz, library:renderLibrary
    };
    (r[state.screen]||renderAsk)();
  }

  function renderHomeHero(){
    return `<div class="hero">
      <div class="kicker">YOUR PERSONAL SOCIAL SCIENCE AI</div>
      <h1>Samajhna hai?<br><span>Story ki tarah samjho.</span></h1>
      <p>History, Geography, Civics & Economics — simple Hinglish, deep concepts, clear examples, comparisons, timelines, quizzes and classroom tools.</p>
      <div class="card-grid">
        ${[
          ["📖","History Story","French Revolution / any historical event","story"],
          ["🌊","Geography Basics","River vs Sea vs Ocean","difference"],
          ["🔎","Hard Word","Mercantilism / difficult terms","word"],
          ["⚖️","Compare","Democracy vs Republic","difference"],
          ["⏳","Timeline","Build an event sequence","timeline"],
          ["🧠","Quiz Lab","Practice & remember concepts","quiz"],
          ["🎯","Exam Mode","Key points + practice questions","exam"],
          ["👨‍🏫","Teacher Studio","Classroom-ready explanation","teacher"]
        ].map(([e,b,s,k])=>`<button class="mode-card" data-goto="${k}"><span class="emoji">${e}</span><b>${b}</b><small>${s}</small></button>`).join("")}
      </div>
    </div>`;
  }

  function composer(){
    const chips=[
      ["normal","🧠 Explain"],["story","📖 Story"],["word","🔎 Word"],
      ["difference","⚖️ Difference"],["exam","🎯 Exam"],["teacher","👨‍🏫 Teacher"]
    ];
    return `<div class="composer-area">
      <div class="chips">${chips.map(([m,label])=>`<button class="chip ${state.mode===m?"active":""}" data-mode="${m}">${label}</button>`).join("")}</div>
      <div class="composer">
        <button class="round-btn" id="micBtn" title="Voice input">🎙️</button>
        <textarea id="promptInput" rows="1" placeholder="${placeholder()}"></textarea>
        <button class="round-btn" id="speakBtn" title="Read last AI answer">🔊</button>
        <button class="send" id="sendBtn">➤</button>
      </div>
      <div class="note">SST-only • Local demo brain works now • Live deep AI works after backend URL is configured</div>
    </div>`;
  }

  function placeholder(){
    return {
      normal:"Ask anything about SST…",
      story:"Example: French Revolution ko story ki tarah samjhao…",
      word:"Example: Mercantilism ka meaning…",
      difference:"Example: River vs Sea vs Ocean…",
      exam:"Example: Industrial Revolution ke important exam points…",
      teacher:"Example: Democracy ko class 8 ke students ko kaise samjhau?"
    }[state.mode]||"Ask anything about SST…";
  }

  function renderAsk(){
    $("#screen").innerHTML = renderHomeHero()+`
      <div class="chat-shell">
        <div class="chat-log" id="chatLog">${renderMessages()}</div>
        ${composer()}
      </div>`;
    bindCommon();
    bindChat();
  }

  function renderMessages(){
    if(!state.messages.length)return "";
    return state.messages.map((m,i)=>`<div class="message ${m.role}">
      <div class="avatar">${m.role==="user"?"👨‍🏫":"📚"}</div>
      <div class="bubble">${m.role==="user"?esc(m.content):md(m.content)}
      ${m.role==="assistant"?`<div class="tools">
        <button class="mini-btn" data-copy="${i}">Copy</button>
        <button class="mini-btn" data-simplify="${i}">Make Simpler</button>
        <button class="mini-btn" data-speak="${i}">Read Aloud</button>
      </div>`:""}</div>
    </div>`).join("");
  }

  function renderMode(mode){
    state.mode=mode;
    const info={
      story:["📖 Story Mode","History ko chronological story, characters, conflict, turning point aur consequence ke through samjho."],
      word:["🔎 Word Explainer","Difficult SST words ko simple English + Hinglish + context + example mein break karo."],
      difference:["⚖️ Difference Maker","Do ya zyada confusing concepts ko side-by-side compare karo."],
      exam:["🎯 Exam Mode","Concept + key points + practice questions + answer structure."],
      teacher:["👨‍🏫 Teacher Studio","Classroom-ready explanation, analogy, common confusion and quick recap."]
    }[mode];
    $("#screen").innerHTML=`<div class="two-col">
      <div class="panel panel-pad">
        <div class="heading-row"><div><span class="badge">${info[0]}</span><h2 class="mode-title">${info[0]}</h2></div></div>
        <p class="section-copy">${info[1]}</p>
        <div class="field"><label>TOPIC</label><textarea class="textarea" id="modeTopic" rows="4" placeholder="${placeholder()}"></textarea></div>
        <button class="btn primary" id="modeRun">Generate Explanation</button>
        <button class="btn" id="modeAsk">Open in Ask SST</button>
      </div>
      <div class="panel panel-pad">
        <div class="heading-row"><h3>What this mode does</h3></div>
        <div class="three-col">
          <div class="feature-tile"><b>🧠 Understand</b><span>Core concept first, then depth.</span></div>
          <div class="feature-tile"><b>🗣️ Explain</b><span>Beginner-friendly Hinglish where useful.</span></div>
          <div class="feature-tile"><b>🎯 Remember</b><span>Memory trick + recap.</span></div>
        </div>
      </div>
    </div>`;
    $("#modeRun").onclick=()=>ask($("#modeTopic").value);
    $("#modeAsk").onclick=()=>{const q=$("#modeTopic").value;state.mode=mode;setScreen("ask");setTimeout(()=>{$("#promptInput").value=q;$("#sendBtn").click()},80)};
  }

  function renderTimeline(){
    $("#screen").innerHTML=`<div class="panel panel-pad">
      <div class="heading-row"><div><span class="badge">LAYER 12</span><h2 class="mode-title">Timeline Builder</h2><p class="section-copy">Events ko chronological sequence mein arrange karo.</p></div></div>
      <div class="field"><label>TOPIC / EVENTS</label><input class="input" id="timelineInput" placeholder="French Revolution / Indian National Movement / World War I"></div>
      <button class="btn primary" id="timelineBtn">Build Timeline</button>
      <div id="timelineOut" style="margin-top:18px"></div>
    </div>`;
    $("#timelineBtn").onclick=()=>{
      const q=$("#timelineInput").value.trim();
      if(!q)return toast("Topic likho");
      const events=timelineFor(q);
      $("#timelineOut").innerHTML=`<div class="timeline">${events.map(e=>`<div class="timeline-item"><div class="timeline-year">${e[0]}</div><div class="timeline-box"><b>${e[1]}</b><span>${e[2]}</span></div></div>`).join("")}</div>`;
    };
  }

  function timelineFor(q){
    const s=q.toLowerCase();
    if(s.includes("french"))return[
      ["1789","Revolution begins","Social inequality, financial crisis and political conflict intensify."],
      ["1789","Bastille","The fall of the Bastille becomes a major symbol of the Revolution."],
      ["1791","Constitutional phase","France moves toward a constitutional framework."],
      ["1792","Republic","Monarchy is overthrown and France becomes a republic."],
      ["1793–94","Reign of Terror","Radical phase with executions and political repression."],
      ["1799","Napoleon rises","Napoleon's coup ends the Directory."]
    ];
    if(s.includes("industrial"))return[
      ["18th c.","Early change","Mechanisation develops in Britain."],
      ["1760s–70s","Textile innovation","Machines transform spinning and weaving."],
      ["Steam power","Factories expand","Steam power enables new industrial uses."],
      ["19th c.","Urbanisation","Factory growth accelerates urban and social change."]
    ];
    return[
      ["Start","Background","Identify the conditions before the main event."],
      ["Turning point","Main event","Place the major development here."],
      ["Aftermath","Consequences","Record the immediate and long-term results."],
      ["Legacy","Why it matters","Connect the event to later history or society."]
    ];
  }

  function renderQuiz(){
    $("#screen").innerHTML=`<div class="panel panel-pad">
      <div class="heading-row"><div><span class="badge">LAYER 13</span><h2 class="mode-title">Quiz Lab</h2><p class="section-copy">Topic do aur quick MCQ practice karo.</p></div><div id="quizScore" class="badge">Score: 0</div></div>
      <div class="field"><label>TOPIC</label><input class="input" id="quizTopic" placeholder="Democracy / French Revolution / Drainage"></div>
      <button class="btn primary" id="startQuiz">Start Quiz</button>
      <div id="quizArea" style="margin-top:18px"></div>
    </div>`;
    let quiz=[],idx=0,score=0;
    $("#startQuiz").onclick=()=>{
      const topic=$("#quizTopic").value.trim()||"SST";
      quiz=makeQuiz(topic);idx=0;score=0;draw();
    };
    function draw(){
      if(idx>=quiz.length){$("#quizArea").innerHTML=`<div class="answer-card"><h3>🎉 Quiz Complete</h3><p>Your score: <strong>${score}/${quiz.length}</strong></p><button class="btn primary" id="retryQuiz">Try Again</button></div>`;$("#retryQuiz").onclick=()=>{$("#startQuiz").click()};return}
      const q=quiz[idx];
      $("#quizScore").textContent=`Score: ${score}`;
      $("#quizArea").innerHTML=`<div class="answer-card"><span class="badge">Question ${idx+1}/${quiz.length}</span><h3>${esc(q.q)}</h3>${q.options.map((o,i)=>`<button class="quiz-option" data-q="${i}">${esc(o)}</button>`).join("")}<div class="muted" id="quizFeedback"></div></div>`;
      $$(".quiz-option").forEach(b=>b.onclick=()=>{
        const picked=+b.dataset.q;
        $$(".quiz-option").forEach(x=>x.disabled=true);
        if(picked===q.a){b.classList.add("correct");score++;$("#quizFeedback").innerHTML="✅ Correct!";}else{b.classList.add("wrong");$(`.quiz-option[data-q="${q.a}"]`).classList.add("correct");$("#quizFeedback").innerHTML=`❌ Correct answer: ${esc(q.options[q.a])}`;}
        setTimeout(()=>{idx++;draw()},800);
      });
    }
  }

  function makeQuiz(topic){
    const t=topic.toLowerCase();
    if(t.includes("democracy"))return[
      {q:"In a democracy, political authority is ultimately based on whom?",options:["People","Hereditary ruler","Military only","One business group"],a:0},
      {q:"Can a republic also be democratic?",options:["No","Yes","Only in ancient times","Never"],a:1},
      {q:"Which idea is closely connected with democracy?",options:["Political participation","Hereditary privilege","No elections","Rule without accountability"],a:0},
      {q:"A republic primarily distinguishes the form of the state from what?",options:["Hereditary monarchy","Agriculture","Climate","Language"],a:0},
      {q:"What is one useful memory trick?",options:["Democracy = people; Republic = non-hereditary public state","Democracy = ocean","Republic = river","Both mean exactly the same thing"],a:0}
    ];
    if(t.includes("french")||t.includes("revolution"))return[
      {q:"The French Revolution began in which year?",options:["1776","1789","1815","1914"],a:1},
      {q:"Which was a major underlying cause?",options:["Social inequality","Internet access","Industrial robots","Space travel"],a:0},
      {q:"The Bastille became a symbol of what?",options:["Revolutionary upheaval","Ocean trade","Agricultural reform","Railway expansion"],a:0},
      {q:"The monarchy was eventually replaced by what political direction?",options:["Republic","Empire of Rome","Feudal village","Colony"],a:0},
      {q:"Which is the best explanation?",options:["Bastille was the only cause","The Revolution had multiple social, economic and political causes","It was only a food festival","It started in 1914"],a:1}
    ];
    return[
      {q:`Which type of topic is "${topic}" most likely to belong to?`,options:["Social Science","Only Chemistry","Only Physics","Only Coding"],a:0},
      {q:"What should you identify first when learning a new SST concept?",options:["Core meaning","Every date in a textbook","Random facts","Nothing"],a:0},
      {q:"For History, which order is especially useful?",options:["Cause → Event → Consequence","Effect → Cause only","Random order","Alphabetical order"],a:0},
      {q:"For Geography, what helps avoid confusion?",options:["Clear definitions and examples","Memorising unrelated words","Ignoring location","Only dates"],a:0},
      {q:"A good revision trick is:",options:["Explain the idea in your own words","Read without thinking","Skip examples","Avoid comparisons"],a:0}
    ];
  }

  function renderLibrary(){
    const docs=state.docs||[];
    $("#screen").innerHTML=`<div class="two-col">
      <div class="panel panel-pad">
        <div class="heading-row"><div><span class="badge">LAYER 14</span><h2 class="mode-title">My SST Library</h2></div></div>
        <p class="section-copy">Apne notes add karo. Browser-supported text/markdown/JSON/CSV files are indexed locally. PDF text extraction is attempted when available.</p>
        <div class="field"><label>UPLOAD SST MATERIAL</label><input class="input" id="docInput" type="file" multiple accept=".txt,.md,.json,.csv,.pdf"></div>
        <button class="btn primary" id="indexBtn">Index Selected Files</button>
        <button class="btn" id="resetLibrary">Remove My Library</button>
      </div>
      <div class="panel panel-pad">
        <div class="heading-row"><h3>Indexed materials</h3><span class="badge">${docs.length} docs</span></div>
        <div class="library-list">${docs.length?docs.map((d,i)=>`<div class="library-item"><div><strong>${esc(d.title)}</strong><small>${esc(d.subject||"SST")} • ${d.text.length} chars</small></div><button class="mini-btn" data-del-doc="${i}">Remove</button></div>`).join(""):`<div class="muted">No personal documents indexed yet.</div>`}</div>
      </div>
    </div>`;
    $("#indexBtn").onclick=()=>indexFiles();
    $("#resetLibrary").onclick=()=>{state.docs=[];save();renderLibrary();toast("Library cleared")};
    $$(".mini-btn[data-del-doc]").forEach(b=>b.onclick=()=>{state.docs.splice(+b.dataset.delDoc,1);save();renderLibrary()});
  }

  async function indexFiles(){
    const input=$("#docInput");if(!input.files.length)return toast("File select karo");
    for(const f of input.files){
      let text="";
      if(f.type==="application/pdf" || f.name.toLowerCase().endsWith(".pdf")){
        text=await extractPDF(f);
      }else{
        text=await f.text();
        if(f.name.toLowerCase().endsWith(".json")){
          try{text=JSON.stringify(JSON.parse(text),null,2)}catch{}
        }
      }
      if(text.trim()) state.docs.push({id:crypto.randomUUID?.()||String(Date.now()+Math.random()),title:f.name,subject:"My SST Library",text:text.slice(0,200000),tags:[],userDoc:true});
    }
    save();renderLibrary();toast("Library indexed");
  }

  async function extractPDF(file){
    try{
      const mod=await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs");
      mod.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs";
      const buf=await file.arrayBuffer(); const pdf=await mod.getDocument({data:buf}).promise; let out="";
      for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);const c=await page.getTextContent();out+=c.items.map(i=>i.str).join(" ")+"\\n";}
      return out;
    }catch(e){toast("PDF extraction unavailable; try TXT/MD for now");return "";}
  }

  function bindCommon(){
    $$(".mode-card[data-goto]").forEach(b=>b.onclick=()=>setScreen(b.dataset.goto));
    $$(".nav-item[data-screen]").forEach(b=>b.onclick=()=>setScreen(b.dataset.screen));
    $$(".chip").forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;renderAsk();save()});
  }

  function bindChat(){
    const send=()=>{const t=$("#promptInput");const v=t.value;t.value="";t.style.height="auto";ask(v)};
    $("#sendBtn").onclick=send;
    $("#promptInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
    $("#promptInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(170,e.target.scrollHeight)+"px"});
    $("#speakBtn").onclick=()=>speakLast();
    $("#micBtn").onclick=()=>voiceInput();
    $$("#chatLog [data-copy]").forEach(b=>b.onclick=()=>{navigator.clipboard?.writeText(state.messages[+b.dataset.copy].content);toast("Copied")});
    $$("#chatLog [data-simplify]").forEach(b=>b.onclick=()=>ask("Is explanation ko aur simple Hinglish mein, beginner teacher level par samjhao."));
    $$("#chatLog [data-speak]").forEach(b=>b.onclick=()=>speak(state.messages[+b.dataset.speak].content));
  }

  function findDemo(q){
    const s=q.toLowerCase();
    return demoAnswers.find(d=>d.match.every(k=>s.includes(k)))?.answer ||
      demoAnswers.find(d=>d.match.some(k=>s.includes(k)))?.answer;
  }

  async function ask(prompt){
    const clean=String(prompt||"").trim(); if(!clean)return toast("Question likho");
    state.messages.push({role:"user",content:clean});save();renderAsk();

    const context=searchSSTKnowledge(clean,state.docs||[],SST_CONFIG.MAX_SOURCES);
    let answer=null;
    try{
      if(SST_CONFIG.API_URL && !SST_CONFIG.API_URL.includes("PASTE_YOUR")){
        const history=state.messages.slice(-SST_CONFIG.MAX_HISTORY).map(m=>({role:m.role,content:m.content}));
        const res=await fetch(SST_CONFIG.API_URL.replace(/\/$/,"")+"/chat",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({message:clean,mode:state.mode,history,context,prefs:state.prefs})
        });
        const data=await res.json();
        if(!res.ok)throw new Error(data.error||"Backend error");
        answer=data.answer;
      }else{
        answer=findDemo(clean) || localBrain(clean,context);
      }
    }catch(e){
      answer=`### ⚠️ Live AI connection issue\n\n${e.message}\n\nThe local SST brain is available. Check **Settings → Backend URL** when you are ready for live deep AI.`;
    }
    state.messages.push({role:"assistant",content:answer});save();renderAsk();
  }

  function localBrain(q,ctx){
    const s=q.toLowerCase();
    const source=ctx[0];
    if(state.mode==="word"){
      const term=q.replace(/^(word|meaning|define|explain)\s*[:\-]?\s*/i,"").trim();
      return `### 🔎 ${term}\n\n**Simple English:** ${source?.text?.split(". ")[0]||"This is an SST-related term. Ask with a specific term for a deeper explanation."}\n\n**Hinglish:** Isko simple language mein samjho, phir context mein dekho ki textbook mein iska role kya hai.\n\n**SST context:** ${source?.title||"No exact local entry matched."}\n\n**Memory trick:** Pehle meaning yaad karo, phir example se connect karo.`;
    }
    if(state.mode==="difference"){
      return `### ⚖️ Compare Mode\n\nMujhe do concepts clearly likho, jaise **River vs Sea**, **Democracy vs Republic**, ya **Climate vs Weather**.\n\n${ctx.length?`Mere paas related SST material mila: **${ctx[0].title}**.`:"Abhi exact local entries nahi mili."}\n\nMain next answer mein **definition → key difference → example → memory trick** format use karunga.`;
    }
    if(state.mode==="story"){
      return `### 📖 Story Mode\n\nChalo **${q}** ko ek scene ki tarah imagine karte hain.\n\n**Background:** Sabse pehle situation samjho.\n\n**Characters / Groups:** Kaun involved tha?\n\n**Conflict:** Problem kya thi?\n\n**Turning Point:** Kya event situation ko change karta hai?\n\n**Result:** Uske baad kya hua?\n\n**🎯 Memory:** ${source?.title||q} ko **background → conflict → event → consequence** chain se yaad rakho.`;
    }
    if(state.mode==="exam"){
      return `### 🎯 Exam Mode — ${q}\n\n**Core idea:** ${source?.text?.split(". ").slice(0,2).join(". ")||"Topic ka central concept identify karo."}\n\n**5 key points:**\n1. Definition / meaning\n2. Background / context\n3. Main feature or event\n4. Cause → effect\n5. Why it matters\n\n**Practice:**\n- 1 MCQ\n- 1 short answer\n- 1 long answer\n\n**Answer tip:** Headings + keywords + example use karo.`;
    }
    if(state.mode==="teacher"){
      return `### 👨‍🏫 Teacher Studio — ${q}\n\n**Classroom opening:** “Chalo isko ek simple real-life example se samjhte hain…”\n\n**Core explanation:** ${source?.text||"Topic ko pehle one-line meaning se start karo."}\n\n**Analogy:** Kisi familiar daily-life situation se connect karo.\n\n**Common confusion:** Similar-looking terms ko side-by-side compare karo.\n\n**30-second recap:** Definition → example → why it matters.`;
    }
    return `### 🧠 SST GURU — ${q}\n\n${source?.text||"Is topic ke liye local starter knowledge mein exact passage nahi mila."}\n\n**Next step:** Is topic ko Story, Difference, Exam ya Teacher Mode mein aur deeply explore kar sakte ho.`;
  }

  function speak(text){
    if(!("speechSynthesis" in window))return toast("Text-to-speech supported nahi hai");
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text.replace(/[#*`|]/g," "));
    u.rate=.96;u.pitch=1; speechSynthesis.speak(u);
  }
  function speakLast(){const last=[...state.messages].reverse().find(m=>m.role==="assistant");if(last)speak(last.content);else toast("No AI answer yet")}
  function voiceInput(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return toast("Voice input browser mein supported nahi hai");
    const r=new SR();r.lang="en-IN";r.interimResults=false;r.maxAlternatives=1;
    r.onresult=e=>{$("#promptInput").value=e.results[0][0].transcript;toast("Voice captured")};
    r.onerror=()=>toast("Voice input failed");r.start();
  }

  $("#newChatBtn").onclick=()=>{state.messages=[];state.mode="normal";save();setScreen("ask");toast("New conversation")};
  $("#clearBtn").onclick=()=>{if(confirm("Clear local chats, preferences and your library?")){localStorage.removeItem(STORE);location.reload()}};
  $("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";setTheme();save();toast(state.theme==="dark"?"Dark mode":"Light mode")};
  $("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
  $("#exportAllBtn").onclick=()=>{
    const text=state.messages.map(m=>`${m.role.toUpperCase()}\n${m.content}`).join("\n\n---\n\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download="sst-guru-chat.txt";a.click();URL.revokeObjectURL(a.href);toast("Chat exported");
  };
  $("#settingsBtn").onclick=()=>showSettings();

  function showSettings(){
    const o=document.createElement("div");o.className="overlay";o.id="settingsOverlay";
    o.innerHTML=`<div class="modal"><div class="heading-row"><h2 class="mode-title">⚙️ Settings</h2><button class="icon-btn" id="closeSettings">✕</button></div>
      <div class="field"><label>BACKEND URL (optional for live AI)</label><input class="input" id="apiUrl" value="${esc(SST_CONFIG.API_URL)}" placeholder="https://your-worker.workers.dev"></div>
      <div class="two-col">
        <div class="field"><label>LANGUAGE STYLE</label><select class="select" id="lang"><option>Hinglish</option><option>English</option><option>Hindi</option></select></div>
        <div class="field"><label>DETAIL LEVEL</label><select class="select" id="detail"><option>Deep but simple</option><option>Balanced</option><option>Very detailed</option></select></div>
      </div>
      <div class="field"><label>TEACHING LEVEL</label><input class="input" id="teacherLevel" value="${esc(state.prefs.teacherLevel)}"></div>
      <div class="stat-row"><span class="badge">Layer 1 UI</span><span class="badge">Layer 2 Modes</span><span class="badge">Layer 8 KB</span><span class="badge">Layer 14 Library</span></div>
      <p class="section-copy">API key should never be stored here. Only put your deployed backend URL. The key stays server-side.</p>
      <button class="btn primary" id="saveSettings">Save Settings</button>
    </div>`;
    document.body.appendChild(o);
    $("#lang").value=state.prefs.language;$("#detail").value=state.prefs.detail;
    $("#closeSettings").onclick=()=>o.remove();
    $("#saveSettings").onclick=()=>{
      SST_CONFIG.API_URL=$("#apiUrl").value.trim();state.prefs.language=$("#lang").value;state.prefs.detail=$("#detail").value;state.prefs.teacherLevel=$("#teacherLevel").value.trim()||"CBSE / School";
      localStorage.setItem("sst_guru_runtime_config",JSON.stringify({API_URL:SST_CONFIG.API_URL}));
      save();o.remove();toast("Settings saved");
    };
  }

  const runtime=JSON.parse(localStorage.getItem("sst_guru_runtime_config")||"null");
  if(runtime?.API_URL)SST_CONFIG.API_URL=runtime.API_URL;
  setTheme();setScreen("ask");
})();