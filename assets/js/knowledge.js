/*
  Small built-in starter knowledge layer.
  Add your own NCERT-aligned entries to this array later.
  The AI receives the best matching entries as context.
*/
window.SST_KNOWLEDGE = [
 {id:"river",tags:["river","geography","water"],title:"River basics",text:"A river is a natural flowing watercourse, usually moving from higher land toward a lower area, lake, sea or another river. A river has a source and a course; tributaries may join it."},
 {id:"sea-ocean",tags:["sea","ocean","geography","water"],title:"Sea vs Ocean",text:"An ocean is a very large continuous body of salt water. A sea is generally a smaller part of an ocean, often partly enclosed by land. The terms are not simply based on size in every case, but this is a useful beginner distinction."},
 {id:"french-revolution",tags:["french revolution","history","france","1789"],title:"French Revolution overview",text:"The French Revolution began in 1789 amid social inequality, financial crisis, political tensions and resentment toward privileges. The Revolution transformed French politics and society and eventually led to the abolition of the monarchy and establishment of a republic."},
 {id:"mercantilism",tags:["mercantilism","history","economics"],title:"Mercantilism",text:"Mercantilism refers to an early modern economic system and set of policies associated with European states, emphasizing state power, trade regulation, accumulation of wealth and favorable trade balances. Colonial trade was an important part of many mercantilist systems."},
 {id:"democracy-republic",tags:["democracy","republic","civics","difference"],title:"Democracy vs Republic",text:"Democracy broadly concerns rule by the people, directly or through representatives. A republic is a state in which political authority is exercised through public institutions and representatives rather than hereditary monarchy. A country can be both democratic and republican."},
 {id:"hyksos",tags:["hyksos","egypt","history"],title:"Hyksos",text:"The Hyksos were a group of rulers who controlled parts of ancient Egypt during the Second Intermediate Period, especially in the north. The term is connected with foreign rulers in Egyptian historical tradition; modern scholarship treats their origins and identity as complex rather than as a single simple ethnic group."}
];

window.findKnowledge = function(query, limit=6){
  const q = query.toLowerCase();
  const terms = q.split(/[^a-z0-9\u0900-\u097f]+/).filter(x=>x.length>2);
  return SST_KNOWLEDGE.map(item=>{
    let score = 0;
    item.tags.forEach(t=>{ if(q.includes(t)) score += 5; });
    item.title.toLowerCase().split(/\s+/).forEach(t=>{ if(terms.includes(t)) score += 2; });
    item.text.toLowerCase().split(/\s+/).forEach(t=>{ if(terms.includes(t)) score += .15; });
    return {...item,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
};