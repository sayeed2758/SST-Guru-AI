/* Layer 8: starter SST knowledge + Layer 9 retrieval foundation */
window.SST_KNOWLEDGE = [
 {id:"river",subject:"Geography",tags:["river","drainage","tributary","source","channel"],title:"River",text:"A river is a natural flowing watercourse. It usually has a source, a channel and a course toward a lower area, lake, sea, ocean or another river. Tributaries are smaller streams or rivers that join a larger river."},
 {id:"sea",subject:"Geography",tags:["sea","ocean","water"],title:"Sea",text:"A sea is generally a smaller part of the ocean and is often partly enclosed by land. Seas are salt-water bodies. Names and boundaries are historical and geographical, so size alone is not a perfect rule."},
 {id:"ocean",subject:"Geography",tags:["ocean","sea","water"],title:"Ocean",text:"An ocean is a vast interconnected body of salt water. The five commonly named oceans are Pacific, Atlantic, Indian, Southern and Arctic."},
 {id:"lake",subject:"Geography",tags:["lake","water","inland"],title:"Lake",text:"A lake is a body of standing or relatively still water surrounded by land. It may be natural or artificial and can contain fresh or saline water."},
 {id:"french",subject:"History",tags:["french revolution","france","1789","bastille","monarchy","republic"],title:"French Revolution",text:"The French Revolution began in 1789 amid social inequality, privileged estates, financial crisis, food hardship and political conflict. It challenged the old order, contributed to the end of the monarchy and led to the French Republic."},
 {id:"hyksos",subject:"History",tags:["hyksos","egypt","second intermediate period"],title:"Hyksos",text:"The Hyksos were rulers who controlled parts of ancient Egypt during the Second Intermediate Period, especially northern Egypt. Their origins and identity are complex and should not be reduced to a single modern ethnic label."},
 {id:"mercantilism",subject:"History/Economics",tags:["mercantilism","trade","colonialism","economic"],title:"Mercantilism",text:"Mercantilism describes a family of early modern economic ideas and state policies emphasizing regulated trade, state power and wealth accumulation. Colonial trade was significant in several European systems."},
 {id:"democracy",subject:"Civics",tags:["democracy","people","elections","government"],title:"Democracy",text:"Democracy is a system in which political authority is based on the people, commonly exercised directly or through elected representatives. Participation, accountability and political rights are central ideas."},
 {id:"republic",subject:"Civics",tags:["republic","monarchy","state","representative"],title:"Republic",text:"A republic is a form of state in which public authority is exercised through public institutions and representatives rather than hereditary monarchy. A republic can also be democratic."},
 {id:"constitution",subject:"Civics",tags:["constitution","rights","government"],title:"Constitution",text:"A constitution is the fundamental framework of rules and principles by which a state is governed. It defines institutions, powers, procedures and often rights and limits on government."},
 {id:"inflation",subject:"Economics",tags:["inflation","prices","money"],title:"Inflation",text:"Inflation is a sustained rise in the general level of prices over time, reducing the purchasing power of money when incomes do not rise proportionately."},
 {id:"gdp",subject:"Economics",tags:["gdp","production","income"],title:"GDP",text:"Gross Domestic Product (GDP) measures the monetary value of final goods and services produced within an economy during a specified period."}
];

window.searchSSTKnowledge = function(query, extraDocs=[], limit=8){
 const q=String(query||"").toLowerCase();
 const docs=[...window.SST_KNOWLEDGE,...extraDocs];
 const terms=q.split(/[^a-z0-9\u0900-\u097f]+/).filter(t=>t.length>2);
 return docs.map(d=>{
   const hay=(d.title+" "+(d.subject||"")+" "+(d.tags||[]).join(" ")+" "+d.text).toLowerCase();
   let score=0;
   (d.tags||[]).forEach(t=>{if(q.includes(String(t).toLowerCase()))score+=8});
   terms.forEach(t=>{if(hay.includes(t))score+=1});
   if(d.userDoc) score+=.5;
   return {...d,score};
 }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
};