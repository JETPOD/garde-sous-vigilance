const main=document.querySelector("#main");
const state={view:"home",caseIndex:0,step:0,answers:{},runs:{},drafts:{},selected:[],revealed:false,clues:new Set()};
const dims=["Repérage","Protection","Gestes sûrs","Coordination"];
const analyticsSeen=new Set();
function trackEvent(name){try{if(typeof window.plausible==="function")window.plausible(name)}catch{/* La mesure ne doit jamais interrompre les soins simulés. */}}
function trackOnce(key,name){if(analyticsSeen.has(key))return;analyticsSeen.add(key);trackEvent(name)}
function trackCase(action,i){trackEvent(`Dossier ${CASES[i].code} ${action}`)}
function trackTeaching(outcome){window.gsvAnalytics?.trackTeaching(CASES[state.caseIndex].code,outcome)}
let theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
function setTheme(){document.documentElement.dataset.theme=theme;document.querySelector("#theme").textContent=theme==="dark"?"Mode clair":"Mode sombre";}
setTheme();
document.querySelector("#theme").onclick=()=>{theme=theme==="dark"?"light":"dark";setTheme()};
function sourceLinks(keys){return `<div class="source-links">${keys.map(k=>`<a href="${SOURCES[k].url}" target="_blank" rel="noopener noreferrer">${SOURCES[k].name} ↗</a>`).join("")}</div>`}
function setView(v){
 if(state.view==="case"&&v!=="case-result"&&v!=="case")state.drafts[state.caseIndex]={step:state.step,selected:[...state.selected],revealed:state.revealed,clues:[...state.clues]};
 state.view=v;render();main.focus();window.scrollTo(0,0);
}
function activeNav(){document.querySelectorAll(".nav").forEach(el=>el.classList.remove("active"));document.querySelector(state.view==="sources"?"#nav-sources":state.view==="results"?"#nav-results":"#nav-home").classList.add("active");document.querySelector("#done-count").textContent=`${Object.keys(state.runs).length}/${CASES.length}`;}
document.querySelector("#brand").onclick=e=>{e.preventDefault();setView("home")};
document.querySelector("#nav-home").onclick=()=>setView("home");
document.querySelector("#nav-results").onclick=()=>setView("results");
document.querySelector("#nav-sources").onclick=()=>setView("sources");
document.querySelector("#close-dialog").onclick=()=>document.querySelector("#dialog").close();
function startCase(i){
 delete state.drafts[i];
 trackOnce("game-started","Jeu démarré");
 trackCase("démarré",i);
 state.caseIndex=i;state.step=0;state.answers[i]=[];state.selected=[];state.revealed=false;state.clues=new Set();setView("case");
}
function resumeCase(i){
 const d=state.drafts[i];if(!d)return;
 state.caseIndex=i;state.step=d.step;state.selected=[...d.selected];state.revealed=d.revealed;state.clues=new Set(d.clues);setView("case");
}
function requestStart(i){
 if(state.answers[i]?.length||state.runs[i]){
  document.querySelector("#dialog-content").innerHTML=`<h2>Recommencer cette situation ?</h2><p>Les réponses de la nouvelle tentative repartiront de zéro. Votre dernier bilan terminé sera remplacé lorsque vous finirez cette tentative.</p><button class="primary" id="confirm-restart">Recommencer</button>`;
  document.querySelector("#confirm-restart").onclick=()=>{document.querySelector("#dialog").close();startCase(i)};
  document.querySelector("#dialog").showModal();
 }else startCase(i);
}
function renderHome(){
 const next=CASES.findIndex((_,i)=>!state.runs[i]);
 const ongoing=Object.keys(state.drafts).length>0;
 return `<div class="notice"><strong>Version de travail pédagogique</strong><span>À valider avec votre EOH avant utilisation en formation. Ne constitue pas un protocole de soins.</span></div>
 <div class="heading"><div><div class="eyebrow">PRISE DE POSTE · PARCOURS INITIATION</div><h1>Une garde. ${CASES.length} situations à risque.</h1><p>Vous êtes l’interne de garde. Les premières décisions vous appartiennent.</p></div><span class="pill">Environ ${CASES.reduce((n,c)=>n+parseInt(c.duration,10),0)} minutes</span></div>
 <section class="hero"><div class="hero-copy"><div class="eyebrow">LE RISQUE N’EST PAS TOUJOURS VISIBLE</div><h2>Repérez les indices.<br>Prenez les bonnes décisions.</h2><p>Explorez le dossier, choisissez vos actions et découvrez leurs conséquences pédagogiques. Pas de chrono : la sécurité prime.</p><button class="primary" id="start-btn" data-start="${next<0?0:next}">${next<0?"Rejouer la garde":"Prendre ma garde"} <span aria-hidden="true">→</span></button></div><img src="scene.webp" alt="Couloir illustré d’un service d’urgences, avec un box de soins ouvert" width="900" height="506"></section>
 <div class="section-line"><h2>Les dossiers de votre garde</h2><span>${Object.keys(state.runs).length} / ${CASES.length} terminés</span></div>
 <section class="case-grid" aria-label="Situations disponibles">${CASES.map((c,i)=>`<article class="case-card"><div class="card-top"><span class="case-num">${c.code}</span><span>${c.time} · ${c.duration}</span></div><h3>${c.title}</h3><p>${c.topic}</p><div class="card-footer"><span>${state.drafts[i]?"Situation en cours":state.runs[i]?`${state.runs[i].filter(a=>a.ok).length}/4 décisions justes · terminé`:c.level}</span><button ${state.drafts[i]?"data-resume":"data-start"}="${i}" aria-label="${state.drafts[i]?"Reprendre":state.runs[i]?"Rejouer":"Ouvrir"} : ${c.title}">${state.drafts[i]?"Reprendre":state.runs[i]?"Rejouer":"Ouvrir le dossier"} →</button></div></article>`).join("")}</section>
 <div class="how"><span><b>01</b> Explorer les indices</span><span><b>02</b> Décider et justifier</span><span><b>03</b> Revoir les points clés</span></div>
 <p class="score-line">Statistiques pédagogiques agrégées par dossier, sans identité ni réponses cochées. <button class="quiet" id="privacy-info">Informations et désactivation du suivi pédagogique</button></p>
 ${ongoing?`<p class="score-line">Vos situations en cours restent accessibles avec le bouton « Reprendre » de chaque dossier.</p>`:""}`;
}
function current(){return CASES[state.caseIndex].steps[state.step]}
function optionOrder(n){const shift=(state.caseIndex+state.step+1)%n;return Array.from({length:n},(_,i)=>(i+shift)%n)}
function renderCase(){
 const c=CASES[state.caseIndex],s=current(),a=state.answers[state.caseIndex]?.[state.step];
 return `<div class="breadcrumb"><button class="quiet" id="back-home">← Les situations</button><span>${c.time} · ${c.location}</span></div><div class="heading"><div><div class="eyebrow">DOSSIER ${c.code} · ${c.topic}</div><h1>${c.title}</h1></div><span class="pill">Décision ${state.step+1}/4</span></div>
 <div class="case-layout"><aside class="patient"><div class="patient-head"><div class="eyebrow">TRANSMISSION DE L’IOA</div><h2>${c.patient}</h2><p>${c.location} · Cas fictif</p></div><div class="patient-body"><p>${c.intro}</p><div class="vitals">${c.vitals.map(([k,v])=>`<div class="vital"><span>${k}</span><b>${v}</b></div>`).join("")}</div><div class="eyebrow">EXPLORER LE DOSSIER</div><div class="clues">${c.clues.map(([k,v],i)=>`<details class="clue" data-clue="${i}" ${state.clues.has(i)?"open":""}><summary>${k}</summary><p>${v}</p></details>`).join("")}</div></div></aside>
 <section><div class="stepper" aria-label="Progression">${dims.map((d,i)=>`<div class="step ${i===state.step?"active":i<state.step?"past":""}" ${i===state.step?'aria-current="step"':""}>${d}</div>`).join("")}</div><div class="question-card"><div class="eyebrow">${s.label}</div><h2 id="question">${s.q}</h2><p class="instruction">${s.multi?"Plusieurs réponses attendues. Sélectionnez toutes les actions appropriées.":"Une seule réponse attendue."} ${state.step===0?"Ouvrez les indices du dossier pour vous aider.":""}</p>
 <fieldset aria-labelledby="question" ${state.revealed?"disabled":""}>${optionOrder(s.options.length).map(i=>{
  const sel=state.selected.includes(i),right=s.correct.includes(i);
  return `<label class="option ${state.revealed?(right?"right":sel?"wrong":""):""}"><input type="${s.multi?"checkbox":"radio"}" name="answer" value="${i}" ${sel?"checked":""}><span>${s.options[i]}${state.revealed&&(right||sel)?`<span class="option-mark">${right?(sel?"Attendu · sélectionné":"Attendu · non sélectionné"):"Non retenu · sélectionné"}</span>`:""}</span></label>`;
 }).join("")}</fieldset>
 ${state.revealed?`<section class="feedback ${a.ok?"":"error"}" role="status"><h3>${a.ok?"Décision adaptée":s.critical?"Point de sécurité critique à revoir":"Décision à réévaluer"}</h3><p>${a.ok?s.good:s.bad}</p><p class="explanation">${s.explanation}</p>${sourceLinks(s.sources)}</section>`:""}
 <div class="actions"><small>${state.revealed?`${a.ok?"1":"0"} / 1 point pédagogique`:"Votre choix n’est évalué qu’à la validation."}</small><button class="primary" id="${state.revealed?"next":"validate"}" ${!state.revealed&&!state.selected.length?"disabled":""}>${state.revealed?(state.step===3?"Voir le débriefing":"Poursuivre la prise en charge"):"Valider ma décision"} →</button></div></div><div class="score-line">Aucune probabilité d’infection simulée. Les conséquences sont pédagogiques, pas prédictives.</div></section></div>`;
}
function reviewRows(c,answers){
 return c.steps.map((s,i)=>{const a=answers[i];return `<article class="review-row"><div><h3>${s.dim} · ${s.label}</h3><span class="tag ${a.ok?"":"warn"}">${a.ok?"Adapté":s.critical?"Point critique à revoir":"À revoir"}</span></div><p>${s.takeaway}</p><details><summary>Revoir ma réponse et l’explication +</summary><p><strong>Votre réponse :</strong> ${a.selected.map(j=>s.options[j]).join(" ")}</p><p><strong>Réponse attendue :</strong> ${s.correct.map(j=>s.options[j]).join(" ")}</p><p>${s.explanation}</p>${sourceLinks(s.sources)}</details></article>`}).join("");
}
function renderCaseResult(){
 const c=CASES[state.caseIndex],answers=state.runs[state.caseIndex],score=answers.filter(a=>a.ok).length,critical=answers.filter(a=>a.critical).length;
 return `<div class="heading"><div><div class="eyebrow">DÉBRIEFING · DOSSIER ${c.code}</div><h1>${c.title}</h1><p>Prenez un instant pour revenir sur vos décisions.</p></div></div>
 <div class="result-intro"><div class="result-number">${score}<small> / 4</small></div><div><h2>${critical?"Des réflexes de sécurité à consolider":score===4?"Une prise en charge bien conduite":"Des décisions à approfondir"}</h2><p>Le score est un repère d’apprentissage. Il ne valide pas une compétence clinique.</p></div></div>
 <div class="result-banner ${critical?"":"ok"}">${critical?`${critical} point${critical>1?"s":""} critique${critical>1?"s":""} à revoir. Un bon score global ne compense pas un risque de sécurité.`:"Aucune erreur critique repérée dans cette tentative. Reprenez les messages clés avec votre formateur."}</div>
 <section class="review-list">${reviewRows(c,answers)}</section><div class="actions"><button class="secondary" data-start="${state.caseIndex}">Rejouer ce dossier</button>${state.caseIndex<CASES.length-1?`<button class="primary" data-start="${state.caseIndex+1}">Dossier suivant →</button>`:`<button class="primary" id="all-results">Bilan de ma garde →</button>`}</div>`;
}
function renderResults(){
 const entries=Object.entries(state.runs),total=entries.length*4,score=entries.flatMap(([i,a])=>a).filter(a=>a.ok).length,critical=entries.flatMap(([i,a])=>a).filter(a=>a.critical).length;
 if(!total)return `<div class="heading"><div><div class="eyebrow">LE TEMPS DU RECUL</div><h1>Mon débriefing</h1></div></div><div class="empty"><h2>Votre garde reste à écrire.</h2><p>Terminez une première situation pour retrouver vos décisions, les points critiques et les messages à emporter.</p><button class="primary" data-start="0">Ouvrir le premier dossier →</button></div>`;
 return `<div class="heading"><div><div class="eyebrow">LE TEMPS DU RECUL</div><h1>Mon débriefing de garde</h1><p>${entries.length}/${CASES.length} dossiers terminés. Seule la dernière tentative terminée de chaque dossier est affichée.</p></div></div><div class="result-intro"><div class="result-number">${score}<small> / ${total}</small></div><div><h2>${critical?"Priorité aux points de sécurité":"Consolider les bons réflexes"}</h2><p>${critical} erreur${critical>1?"s":""} critique${critical>1?"s":""} repérée${critical>1?"s":""}. Ce bilan pédagogique n’est ni un examen validant ni une attestation.</p></div></div>
 <div class="metrics">${dims.map((d,j)=>{const n=entries.filter(([i,a])=>a[j].ok).length;return `<div class="metric"><span>${d}</span><strong>${n}/${entries.length}</strong><div class="meter"><i style="width:${n/entries.length*100}%"></i></div></div>`}).join("")}</div>
 <div class="review-list">${entries.map(([i,a])=>`<article class="review-row"><div><h3>${CASES[i].code} · ${CASES[i].title}</h3><span class="tag">${a.filter(x=>x.ok).length}/4</span></div><p>${a.filter(x=>x.critical).length} point(s) critique(s) à revoir.</p><button class="quiet" data-review="${i}">Ouvrir le débriefing détaillé →</button></article>`).join("")}</div><div class="actions"><button class="secondary" id="back-home">Retour aux situations</button></div>`;
}
function renderSources(){return `<div class="heading"><div><div class="eyebrow">SOCLE SCIENTIFIQUE</div><h1>Référentiels & cadre pédagogique</h1><p>Références initiales consultées le 29 septembre 2026 ; références diphtérie, dossiers REB et vérification ciblée SF2H le 30 septembre 2026. Ces organismes n’ont pas validé le jeu.</p></div></div>
 ${Object.values(SOURCES).map(s=>`<article class="source-card"><h2><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name} ↗</a></h2><p>${s.desc}</p></article>`).join("")}
 <article class="source-card"><h2>Ce que le prototype évalue</h2><p>Quatre dimensions : repérage, protection, gestes sûrs et coordination. Chaque décision vaut 1 point si toutes les réponses attendues, et elles seules, sont sélectionnées. Sinon, elle vaut 0. Les points critiques sont signalés séparément, sans compensation par le score. Ce barème est une convention de conception non validée.</p><p>Les cas sont fictifs. Les paramètres cliniques ne constituent pas un modèle physiologique. Les conséquences affichées illustrent un risque et ne prédisent ni infection ni transmission. La durée annoncée est indicative et aucun temps n’est noté.</p></article>
 <article class="source-card"><h2>À adapter avant une utilisation institutionnelle</h2><p>Faire relire les cas par l’EOH et les référents concernés, tester avec des internes, puis intégrer les circuits locaux : disponibilité des locaux, EPI, prélèvements, interlocuteurs médicaux mobilisables en urgence, alerte REB et transferts. Les définitions de cas REB et les zones à risque doivent être actualisées selon les alertes officielles ; la fenêtre du dossier 04 est fictive. Les dossiers 06 à 09 utilisent des expositions inventées et des référentiels datés, sans décrire une alerte réelle en cours.</p><p>Organisation retenue dans le jeu : hors des horaires de présence de l’EOH, le senior conduit les mesures immédiates selon les protocoles locaux et mobilise les interlocuteurs médicaux et autorités adaptés à la situation. La prise en charge et les alertes urgentes n’attendent pas l’EOH ; une transmission tracée lui permet de reprendre le suivi à ses horaires de présence.</p><p>Les mesures nationales servent de socle. Les décisions complexes, les exceptions et la levée des précautions nécessitent une évaluation clinique et les protocoles validés localement. ESR : établissement de santé de référence ; CNR : centre national de référence ; REB : risque épidémique et biologique. Les dossiers à haut risque entraînent surtout le repérage et l’appel à une équipe expérimentée, pas l’intervention autonome de l’interne.</p></article>
 <article class="source-card" id="privacy-card"><h2>Confidentialité et statistiques pédagogiques</h2><p>Aucune donnée réelle de patient, aucun compte et aucun nom d’apprenant. Les réponses cochées et les scores individuels restent dans la mémoire de cette page et sont perdus à son rechargement. Aucun identifiant d’apprenant, de tentative, de service ou de promotion n’est transmis.</p><p>Le site public utilise Plausible pour compter les visites, les démarrages et les achèvements. Le suivi pédagogique complémentaire compte, par dossier, les décisions adaptées, les décisions à revoir, les erreurs critiques et les dossiers terminés avec ou sans erreur critique. Il ne transmet pas le contenu des réponses, le numéro de la question, le score exact ni le temps de réponse. Les rejeux contribuent aussi à ces compteurs ; ils ne permettent pas de suivre les progrès d’une personne.</p><p><label><input type="checkbox" id="teaching-analytics" ${window.gsvAnalytics?.isTeachingEnabled()?"checked":""}> Partager mes indicateurs pédagogiques pour les statistiques agrégées</label></p><p id="teaching-status" role="status">${window.gsvAnalytics?.isTeachingEnabled()?"Suivi pédagogique activé.":"Suivi pédagogique désactivé."}</p><p>Ce choix n’affecte pas le jeu et reste valable uniquement tant que cette page reste ouverte. Après rechargement, renouvelez votre choix ; aucun stockage persistant n’est ajouté. La désactivation concerne les futurs événements pédagogiques, pas les statistiques de fréquentation ni les événements déjà transmis.</p><p>Plausible fonctionne sans cookie de mesure ni identifiant persistant. Il traite l’adresse IP et le navigateur pour produire un identifiant quotidien, sans conserver leurs valeurs brutes. Ce dispositif minimise les données, sans garantir une impossibilité absolue de réidentification, notamment dans un très petit groupe. <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer">Politique de données de Plausible ↗</a></p><p>La police est chargée auprès de Fontshare ; les références s’ouvrent sur des sites externes.</p></article>`}
