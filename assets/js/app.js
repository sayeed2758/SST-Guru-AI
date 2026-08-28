(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const state = {
    mode: localStorage.getItem("sst_mode") || "normal",
    messages: JSON.parse(localStorage.getItem("sst_history") || "[]")
  };

  const modeLabels = {
    normal:"Ask SST", story:"Story Mode", word:"Word Explainer",
    difference:"Difference Maker", exam:"Exam Mode", teacher:"Teacher Mode"
  };

  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}
  function md(s){
    let x=escapeHTML(s);
    x=x.replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>");
    x=x.replace(/^### (.*)$/gm,"<h3>$1</h3>");
    x=x.replace(/^## (.*)$/gm,"<h3>$1</h3>");
    x=x.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
    x=x.replace(/`([^`]+)`/g,"<code>$1</code>");
    x=x.replace(/^\s*[-•] (.*)$/gm,"<li>$1</li>");
    x=x.replace(/(<li>.*<\/li>)/gs,"<ul>$1</ul>");
    x=x.replace(/\|(.+)\|/g,(m,row)=>{
      const cells=row.split("|").map(c=>c.trim()).filter(Boolean);
      return "<div>"+cells.map(c=>"<span>"+c+"</span>").join(" &nbsp;|&nbsp; ")+"</div>";
    });
    x=x.replace(/\n{2,}/g,"</p><p>").replace(/\n/g,"<br>");
    return `<div class="ai-answer"><p>${x}</p></div>`;
  }

  function save(){localStorage.setItem("sst_history",JSON.stringify(state.messages.slice(-50)));localStorage.setItem("sst_mode",state.mode);}
  function render(){
    $("#chatList").innerHTML = "";
    state.messages.forEach((m,i)=>{
      const row=document.createElement("div"); row.className=`message ${m.role}`;
      row.innerHTML=`<div class="avatar">${m.role==="user"?"👨‍🏫":"📚"}</div><div class="bubble">${m.role==="user"?escapeHTML(m.content):md(m.content)}
      ${m.role==="assistant"?`<div class="answer-tools"><button class="mini-btn" data-copy="${i}">Copy</button><button class="mini-btn" data-explain="${i}">Simplify</button></div>`:""}</div>`;
      $("#chatList").appendChild(row);
    });
    $("#hero").style.display = state.messages.length ? "none":"block";
    $("#modeTitle").textContent=modeLabels[state.mode]||"Ask SST";
    $$(".chip").forEach(b=>b.classList.toggle("active",b.dataset.mode===(state.mode==="normal"?"normal":state.mode)));
    $("#chatList").scrollIntoView({block:"end"});
  }

  function setMode(mode){
    state.mode=mode; save(); $("#modeTitle").textContent=modeLabels[mode]||"Ask SST";
    $$(".nav-item[data-view]").forEach(b=>b.classList.toggle("active", (b.dataset.view==="chat"&&mode==="normal")||b.dataset.view===mode));
    render();
  }

  async function ask(prompt){
    const clean=prompt.trim(); if(!clean)return;
    state.messages.push({role:"user",content:clean}); save(); render();
    $("#typing").classList.add("show"); $("#sendBtn").disabled=true;
    const context=findKnowledge(clean, SST_CONFIG.MAX_CONTEXT_ITEMS||6);
    const payload={message:clean,mode:state.mode,context};
    try{
      if(!SST_CONFIG.API_URL || SST_CONFIG.API_URL.includes("PASTE_YOUR")){
        throw new Error("Backend URL not configured");
      }
      const res=await fetch(SST_CONFIG.API_URL.replace(/\/$/,"")+"/chat",{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Request failed");
      state.messages.push({role:"assistant",content:data.answer});
    }catch(e){
      const fallback = `⚠️ **AI backend is not connected yet.**\n\nYour frontend is ready, but \`assets/js/config.js\` still needs your deployed backend URL.\n\n**What is already working:**\n- SST-only interface\n- Story / Word / Difference / Exam / Teacher modes\n- Local chat history\n- Built-in starter knowledge retrieval\n- Responsive mobile UI\n\n**Next:** deploy the Worker in \`backend/worker.js\`, add your AI API key as a Worker secret, then paste the Worker URL into \`config.js\`.\n\nError: ${e.message}`;
      state.messages.push({role:"assistant",content:fallback});
    }finally{
      $("#typing").classList.remove("show"); $("#sendBtn").disabled=false; save(); render();
    }
  }

  $("#sendBtn").addEventListener("click",()=>ask($("#promptInput").value).then(()=>$("#promptInput").value=""));
  $("#promptInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("#sendBtn").click();}});
  $("#promptInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,150)+"px";});

  $$(".quick-card").forEach(b=>b.addEventListener("click",()=>{ $("#promptInput").value=b.dataset.prompt; $("#sendBtn").click(); }));
  $$(".chip").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));

  $$(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>{
    const v=b.dataset.view; setMode(v==="chat"?"normal":v); $("#sidebar").classList.remove("open");
  }));

  $("#newChatBtn").addEventListener("click",()=>{state.messages=[];save();render();});
  $("#clearBtn").addEventListener("click",()=>{if(confirm("Clear saved conversation history?")){state.messages=[];save();render();}});
  $("#themeBtn").addEventListener("click",()=>{const d=document.documentElement;d.dataset.theme=d.dataset.theme==="dark"?"light":"dark";localStorage.setItem("sst_theme",d.dataset.theme);});
  $("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));

  $("#chatList").addEventListener("click",e=>{
    const copy=e.target.closest("[data-copy]"); const simp=e.target.closest("[data-explain]");
    if(copy){navigator.clipboard?.writeText(state.messages[+copy.dataset.copy].content);copy.textContent="Copied";}
    if(simp){ask("Is explanation ko aur simple Hinglish mein, beginner teacher ke level par samjhao.");}
  });

  document.documentElement.dataset.theme=localStorage.getItem("sst_theme")||"light";
  render();
})();