function render(){
 const t=performance.now();activeNav();
 main.innerHTML=state.view==="home"?renderHome():state.view==="case"?renderCase():state.view==="case-result"?renderCaseResult():state.view==="results"?renderResults():renderSources();
 main.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>requestStart(Number(b.dataset.start)));
 main.querySelectorAll("[data-resume]").forEach(b=>b.onclick=()=>resumeCase(Number(b.dataset.resume)));
 main.querySelectorAll("[data-review]").forEach(b=>b.onclick=()=>{state.caseIndex=Number(b.dataset.review);setView("case-result")});
 main.querySelector("#back-home")?.addEventListener("click",()=>setView("home"));
 main.querySelector("#resume")?.addEventListener("click",()=>setView("case"));
 main.querySelector("#all-results")?.addEventListener("click",()=>setView("results"));
 main.querySelector("#privacy-info")?.addEventListener("click",()=>{setView("sources");main.querySelector("#privacy-card").scrollIntoView({block:"start"});main.querySelector("#teaching-analytics").focus({preventScroll:true})});
 main.querySelector("#teaching-analytics")?.addEventListener("change",e=>{window.gsvAnalytics?.setTeachingEnabled(e.target.checked);main.querySelector("#teaching-status").textContent=e.target.checked?"Suivi pédagogique activé.":"Suivi pédagogique désactivé."});
 main.querySelectorAll("[data-clue]").forEach(d=>d.addEventListener("toggle",()=>{const i=Number(d.dataset.clue);d.open?state.clues.add(i):state.clues.delete(i)}));
 main.querySelectorAll("input[name=answer]").forEach(input=>input.addEventListener("change",()=>{
  state.selected=Array.from(main.querySelectorAll("input[name=answer]:checked")).map(x=>Number(x.value));
  document.querySelector("#validate").disabled=state.selected.length===0;
 }));
 main.querySelector("#validate")?.addEventListener("click",()=>{
  if(state.revealed||!state.selected.length)return;
  const s=current(),ok=state.selected.length===s.correct.length&&state.selected.every(v=>s.correct.includes(v));
  state.answers[state.caseIndex][state.step]={selected:[...state.selected],ok,critical:!ok&&s.critical};
  trackTeaching(ok?"décision adaptée":"décision à revoir");
  if(!ok&&s.critical)trackTeaching("erreur critique");
  state.revealed=true;render();main.querySelector(".feedback").scrollIntoView({block:"nearest"});main.querySelector("#next").focus({preventScroll:true});
 });
 main.querySelector("#next")?.addEventListener("click",()=>{
  if(state.view!=="case"||!state.revealed)return;
  if(state.step===3){delete state.drafts[state.caseIndex];state.runs[state.caseIndex]=state.answers[state.caseIndex].map(a=>({...a,selected:[...a.selected]}));trackCase("terminé",state.caseIndex);trackTeaching(state.runs[state.caseIndex].some(a=>a.critical)?"bilan avec erreur critique":"bilan sans erreur critique");if(Object.keys(state.runs).length===CASES.length)trackOnce("game-completed","Parcours terminé");setView("case-result");}
  else{state.step++;state.selected=[];state.revealed=false;render();main.querySelector(".question-card").scrollIntoView({block:"start"});main.querySelector("input")?.focus({preventScroll:true});}
 });
 document.querySelector("#perf").textContent=`DOM · rendu ${(performance.now()-t).toFixed(0)} ms`;
}
window.render_game_to_text=()=>JSON.stringify({view:state.view,case:CASES[state.caseIndex].id,step:state.step+1,selected:state.selected,revealed:state.revealed,completed:Object.keys(state.runs).length,score:Object.values(state.runs).flat().filter(a=>a.ok).length,criticalErrors:Object.values(state.runs).flat().filter(a=>a.critical).length,coordinateSystem:"Interface DOM, origine en haut à gauche ; défilement vertical."});
window.advanceTime=()=>{};
render();
