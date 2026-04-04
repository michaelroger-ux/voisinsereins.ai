import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════
   DESIGN SYSTEM
   Premium, calm, organic — like a high-end
   wellness app meets sophisticated communication
   ═══════════════════════════════════════ */
const T = {
  forest: "#3D6B4F", forestLight: "#5B8C5A", forestDark: "#2A4D38",
  sand: "#F5F0E8", sandDark: "#E5DDD3", warmWhite: "#FDFBF7", white: "#fff",
  bark: "#8B7355", barkLight: "#A89880",
  sunrise: "#E8A854", sunriseLight: "#F5D49A",
  coral: "#D4756A", sky: "#6BA3BE", skyLight: "#B8D8E8",
  leaf: "#8DB580", leafLight: "#B8D4AC",
  text: "#2C2C2C", textLight: "#6B6B6B", textMuted: "#9B9B9B",
  purple: "#8B6BAE",
  red: "#C0392B", amber: "#E67E22", amberLight: "#FFF3CD",
  green: "#27AE60", greenLight: "#D4EDDA",
};
const FONT = `'Georgia','Times New Roman',serif`;
const SANS = `'Avenir','Segoe UI','Helvetica Neue',sans-serif`;

const REGLEMENT = `RÈGLEMENT DE COPROPRIÉTÉ - RÉSIDENCE LES TILLEULS
Article 1 - Parties communes: halls, escaliers, ascenseurs, jardins, parking, toiture, façades.
Article 2 - Nuisances sonores: Travaux bruyants lundi-vendredi 8h30-19h00, samedi 9h00-12h00. Interdits dimanches/fériés. Musique tolérée jusqu'à 22h00.
Article 3 - Animaux: Autorisés si pas de nuisances. Chiens en laisse dans parties communes.
Article 4 - Stationnement: Place numérotée par lot. Visiteurs limités à 48h.
Article 5 - Balcons: Pas de modification aspect extérieur. Linge visible interdit. Barbecues charbon interdits.
Article 6 - Entretien: Ne pas encombrer parties communes. Tri sélectif obligatoire.
Article 7 - Charges: Dues trimestriellement. Pénalités 1%/mois après 30 jours.
Article 8 - AG: Au moins 1x/an. Convocations 21 jours avant. Majorité simple sauf travaux (2/3).
Article 9 - Travaux: Modifications parties communes = approbation AG requise.`;

/* ═══ SUJETS STRUCTURÉS ═══ */
const SUJET_STATUS={signale:{label:"Signalé",color:"#6BA3BE",bg:"#6BA3BE18",icon:"📢"},escalade:{label:"Escalade",color:"#E67E22",bg:"#FFF3CD",icon:"⚡"},consultation:{label:"Consultation",color:"#8B6BAE",bg:"#8B6BAE15",icon:"🗳"},action:{label:"Action en cours",color:"#3D6B4F",bg:"#3D6B4F12",icon:"⚙️"},resolu:{label:"Résolu",color:"#27AE60",bg:"#D4EDDA",icon:"✅"}};
const SUJET_CAT={securite:{label:"Sécurité",icon:"🔐",color:"#C0392B"},entretien:{label:"Entretien",icon:"🧹",color:"#E8A854"},maintenance:{label:"Maintenance",icon:"🔧",color:"#8B7355"},viecommune:{label:"Vie commune",icon:"🏠",color:"#6BA3BE"},acces:{label:"Accès / Clés",icon:"🔑",color:"#8B6BAE"}};
const INIT_SUJETS=[
  {id:1,title:"Porte d'entrée laissée ouverte",category:"securite",status:"escalade",signalCount:8,threshold:3,createdAt:"2024-10-08",lastSignal:"2025-02-18",residents:["Marie D.","Sophie L.","Paul V.","Thomas R."],createdBy:"Sophie L.",desc:"La porte d'entrée est régulièrement trouvée ouverte, posant un risque de sécurité pour tous.",
    timeline:[{date:"2024-10-08",type:"signal",author:"Sophie L.",text:"Porte trouvée ouverte en rentrant de nuit."},{date:"2024-11-05",type:"signal",author:"Paul V.",text:"3ème fois cette semaine."},{date:"2024-11-05",type:"signal",author:"Marie D.",text:"Malgré les affichettes, la porte reste ouverte."},{date:"2024-11-05",type:"escalade",author:"Système",text:"Seuil de 3 signalements atteint — escalade automatique."},{date:"2024-12-06",type:"signal",author:"Marie D.",text:"Porte encore ouverte ce soir."},{date:"2025-01-23",type:"signal",author:"Sophie L.",text:"Toujours le même problème."},{date:"2025-02-18",type:"signal",author:"Marie D.",text:"8ème signalement."}],
    aiSugg:[{type:"consultation",text:"Lancer une consultation : « Installer un ferme-porte automatique ? »",cost:"150-300€ répartis"},{type:"lettre",text:"Générer une lettre au syndic demandant un ferme-porte"},{type:"charte",text:"Ajouter à la Charte : obligation de vérifier la fermeture"}],consultation:null},
  {id:2,title:"Propreté des parties communes",category:"entretien",status:"escalade",signalCount:6,threshold:3,createdAt:"2024-11-05",lastSignal:"2025-02-04",residents:["Marie D.","Sophie L.","Thomas R."],createdBy:"Marie D.",desc:"Déchets récurrents dans le hall, ascenseur sale, agent d'entretien absent.",
    timeline:[{date:"2024-11-05",type:"signal",author:"Marie D.",text:"Publicités jetées par terre."},{date:"2024-12-12",type:"signal",author:"Sophie L.",text:"Ascenseur malodorant. Agent d'entretien absent."},{date:"2024-12-12",type:"escalade",author:"Système",text:"Seuil atteint."},{date:"2025-01-23",type:"signal",author:"Sophie L.",text:"Je ne nettoie plus — pas ma responsabilité."},{date:"2025-02-04",type:"signal",author:"Sophie L.",text:"Ascenseur toujours sale."}],
    aiSugg:[{type:"lettre",text:"Générer une mise en demeure au prestataire d'entretien"},{type:"consultation",text:"Lancer un vote : « Changer de prestataire ? »"},{type:"charte",text:"Formaliser les obligations de propreté"}],consultation:null},
  {id:3,title:"Serrure porte d'entrée cassée",category:"maintenance",status:"resolu",signalCount:1,threshold:3,createdAt:"2025-09-18",lastSignal:"2025-09-18",resolvedAt:"2025-09-18",residents:["Sophie L.","Anna K."],createdBy:"Sophie L.",desc:"Serrure défaillante — impossible d'ouvrir avec la clé.",
    timeline:[{date:"2025-09-18",type:"signal",author:"Sophie L.",text:"Impossible d'ouvrir."},{date:"2025-09-18",type:"action",author:"Anna K.",text:"A ouvert pour les résidents bloqués."},{date:"2025-09-18",type:"action",author:"Sophie L.",text:"Serrurier appelé."},{date:"2025-09-18",type:"resolu",author:"Sophie L.",text:"Serrure changée. 2 clés par propriétaire."}],aiSugg:[],consultation:null},
  {id:4,title:"Encombrement du hall",category:"viecommune",status:"signale",signalCount:2,threshold:3,createdAt:"2024-12-06",lastSignal:"2025-05-03",residents:["Marie D.","Anna K."],createdBy:"Marie D.",desc:"Poussettes, meubles, sacs abandonnés dans le hall.",
    timeline:[{date:"2024-12-06",type:"signal",author:"Marie D.",text:"Poussettes et meubles dans l'entrée."},{date:"2024-12-07",type:"info",author:"Anna K.",text:"Situation temporaire. Poussette retirée."},{date:"2025-05-03",type:"signal",author:"Marie D.",text:"Sac abandonné dans le hall."}],
    aiSugg:[{type:"charte",text:"Formaliser : aucun objet dans le hall > 48h"},{type:"consultation",text:"Consulter sur un espace de rangement"}],consultation:null},
  {id:5,title:"Accès cave et compteurs bloqué",category:"acces",status:"signale",signalCount:1,threshold:3,createdAt:"2024-12-06",lastSignal:"2024-12-06",residents:["Paul V.","Marie D."],createdBy:"Paul V.",desc:"Clé de la cave manquante. Accès compteurs impossible.",
    timeline:[{date:"2024-12-06",type:"signal",author:"Paul V.",text:"Pas de clé de la cave. Technicien a besoin d'accès."},{date:"2024-12-06",type:"info",author:"Marie D.",text:"C'est au propriétaire de changer la serrure."}],
    aiSugg:[{type:"lettre",text:"Lettre au propriétaire : obligation d'accès aux compteurs"},{type:"info",text:"Rappel : accès au local compteurs obligatoire"}],consultation:null},
];

/* ═══ SIGNALEMENT — Catégories, Situations & Fiches Réflexes ═══ */
const SIG_CATS=[
  {id:"porte",icon:"🚪",label:"Porte / Accès",cat:"securite",sits:[
    {id:"bloque",label:"Je suis bloqué(e) dehors",urg:true,fiche:{contact:"Serrurier Durand",tel:"04 78 55 12 34",steps:["Vérifiez si un voisin peut ouvrir","Appelez le serrurier ci-dessous","Prévenez le syndic"],cond:null}},
    {id:"forcee",label:"Serrure cassée / forcée",urg:true,fiche:{contact:"Serrurier Durand + Syndic",tel:"04 78 55 12 34",steps:["Ne touchez à rien si effraction","Appelez le serrurier","Contactez le syndic et le 17 si vol"],cond:"Traces d'effraction ? → Appelez le 17"}},
    {id:"ouverte",label:"Porte laissée ouverte",urg:false},
    {id:"interph_hs",label:"Interphone défaillant",urg:false},
  ]},
  {id:"bruit",icon:"🔊",label:"Bruit / Nuisances",cat:"viecommune",sits:[
    {id:"tapage_now",label:"Tapage en ce moment",urg:true,fiche:{contact:"Police (tapage nocturne)",tel:"17",steps:["Notez l'heure et la provenance","Si après 22h → appelez le 17","Si en journée → proposez une médiation"],cond:"Il est après 22h ? → Appelez le 17"}},
    {id:"travaux_hrs",label:"Travaux hors horaires autorisés",urg:false},
    {id:"bruit_regulier",label:"Nuisances sonores régulières",urg:false},
    {id:"animaux_bruit",label:"Animaux bruyants",urg:false},
  ]},
  {id:"panne",icon:"⚡",label:"Pannes",cat:"maintenance",sits:[
    {id:"ascenseur",label:"Ascenseur en panne",urg:true,fiche:{contact:"Schindler Maintenance",tel:"04 78 99 00 11",steps:["Vérifiez si quelqu'un est bloqué","Appelez l'ascensoriste ci-dessous","N'essayez pas d'ouvrir les portes"],cond:"Quelqu'un est bloqué ? → Appelez le 18 (pompiers)"}},
    {id:"elec",label:"Panne électrique (communs)",urg:true,fiche:{contact:"Enedis Urgence",tel:"09 72 67 50 69",steps:["Vérifiez le disjoncteur général","Si parties communes uniquement → appelez Enedis","Prévenez le gardien/syndic"],cond:null}},
    {id:"ampoule",label:"Ampoule grillée",urg:false},
    {id:"sonnette",label:"Sonnette / Interphone HS",urg:false},
    {id:"chauffage",label:"Chauffage / Ventilation",urg:false},
  ]},
  {id:"eau",icon:"💧",label:"Eau",cat:"maintenance",sits:[
    {id:"fuite",label:"Fuite active / Inondation",urg:true,fiche:{contact:"Plombier Urgence Martin",tel:"04 78 33 21 00",steps:["Coupez l'arrivée d'eau si possible","Appelez le plombier","Prévenez les voisins du dessous"],cond:null}},
    {id:"coupure",label:"Coupure d'eau",urg:true,fiche:{contact:"Régie des eaux / Syndic",tel:"09 69 39 40 50",steps:["Vérifiez si vos voisins sont aussi touchés","Si immeuble entier → appelez la régie des eaux","Prévenez le syndic"],cond:"Seul votre logement ? → Vérifiez le robinet d'arrêt"}},
    {id:"humidite",label:"Trace d'humidité / Infiltration",urg:false},
  ]},
  {id:"feu",icon:"🔥",label:"Incendie / Fumée",cat:"securite",sits:[
    {id:"fumee",label:"Fumée ou feu détecté",urg:true,fiche:{contact:"Pompiers",tel:"18",steps:["Évacuez immédiatement","Ne prenez PAS l'ascenseur","Appelez le 18 depuis l'extérieur"],cond:null}},
  ]},
  {id:"intrusion",icon:"🚨",label:"Intrusion / Sécurité",cat:"securite",sits:[
    {id:"suspect",label:"Personne suspecte",urg:true,fiche:{contact:"Police",tel:"17",steps:["N'intervenez pas seul(e)","Appelez le 17","Prévenez les voisins via l'app"],cond:null}},
    {id:"effraction",label:"Effraction / Cambriolage",urg:true,fiche:{contact:"Police + Syndic",tel:"17",steps:["Ne touchez à rien","Appelez le 17","Contactez le syndic"],cond:null}},
  ]},
  {id:"proprete",icon:"🧹",label:"Propreté",cat:"entretien",sits:[
    {id:"hall",label:"Hall / Entrée",urg:false},{id:"ascenseur_sale",label:"Ascenseur",urg:false},{id:"escaliers",label:"Escaliers",urg:false},{id:"parking",label:"Parking / Cave",urg:false},
  ]},
  {id:"poubelle",icon:"🗑",label:"Poubelles",cat:"entretien",sits:[
    {id:"hors_h",label:"Sacs hors horaires",urg:false},{id:"tri",label:"Tri non respecté",urg:false},{id:"sacs_hall",label:"Sacs dans le hall",urg:false},
  ]},
  {id:"encombrement",icon:"📦",label:"Encombrement",cat:"viecommune",sits:[
    {id:"enc_hall",label:"Hall",urg:false},{id:"enc_esc",label:"Escaliers",urg:false},{id:"enc_cave",label:"Cave / Parking",urg:false},
  ]},
  {id:"stationnement",icon:"🚗",label:"Stationnement gênant",cat:"securite",sits:[
    {id:"voie_pub",label:"Voie publique",urg:true,fiche:{contact:"Police municipale",tel:"17",steps:["Relevez la plaque si possible","Appelez la police municipale","Ne déplacez pas le véhicule vous-même"],cond:null}},
    {id:"voie_priv",label:"Voie privée / Parking copro",urg:true,fiche:{contact:"Syndic + Fourrière",tel:"04 78 00 00 00",steps:["Vérifiez si le véhicule appartient à un résident","Contactez le syndic","Si stationnement dangereux → appelez le 17"],cond:"Véhicule bloque une sortie de secours ? → Appelez le 18"}},
  ]},
  {id:"autre",icon:"❓",label:"Autre problème",cat:"viecommune",sits:[
    {id:"autre_urg",label:"Autre urgence",urg:true,fiche:{contact:"Syndic / Urgences",tel:"112",steps:["Évaluez le danger immédiat","Si danger → appelez le 112","Sinon → contactez le syndic"],cond:null}},
    {id:"autre_nonurg",label:"Autre signalement",urg:false},
  ]},
];
const ENTRAIDE_TPL=[
  {id:"colis_recep",icon:"📦",label:"Réceptionner mon colis",fields:["Transporteur","Créneau estimé","Où déposer"],defaultText:"Quelqu'un peut-il réceptionner un colis pour moi ?"},
  {id:"colis_signal",icon:"📬",label:"Colis dans les communs",fields:["Nom sur le colis","Où il se trouve"],defaultText:"Un colis attend dans les communs, il appartient à quelqu'un ?"},
  {id:"ouvrir",icon:"🔑",label:"Ouvrir à un intervenant",fields:["Qui (entreprise)","Quand","Étage/lieu"],defaultText:"Quelqu'un peut-il ouvrir la porte à un intervenant ?"},
  {id:"animal",icon:"🐾",label:"Garde d'animal",fields:["Animal","Dates","Consignes"],defaultText:"Quelqu'un pourrait-il s'occuper de mon animal ?"},
  {id:"artisan",icon:"🔧",label:"Recommandation artisan",fields:["Type d'artisan","Urgence"],defaultText:"Avez-vous un bon artisan à recommander ?"},
  {id:"coup_main",icon:"💪",label:"Coup de main",fields:["Description"],defaultText:"J'aurais besoin d'aide pour..."},
  {id:"courrier",icon:"✉️",label:"Courrier mal distribué",fields:["Destinataire si connu"],defaultText:"J'ai reçu du courrier qui ne m'est pas destiné."},
  {id:"autre_aide",icon:"❓",label:"Autre demande",fields:["Description"],defaultText:"J'aurais besoin d'aide pour quelque chose..."},
];

/* ═══ WHATSAPP PARSER ═══ */
function parseWhatsApp(raw){
  const lines=raw.split(/\n/);const msgs=[];const users=new Set();
  const re=/\[?(\d{1,2}\/\d{1,2}\/\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?)\]?\s*[-–]?\s*([^:]+?):\s*([\s\S]*)/;
  for(const line of lines){
    const m=line.match(re);
    if(m){const[,date,time,author,text]=m;const u=author.trim().replace(/^~/,"").trim();if(u&&text.trim()&&!text.includes("chiffrés de bout en bout")&&!text.includes("a créé ce groupe")&&!text.includes("vous a ajouté")){users.add(u);msgs.push({date,time,author:u,text:text.trim()});}}
  }
  // Detect floors/roles from messages
  const participants=[];
  for(const u of users){
    const uMsgs=msgs.filter(m=>m.author===u);
    let floor="",role="résident";
    const allText=uMsgs.map(m=>m.text).join(" ");
    const floorMatch=allText.match(/(\d+)\s*(?:ème|er|e)?\s*(?:étage|floor)/i);
    if(floorMatch)floor=floorMatch[1]+"ème";
    const rezMatch=allText.match(/rez[\s-]*(?:de[\s-]*)?chaussée/i);
    if(rezMatch)floor="RDC";
    if(allText.match(/propriétaire/i))role="propriétaire";
    if(allText.match(/locataire/i))role="locataire";
    participants.push({name:u,msgCount:uMsgs.length,floor,role,pct:Math.round(uMsgs.length/msgs.length*100)});
  }
  participants.sort((a,b)=>b.msgCount-a.msgCount);
  // Detect themes
  const themes=[];const allText=msgs.map(m=>m.text).join(" ").toLowerCase();
  if(allText.match(/porte.*ouverte|sécurité|fermer.*porte/))themes.push({title:"Sécurité — porte d'entrée",cat:"securite",count:msgs.filter(m=>m.text.toLowerCase().match(/porte.*ouverte|fermer.*porte/)).length});
  if(allText.match(/propre|nettoy|sale|poubelle|déchet/))themes.push({title:"Propreté des communs",cat:"entretien",count:msgs.filter(m=>m.text.toLowerCase().match(/propre|nettoy|sale|poubelle/)).length});
  if(allText.match(/poussette|meuble|encombr|objets?\s+dans/))themes.push({title:"Encombrement parties communes",cat:"viecommune",count:msgs.filter(m=>m.text.toLowerCase().match(/poussette|meuble|encombr/)).length});
  if(allText.match(/serrure|clé|clef|cave|compteur/))themes.push({title:"Accès / Clés / Serrures",cat:"acces",count:msgs.filter(m=>m.text.toLowerCase().match(/serrure|clé|cave|compteur/)).length});
  if(allText.match(/colis|livraison|facteur|bpost|courrier/))themes.push({title:"Colis & Courrier",cat:"viecommune",count:msgs.filter(m=>m.text.toLowerCase().match(/colis|livraison|courrier/)).length});
  if(allText.match(/travaux|réparation|fuite|plombier|serrurier/))themes.push({title:"Maintenance & Travaux",cat:"maintenance",count:msgs.filter(m=>m.text.toLowerCase().match(/travaux|réparation|fuite/)).length});
  const firstDate=msgs[0]?.date||"";const lastDate=msgs[msgs.length-1]?.date||"";
  const leaders=participants.filter(p=>p.pct>=20);
  return{totalMsgs:msgs.length,participants,themes:themes.sort((a,b)=>b.count-a.count),firstDate,lastDate,leaders,periodMonths:msgs.length>0?Math.max(1,Math.round((new Date(lastDate.split("/").reverse().join("-"))-new Date(firstDate.split("/").reverse().join("-")))/(1000*60*60*24*30))):0};
}

/* ═══ AVATAR ═══ */
const Av = ({name,size=36,bg}) => {
  const i = name.split(" ").map(n=>n[0]).join("");
  const colors = [T.forestLight,T.sky,T.coral,T.sunrise,T.purple,T.leaf];
  const c = bg || colors[name.length % colors.length];
  return <div style={{width:size,height:size,borderRadius:size*0.32,background:`linear-gradient(135deg,${c},${c}dd)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:size*0.38,fontFamily:SANS,flexShrink:0}}>{i}</div>;
};

/* ═══ BTN ═══ */
const Btn = ({children,onClick,primary=true,full=false,disabled,small,style:s={}}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding:small?"8px 16px":"14px 24px",borderRadius:14,border:primary?"none":`2px solid ${T.sandDark}`,
    background:primary?disabled?T.sandDark:`linear-gradient(135deg,${T.forest},${T.forestLight})`:"transparent",
    color:primary?"#fff":T.text,fontSize:small?13:15,fontWeight:700,fontFamily:SANS,cursor:disabled?"not-allowed":"pointer",
    width:full?"100%":"auto",boxShadow:primary&&!disabled?`0 4px 16px ${T.forest}33`:"none",
    transition:"transform 0.15s,box-shadow 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,...s,
  }} onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform="scale(0.97)"}} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{children}</button>
);

/* ═══ CHIP ═══ */
const Chip = ({label,active,onClick,color,icon}) => (
  <button onClick={onClick} style={{
    padding:"7px 14px",borderRadius:20,border:"none",background:active?(color||T.forest):"#fff",
    color:active?"#fff":T.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS,
    whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,boxShadow:active?"none":"0 1px 4px rgba(0,0,0,0.06)",
    transition:"all 0.2s",
  }}>{icon&&<span style={{fontSize:14}}>{icon}</span>}{label}</button>
);

/* ═══ CARD ═══ */
const Card = ({children,style:s={},...p}) => (
  <div style={{background:"#fff",borderRadius:18,padding:16,marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.04)",...s}} {...p}>{children}</div>
);

/* ═══ LOADING DOTS ═══ */
const Dots = () => <div style={{display:"flex",gap:4,padding:16}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:T.forestLight,animation:`bounce 1s ${i*0.15}s infinite`}}/>)}</div>;

/* ═══════════════════════════════════════
   ONBOARDING
   ═══════════════════════════════════════ */
function OnboardingWelcome({onNext}) {
  const [show,setShow]=useState(false);
  useEffect(()=>{setTimeout(()=>setShow(true),100)},[]);
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:`linear-gradient(170deg,${T.warmWhite} 0%,${T.sand} 40%,${T.leafLight}33 100%)`,fontFamily:SANS,overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:T.sunriseLight,opacity:0.18}}/>
      <div style={{position:"absolute",bottom:100,left:-60,width:200,height:200,borderRadius:"50%",background:T.leafLight,opacity:0.12}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px",position:"relative",zIndex:1,opacity:show?1:0,transform:show?"none":"translateY(20px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{width:88,height:88,borderRadius:24,background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28,boxShadow:`0 8px 32px ${T.forest}33`}}>
          <span style={{fontSize:40}}>🏡</span>
        </div>
        <h1 style={{fontFamily:FONT,fontSize:30,fontWeight:700,color:T.forest,margin:"0 0 4px",letterSpacing:"-0.5px"}}>VoisinSereins<span style={{color:T.sunrise}}>.ai</span></h1>
        <p style={{fontSize:12,color:T.barkLight,fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",margin:"0 0 24px"}}>L'app de votre copropriété</p>
        <p style={{fontSize:16,color:T.textLight,textAlign:"center",lineHeight:1.6,maxWidth:280,margin:"0 0 40px"}}>Échangez sereinement avec vos voisins, consultez vos documents et obtenez des conseils juridiques instantanés.</p>
        <div style={{width:"100%",maxWidth:300,display:"flex",flexDirection:"column",gap:11}}>
          {[{l:"Continuer avec Google",i:"G",bg:"#fff",c:T.text,b:`1px solid ${T.sandDark}`},{l:"Continuer avec Apple",i:"",bg:"#000",c:"#fff",b:"none"},{l:"Continuer avec Facebook",i:"f",bg:"#1877F2",c:"#fff",b:"none"}].map((btn,i)=>(
            <button key={i} onClick={onNext} style={{width:"100%",padding:"13px 20px",borderRadius:12,border:btn.b,background:btn.bg,color:btn.c,fontSize:14,fontWeight:600,fontFamily:SANS,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",opacity:show?1:0,transform:show?"none":"translateY(12px)",transition:`all 0.5s ${0.3+i*0.1}s cubic-bezier(0.16,1,0.3,1)`}}>
              <span style={{fontSize:16,fontWeight:700,width:20,textAlign:"center"}}>{btn.i}</span>{btn.l}
            </button>
          ))}
        </div>
        <p style={{fontSize:11,color:T.textMuted,textAlign:"center",marginTop:20,lineHeight:1.5,maxWidth:260}}>En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p>
      </div>
    </div>
  );
}

function OnboardingAddress({onFound,onCreate}) {
  const [show,setShow]=useState(false);
  const [q,setQ]=useState("");
  const [sugs,setSugs]=useState([]);
  const [sel,setSel]=useState(null);
  const [searching,setSearching]=useState(false);
  const [result,setResult]=useState(null);
  const timer=useRef(null);
  useEffect(()=>{setTimeout(()=>setShow(true),100)},[]);

  const ADDRS=[
    {label:"12 Rue des Tilleuls, 69003 Lyon",city:"Lyon",copro:true,name:"Résidence Les Tilleuls",members:14,logements:24,year:1975,syndic:"Cabinet Urbania",dpe:"D",immat:"AA-0024-RNC",periodeConst:"1971-1980"},
    {label:"12 Rue des Tilleuls, 75011 Paris",city:"Paris",copro:false},
    {label:"124 Avenue des Tilleuls, 69003 Lyon",city:"Lyon",copro:true,name:"Le Parc des Tilleuls",members:8,logements:36,year:2002,syndic:"Nexity Lamy",dpe:"C",immat:"AA-0158-RNC",periodeConst:"2001-2010"},
    {label:"15 Rue Voltaire, 69001 Lyon",city:"Lyon",copro:false},
  ];

  const handleInput=v=>{setQ(v);setSel(null);setResult(null);
    if(timer.current)clearTimeout(timer.current);
    if(v.length>=3){timer.current=setTimeout(()=>{const f=ADDRS.filter(a=>a.label.toLowerCase().includes(v.toLowerCase()));setSugs(f.length?f:[{label:v+", France",copro:false}])},400)}else setSugs([])};

  const handleSelect=a=>{setSel(a);setQ(a.label);setSugs([]);setSearching(true);setTimeout(()=>{setSearching(false);setResult(a.copro?"found":"new")},1400)};

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.warmWhite,fontFamily:SANS}}>
      <div style={{padding:"56px 24px 24px",background:`linear-gradient(170deg,${T.forest},${T.forestLight})`,borderRadius:"0 0 28px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <p style={{color:T.leafLight,fontSize:12,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",margin:"0 0 6px",opacity:show?1:0,transition:"opacity 0.5s 0.1s"}}>Étape 1 sur 2</p>
        <h2 style={{fontFamily:FONT,fontSize:24,fontWeight:700,color:"#fff",margin:"0 0 6px",opacity:show?1:0,transform:show?"none":"translateY(10px)",transition:"all 0.6s 0.2s cubic-bezier(0.16,1,0.3,1)"}}>Où habitez-vous ?</h2>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:14,margin:0,lineHeight:1.5,opacity:show?1:0,transition:"opacity 0.6s 0.3s"}}>Entrez l'adresse de votre copropriété</p>
      </div>
      <div style={{padding:"20px 16px",flex:1,opacity:show?1:0,transition:"opacity 0.5s 0.4s"}}>
        <div style={{background:"#fff",borderRadius:14,padding:"4px 4px 4px 14px",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",display:"flex",alignItems:"center",border:`2px solid ${q.length>=3?T.forest:T.sandDark}`,transition:"border-color 0.3s"}}>
          <span style={{fontSize:18,marginRight:8}}>📍</span>
          <input type="text" value={q} onChange={e=>handleInput(e.target.value)} placeholder="12 rue des Tilleuls, Lyon..." style={{flex:1,border:"none",outline:"none",fontSize:15,padding:"13px 0",fontFamily:SANS,color:T.text,background:"transparent"}}/>
          {q&&<button onClick={()=>{setQ("");setSugs([]);setResult(null);setSel(null)}} style={{background:"none",border:"none",fontSize:16,color:T.textMuted,cursor:"pointer",padding:10}}>✕</button>}
        </div>
        {sugs.length>0&&!sel&&(
          <div style={{marginTop:8,borderRadius:14,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.08)",background:"#fff"}}>
            {sugs.map((s,i)=>(
              <button key={i} onClick={()=>handleSelect(s)} style={{width:"100%",padding:"12px 14px",border:"none",borderBottom:i<sugs.length-1?`1px solid ${T.sand}`:"none",background:"transparent",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:SANS}}>
                <div style={{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:s.copro?`${T.leafLight}44`:T.sandDark,fontSize:15}}>{s.copro?"🏠":"📍"}</div>
                <div><div style={{fontSize:13,fontWeight:500,color:T.text}}>{s.label}</div>{s.copro&&<div style={{fontSize:11,color:T.forestLight,fontWeight:600,marginTop:1}}>✦ Copropriété active — {s.members} voisins</div>}</div>
              </button>
            ))}
          </div>
        )}
        {searching&&<div style={{marginTop:40,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:44,height:44,border:`3px solid ${T.sandDark}`,borderTopColor:T.forest,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><p style={{marginTop:14,fontSize:13,color:T.textLight}}>Recherche de votre copropriété...</p></div>}

        {result==="found"&&sel&&(
          <Card style={{marginTop:20,border:`2px solid ${T.leafLight}`,boxShadow:`0 4px 24px ${T.forest}15`,animation:"fadeIn 0.5s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:48,height:48,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,fontSize:22}}>🏡</div>
              <div><h3 style={{margin:0,fontSize:17,fontFamily:FONT,color:T.forest}}>{sel.name}</h3><p style={{margin:"2px 0 0",fontSize:12,color:T.textLight}}>{sel.label}</p></div>
            </div>
            {/* Registre national des copropriétés */}
            <div style={{background:`${T.sky}10`,borderRadius:10,padding:"8px 12px",marginBottom:12,border:`1px solid ${T.sky}22`}}>
              <div style={{fontSize:9,fontWeight:700,color:T.sky,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>📋 Registre national des copropriétés</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px",fontSize:11}}>
                <div><span style={{color:T.textMuted}}>Immatriculation</span><div style={{fontWeight:600,color:T.text}}>{sel.immat}</div></div>
                <div><span style={{color:T.textMuted}}>Construction</span><div style={{fontWeight:600,color:T.text}}>{sel.year} ({sel.periodeConst})</div></div>
                <div><span style={{color:T.textMuted}}>Syndic</span><div style={{fontWeight:600,color:T.text}}>{sel.syndic}</div></div>
                <div><span style={{color:T.textMuted}}>DPE</span><div style={{fontWeight:600,color:T.text}}>Classe {sel.dpe}</div></div>
              </div>
            </div>
            <div style={{background:`${T.leafLight}22`,borderRadius:12,padding:"10px 14px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
                {[{v:sel.members,l:"Voisins actifs"},{v:sel.logements,l:"Logements"},{v:Math.round(sel.members/sel.logements*100)+"%",l:"Connectés"}].map((s,i)=>(
                  <div key={i}><div style={{fontSize:22,fontWeight:700,color:T.forest}}>{s.v}</div><div style={{fontSize:10,color:T.textLight,fontWeight:500}}>{s.l}</div></div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,fontWeight:600,color:T.forest}}>Progression</span><span style={{fontSize:11,color:T.textMuted}}>{sel.members}/{sel.logements}</span></div>
              <div style={{height:7,borderRadius:4,background:T.sand}}><div style={{height:"100%",borderRadius:4,width:`${(sel.members/sel.logements)*100}%`,background:`linear-gradient(90deg,${T.forest},${T.leaf})`,transition:"width 1s ease"}}/></div>
            </div>
            <Btn full onClick={()=>onFound(sel)}>🎉 Rejoindre mes {sel.members} voisins</Btn>
          </Card>
        )}

        {result==="new"&&sel&&(
          <Card style={{marginTop:20,border:`2px solid ${T.sunriseLight}`,animation:"fadeIn 0.5s ease"}}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:48,marginBottom:8}}>🚀</div>
              <h3 style={{fontFamily:FONT,fontSize:19,color:T.text,margin:"0 0 4px"}}>Soyez le pionnier !</h3>
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.5,margin:0}}>Aucune copropriété à cette adresse. Créez-la !</p>
            </div>
            <div style={{background:`${T.sunriseLight}33`,borderRadius:12,padding:"12px 14px",marginBottom:16}}>
              <p style={{fontSize:12,color:T.bark,margin:0,lineHeight:1.5}}>✦ Accès immédiat au <strong>conseiller juridique AI</strong> et aux <strong>informations publiques</strong> de votre copropriété.</p>
            </div>
            <Btn full onClick={()=>onCreate(sel)} style={{background:`linear-gradient(135deg,${T.sunrise},${T.coral})`}}>🚀 Créer ma copropriété</Btn>
          </Card>
        )}

        {!searching&&!result&&!sugs.length&&<div style={{marginTop:40,textAlign:"center",opacity:show?1:0,transition:"opacity 0.5s 0.6s"}}><div style={{fontSize:56,marginBottom:8}}>🏢</div><p style={{fontSize:13,color:T.textMuted,lineHeight:1.5}}>Tapez votre adresse pour trouver<br/>ou créer votre copropriété</p></div>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}input::placeholder{color:${T.barkLight}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   ONBOARDING — WHATSAPP IMPORT (Pioneer only)
   ═══════════════════════════════════════ */
function OnboardingWhatsApp({copro,onImport,onSkip}) {
  const [show,setShow]=useState(false);
  const [step,setStep]=useState(0); // 0=intro, 1=analyzing, 2=results
  const [result,setResult]=useState(null);
  useEffect(()=>{setTimeout(()=>setShow(true),100)},[]);

  const handleFile=(e)=>{const f=e.target.files?.[0];if(!f)return;setStep(1);const reader=new FileReader();reader.onload=(ev)=>{setTimeout(()=>{try{const parsed=parseWhatsApp(ev.target.result);setResult(parsed);setStep(2)}catch{setResult({totalMsgs:0,participants:[],themes:[],firstDate:"",lastDate:"",leaders:[],periodMonths:0});setStep(2)}},1500)};reader.readAsText(f)};

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.warmWhite,fontFamily:SANS,overflow:"auto"}}>
      <div style={{padding:"56px 24px 20px",background:`linear-gradient(170deg,#128C7E,#25D366)`,borderRadius:"0 0 28px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",margin:"0 0 6px",opacity:show?1:0,transition:"opacity 0.5s 0.1s"}}>Étape bonus — Pionnier</p>
        <h2 style={{fontFamily:FONT,fontSize:22,fontWeight:700,color:"#fff",margin:"0 0 6px",opacity:show?1:0,transform:show?"none":"translateY(10px)",transition:"all 0.6s 0.2s"}}>Import WhatsApp</h2>
        <p style={{color:"rgba(255,255,255,0.85)",fontSize:13,margin:0,fontWeight:500,opacity:show?1:0,transition:"opacity 0.6s 0.3s"}}>{copro?.name||"Ma Copropriété"}</p>
      </div>

      <div style={{padding:"20px 16px",flex:1,opacity:show?1:0,transition:"opacity 0.5s 0.4s"}}>
        {step===0&&<div>
          <Card style={{textAlign:"center",padding:24,border:`1.5px solid #25D36630`}}>
            <div style={{fontSize:48,marginBottom:10}}>💬</div>
            <h3 style={{fontFamily:FONT,fontSize:18,color:T.forest,margin:"0 0 6px"}}>Votre groupe WhatsApp est une mine d'or</h3>
            <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:"0 0 16px"}}>En important l'historique de votre groupe, l'IA détecte les problèmes récurrents, identifie les résidents, et pré-peuple votre copropriété. Vos voisins retrouveront leur communauté déjà en place.</p>
            <div style={{background:`${T.leafLight}18`,borderRadius:12,padding:12,marginBottom:16,textAlign:"left"}}>
              {["👥 Participants et rôles identifiés","📋 Sujets récurrents détectés automatiquement","⚡ Escalade auto sur les problèmes fréquents","🔒 Messages originaux jamais stockés"].map((t,i)=><p key={i} style={{fontSize:12,color:T.text,margin:"4px 0",lineHeight:1.4}}>  {t}</p>)}
            </div>
            <label style={{display:"block",width:"100%",padding:16,borderRadius:14,border:`2px dashed #25D366`,background:"#25D36608",cursor:"pointer",marginBottom:12}}>
              <input type="file" accept=".txt" onChange={handleFile} style={{display:"none"}}/>
              <span style={{fontSize:24,display:"block",marginBottom:4}}>📎</span>
              <span style={{fontSize:14,fontWeight:700,color:"#128C7E"}}>Choisir le fichier .txt</span>
              <span style={{fontSize:11,color:T.textMuted,display:"block",marginTop:3}}>WhatsApp → Discussion → Plus → Exporter</span>
            </label>
            <button onClick={onSkip} style={{width:"100%",padding:12,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.textMuted}}>Passer cette étape →</button>
          </Card>
        </div>}

        {step===1&&<div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{width:56,height:56,border:`3px solid ${T.sandDark}`,borderTopColor:"#25D366",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 18px"}}/>
          <h3 style={{fontFamily:FONT,fontSize:18,color:T.forest,margin:"0 0 6px"}}>Analyse en cours...</h3>
          <p style={{fontSize:13,color:T.textMuted}}>L'IA parcourt votre historique</p>
        </div>}

        {step===2&&result&&<div>
          <Card style={{textAlign:"center",padding:16,border:`1.5px solid ${T.leafLight}`}}>
            <div style={{fontSize:32,marginBottom:4}}>✨</div>
            <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 4px"}}>Analyse terminée</h3>
            <p style={{fontSize:12,color:T.textLight}}>{result.totalMsgs} messages · {result.participants.length} participants · {result.periodMonths} mois</p>
          </Card>
          {result.participants.length>0&&<div>
            <h4 style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"10px 0 6px"}}>👥 Résidents détectés</h4>
            {result.participants.slice(0,5).map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#fff",borderRadius:10,marginBottom:4,boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`linear-gradient(135deg,${[T.forestLight,T.sky,T.coral,T.sunrise,T.purple][i%5]},${[T.forestLight,T.sky,T.coral,T.sunrise,T.purple][i%5]}dd)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:10,fontFamily:SANS}}>{p.name.split(" ").map(n=>n[0]).join("")}</div>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{p.name}</div><div style={{fontSize:9,color:T.textMuted}}>{p.floor||"—"} · {p.msgCount} msg ({p.pct}%)</div></div>
                {p.pct>=20&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:8,fontWeight:700,background:`${T.sunrise}18`,color:T.sunrise}}>Leader</span>}
              </div>
            ))}
          </div>}
          {result.themes.length>0&&<div>
            <h4 style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"10px 0 6px"}}>📋 Sujets détectés</h4>
            {result.themes.map((t,i)=>{const cat=SUJET_CAT[t.cat];return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#fff",borderRadius:10,marginBottom:4,borderLeft:`3px solid ${cat?.color||T.sky}`,boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                <span style={{fontSize:14}}>{cat?.icon||"📌"}</span>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{t.title}</div><div style={{fontSize:9,color:T.textMuted}}>{t.count} mentions</div></div>
                {t.count>=3&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:8,fontWeight:700,background:T.amberLight,color:T.amber}}>⚡ Escalade</span>}
              </div>
            )})}
          </div>}
          <div style={{marginTop:16}}>
            <Btn full onClick={()=>onImport(result)} style={{background:`linear-gradient(135deg,#25D366,${T.forest})`}}>✅ Importer et continuer</Btn>
            <button onClick={onSkip} style={{width:"100%",marginTop:8,padding:10,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,color:T.textMuted,textAlign:"center"}}>Continuer sans importer</button>
          </div>
        </div>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function OnboardingRole({copro,onContinue}) {
  const [role,setRole]=useState(null);
  const [isCS,setIsCS]=useState(false);
  const [show,setShow]=useState(false);
  useEffect(()=>{setTimeout(()=>setShow(true),100)},[]);
  const roles=[
    {id:"proprio",icon:"🔑",label:"Copropriétaire",desc:"Accès complet : AG, votes, documents financiers, médiation"},
    {id:"locataire",icon:"🏠",label:"Locataire",desc:"Fil d'actualité, annonces, messagerie, conseil AI bail"},
    {id:"concierge",icon:"🛎",label:"Concierge / Gardien",desc:"Fil, annonces, messagerie avec syndic, conseil AI"},
    {id:"syndic",icon:"🏛",label:"Syndic professionnel",desc:"Dashboard de gestion, diffusion officielle, analytics"},
  ];
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:T.warmWhite,fontFamily:SANS}}>
      <div style={{padding:"56px 24px 18px",background:`linear-gradient(170deg,${T.forest},${T.forestLight})`,borderRadius:"0 0 28px 28px",flexShrink:0}}>
        <p style={{color:T.leafLight,fontSize:12,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",margin:"0 0 6px"}}>Étape 2 sur 2</p>
        <h2 style={{fontFamily:FONT,fontSize:24,fontWeight:700,color:"#fff",margin:"0 0 6px"}}>Quel est votre rôle ?</h2>
        <p style={{color:"rgba(255,255,255,0.85)",fontSize:14,margin:0,fontWeight:600}}>{copro?.name || "Ma Copropriété"}</p>
        <p style={{color:"rgba(255,255,255,0.55)",fontSize:12,margin:"2px 0 0"}}>{copro?.city||"—"} · {copro?.logements||"?"} logements</p>
      </div>
      <div style={{padding:"16px 16px 0",flex:1,overflowY:"auto",minHeight:0}}>
        {roles.map((r,i)=>(
          <button key={r.id} onClick={()=>{setRole(r.id);if(r.id!=="proprio")setIsCS(false)}} style={{
            width:"100%",padding:14,borderRadius:16,border:role===r.id?`2px solid ${T.forest}`:`2px solid ${T.sandDark}`,
            background:role===r.id?`${T.leafLight}18`:"#fff",marginBottom:8,cursor:"pointer",textAlign:"left",
            display:"flex",alignItems:"center",gap:12,fontFamily:SANS,
            opacity:show?1:0,transform:show?"none":"translateX(-10px)",transition:`all 0.5s ${0.2+i*0.1}s cubic-bezier(0.16,1,0.3,1)`,
          }}>
            <div style={{width:44,height:44,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:role===r.id?`${T.forest}15`:`${T.sand}`,fontSize:22}}>{r.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{r.label}</div><div style={{fontSize:11,color:T.textMuted,marginTop:1}}>{r.desc}</div></div>
            {role===r.id&&<div style={{marginLeft:"auto",color:T.forest,fontSize:18}}>✓</div>}
          </button>
        ))}

        {/* Conseil syndical option — only for propriétaire */}
        {role==="proprio"&&(
          <div style={{marginTop:4,opacity:show?1:0,transition:"opacity 0.4s 0.6s",animation:"fadeIn 0.4s ease"}}>
            <button onClick={()=>setIsCS(!isCS)} style={{
              width:"100%",padding:12,borderRadius:14,border:isCS?`2px solid ${T.sky}`:`2px solid ${T.sandDark}`,
              background:isCS?`${T.skyLight}22`:"#fff",cursor:"pointer",textAlign:"left",
              display:"flex",alignItems:"center",gap:10,fontFamily:SANS,
            }}>
              <div style={{width:22,height:22,borderRadius:6,border:isCS?`2px solid ${T.sky}`:`2px solid ${T.sandDark}`,background:isCS?T.sky:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {isCS&&<span style={{color:"#fff",fontSize:13,fontWeight:700}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>Je fais partie du conseil syndical</div>
                <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>Accès aux outils CS : préparation AG, suivi travaux</div>
              </div>
            </button>
            {isCS&&<div style={{marginTop:6,background:`${T.sunriseLight}22`,borderRadius:10,padding:"8px 12px"}}>
              <p style={{fontSize:11,color:T.bark,margin:0,lineHeight:1.4}}>⚠️ Votre statut CS fera l'objet d'une vérification.</p>
            </div>}
          </div>
        )}
        <div style={{height:16}}/>
      </div>
      {/* Sticky button at bottom */}
      <div style={{padding:"12px 16px calc(12px + env(safe-area-inset-bottom, 8px))",background:T.warmWhite,borderTop:`1px solid ${T.sand}`,flexShrink:0}}>
        <Btn full disabled={!role} onClick={()=>onContinue({role,isCS})}>{role==="syndic"?"Accéder au dashboard →":"Découvrir l'application →"}</Btn>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   INVITATION KIT
   ═══════════════════════════════════════ */
function InviteKit({copro,userName,onClose}) {
  const [copied,setCopied]=useState(false);
  const [selMsg,setSelMsg]=useState(0);
  const [showName,setShowName]=useState(true);
  const link=`voisinsereins.ai/join/${(copro?.label||"ma-copro").replace(/[\s,]+/g,"-").toLowerCase()}`;
  const nameStr=showName?` — invité(e) par ${userName}`:"";
  const preMsgs=[
    {label:"Convivial",text:`Salut ! 👋 ${showName?`C'est ${userName}. `:""}Je viens de rejoindre notre espace copro sur VoisinSereins. On peut échanger entre voisins, consulter les documents, et avoir des conseils juridiques. Rejoins-nous → ${link}`},
    {label:"Pratique",text:`Bonjour, ${showName?`${userName} vous invite. `:""}Notre copropriété a maintenant son espace numérique sur VoisinSereins.ai. Documents, agenda, annonces entre voisins... Inscris-toi ici : ${link}`},
    {label:"Officiel",text:`Chers voisins, un espace numérique privé a été créé pour notre copropriété sur VoisinSereins.ai. Il permet de retrouver les documents, l'agenda, et d'échanger sereinement.${showName?` Invitation de ${userName}.`:""} Pour rejoindre : ${link}`},
  ];
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 20px 36px",maxHeight:"82vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 18px"}}/>
        <h3 style={{fontFamily:FONT,fontSize:20,color:T.forest,margin:"0 0 4px"}}>Invitez vos voisins</h3>
        <p style={{fontSize:13,color:T.textLight,margin:"0 0 20px",lineHeight:1.5}}>Plus vous êtes nombreux, plus l'app est utile !</p>

        <div style={{background:"#fff",borderRadius:12,padding:"12px 14px",marginBottom:10,border:`1px solid ${T.sandDark}`,display:"flex",alignItems:"center",gap:8}}>
          <span>🔗</span>
          <span style={{flex:1,fontSize:12,color:T.textLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{link}</span>
          <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}} style={{padding:"5px 12px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,background:copied?T.leafLight:T.forest,color:"#fff",cursor:"pointer",fontFamily:SANS}}>{copied?"✓ Copié":"Copier"}</button>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {[{l:"WhatsApp",i:"💬",c:"#25D366"},{l:"SMS",i:"✉️",c:T.sky},{l:"Email",i:"📧",c:T.sunrise}].map((ch,i)=>(
            <button key={i} style={{flex:1,padding:"10px 6px",borderRadius:12,border:"none",background:`${ch.c}12`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:SANS}}>
              <span style={{fontSize:20}}>{ch.i}</span><span style={{fontSize:10,fontWeight:600,color:ch.c}}>{ch.l}</span>
            </button>
          ))}
        </div>

        <div style={{fontSize:11,fontWeight:600,color:T.text,marginBottom:8}}>Choisissez un message pré-rédigé</div>

        {/* Name toggle */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#fff",borderRadius:12,border:`1px solid ${T.sandDark}`,marginBottom:10}}>
          <div><div style={{fontSize:13,fontWeight:500,color:T.text}}>Afficher mon nom</div><div style={{fontSize:10,color:T.textMuted}}>L'invitation mentionnera « {userName} »</div></div>
          <button onClick={()=>setShowName(!showName)} style={{width:44,height:26,borderRadius:13,border:"none",background:showName?T.forest:T.sandDark,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style={{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:3,left:showName?21:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
          </button>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {preMsgs.map((m,i)=>(
            <button key={i} onClick={()=>setSelMsg(i)} style={{flex:1,padding:"7px 10px",borderRadius:8,border:selMsg===i?`2px solid ${T.forest}`:`1.5px solid ${T.sandDark}`,background:selMsg===i?`${T.leafLight}18`:"#fff",cursor:"pointer",fontFamily:SANS,fontSize:11,fontWeight:600,color:selMsg===i?T.forest:T.textMuted,textAlign:"center"}}>{m.label}</button>
          ))}
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:14,border:`1px solid ${T.sandDark}`,fontSize:13,color:T.textLight,lineHeight:1.6,marginBottom:18,minHeight:60}}>
          {preMsgs[selMsg].text}
        </div>

        <div style={{display:"flex",gap:10}}>
          {[{i:"📱",l:"QR Code",d:"Pour le hall"},{i:"🖨️",l:"Affichette A4",d:"PDF à imprimer"}].map((x,i)=>(
            <button key={i} style={{flex:1,padding:"14px 10px",borderRadius:14,border:`2px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,fontFamily:SANS}}>
              <div style={{width:50,height:50,background:T.sand,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{x.i}</div>
              <span style={{fontSize:12,fontWeight:600,color:T.text}}>{x.l}</span>
              <span style={{fontSize:10,color:T.textMuted}}>{x.d}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
function MainApp({copro,role:initRole,isCS:initCS,isNew,waData}) {
  const [tab,setTab]=useState("home");
  const [showInvite,setShowInvite]=useState(false);
  const [coproSelector,setCoproSelector]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [showCoproInfo,setShowCoproInfo]=useState(false);
  const [showVerifyGate,setShowVerifyGate]=useState(null); // null | "proprio" | "syndic" | "cs"
  const [showRoleSwitch,setShowRoleSwitch]=useState(false);

  // ─── USER ROLE & VERIFICATION ───
  const [role,setRole]=useState(initRole);
  const [isCS,setIsCS]=useState(initCS);
  const [verifiedProprio,setVerifiedProprio]=useState(false);
  const [verifySyndicPending,setVerifySyndicPending]=useState(role==="syndic");
  const [verifiedSyndic,setVerifiedSyndic]=useState(false);
  const [verifiedCS,setVerifiedCS]=useState(false);

  // Helper: check if action needs verification gate
  const requireVerif = (type) => {
    if(type==="proprio" && role==="proprio" && !verifiedProprio) { setShowVerifyGate("proprio"); return true; }
    if(type==="syndic" && role==="syndic" && !verifiedSyndic) { setShowVerifyGate("syndic"); return true; }
    if(type==="cs" && isCS && !verifiedCS) { setShowVerifyGate("cs"); return true; }
    return false;
  };

  // ─── USER PROFILE ───
  const [userName,setUserName]=useState("Jean Dupont");
  const [userEmail]=useState("jean.dupont@gmail.com");
  const [userBuilding,setUserBuilding]=useState("Mimosa");
  const [userEtage,setUserEtage]=useState("3");
  const [userDoor,setUserDoor]=useState("Gauche");
  const autoApt = `${userEtage?userEtage+"ème ":""}${userDoor}${userBuilding?" - "+userBuilding:""}`;
  const [userFloor,setUserFloor]=useState("3ème Gauche - Mimosa");
  const [userFloorEdited,setUserFloorEdited]=useState(false);
  const currentApt = userFloorEdited ? userFloor : autoApt;
  const [userNotifs,setUserNotifs]=useState(true);
  const [profilePhoto,setProfilePhoto]=useState(null);
  const [userLots,setUserLots]=useState("");
  const [extraLogements,setExtraLogements]=useState([]);

  // ─── FEED STATE ───
  const [feedCat,setFeedCat]=useState("all");
  const [showComposer,setShowComposer]=useState(false);
  const [draft,setDraft]=useState("");
  const [reforms,setReforms]=useState(null);
  const [reforming,setReforming]=useState(false);
  const [selReform,setSelReform]=useState(null);
  const [posts,setPosts]=useState([
    {id:1,author:"Marie D.",floor:"3B",time:"Auj. 09:14",text:"Bonjour à tous ! Petit rappel : la prochaine AG est prévue le 15 avril. N'hésitez pas à me transmettre vos points à l'ordre du jour.",cat:"officiel",likedBy:["Sophie L.","Thomas R.","Paul V.","Anna K.","Lucas M."],role:"CS",replies:[]},
    {id:10,welcome:true,author:"Pierre B.",floor:"5B",time:"Auj. 08:30",cat:"officiel",text:"",likedBy:[],role:"",replies:[]},
    {id:2,author:"Thomas R.",floor:"1A",time:"Hier 18:30",text:"Quelqu'un saurait recommander un bon serrurier dans le quartier ? Ma serrure a un souci depuis ce matin.",cat:"entraide",likedBy:["Marie D.","Sophie L.","Anna K."],role:"proprio",replies:[{author:"Paul V.",text:"J'ai utilisé SerruPlus le mois dernier, très pro !",time:"Hier 19:02"}]},
    {id:11,welcome:true,author:"Claire F.",floor:"2C",time:"Hier 10:00",cat:"officiel",text:"",likedBy:[],role:"",replies:[]},
    {id:3,author:"Sophie L.",floor:"4C",time:"Hier 14:22",text:"Je propose un apéro entre voisins dimanche prochain dans le jardin commun, vers 17h. Qui est partant ? 🥂",cat:"convivialité",likedBy:["Marie D.","Thomas R.","Paul V.","Anna K.","Lucas M.","Jean Dupont","Pierre B.","Claire F."],role:"locataire",replies:[]},
    {id:4,author:"Lucas M.",floor:"2B",time:"Mar. 10:45",text:"Les travaux de ravalement débutent lundi. L'échafaudage sera monté côté rue. Merci de ne pas garer devant l'entrée.",cat:"travaux",likedBy:["Marie D.","Sophie L.","Thomas R.","Anna K."],role:"syndic",replies:[]},
    {id:12,welcome:true,author:"Marc T.",floor:"1B",time:"Mar. 09:30",cat:"officiel",text:"",likedBy:[],role:"",replies:[]},
    {id:5,author:"Anna K.",floor:"5A",time:"Mar. 09:00",text:"L'ascenseur est en panne depuis hier soir. J'ai signalé au syndic. Intervention prévue demain matin.",cat:"incidents",likedBy:["Marie D.","Sophie L.","Thomas R.","Paul V.","Lucas M.","Jean Dupont"],role:"proprio",replies:[{author:"Lucas M.",text:"Intervention confirmée pour demain 8h.",time:"Mar. 10:00"}]},
    {id:6,author:"Paul V.",floor:"1C",time:"Lun. 16:30",text:"Et si on installait un compost collectif dans le jardin ? J'ai trouvé un modèle à 150€. Ça pourrait être voté à la prochaine AG.",cat:"suggestions",likedBy:["Marie D.","Sophie L.","Thomas R.","Anna K.","Lucas M.","Jean Dupont","Pierre B.","Claire F.","Marc T."],role:"proprio",replies:[]},
  ]);
  const [replyingTo,setReplyingTo]=useState(null);
  const [replyDraft,setReplyDraft]=useState("");
  const [showLikers,setShowLikers]=useState(null); // postId or null
  const [longPressTimer,setLongPressTimer]=useState(null);
  const [editingCat,setEditingCat]=useState(null); // postId or null

  // ─── MESSAGES STATE ───
  const [msgView,setMsgView]=useState("list");
  const [activeConv,setActiveConv]=useState(null);
  const [msgDraft,setMsgDraft]=useState("");
  const convos=[
    {id:1,name:"Marie D.",floor:"3B",role:"CS",lastMsg:"D'accord pour mardi !",time:"09:14",unread:2},
    {id:2,name:"Syndic Urbania",floor:"",role:"syndic",lastMsg:"Votre demande a bien été...",time:"Hier",unread:0},
    {id:3,name:"Thomas R.",floor:"1A",role:"proprio",lastMsg:"Merci pour le tuyau !",time:"Lun.",unread:0},
  ];
  const [convMsgs,setConvMsgs]=useState([
    {from:"them",text:"Bonjour ! Avez-vous reçu la convocation pour l'AG ?",time:"09:10"},
    {from:"them",text:"J'aimerais discuter du point 5 de l'ordre du jour avant.",time:"09:12"},
    {from:"me",text:"Oui, bien reçue ! On peut en discuter mardi si vous voulez ?",time:"09:13"},
    {from:"them",text:"D'accord pour mardi !",time:"09:14"},
  ]);

  // ─── CONSEIL AI STATE ───
  const [aiMsgs,setAiMsgs]=useState([{role:"assistant",text:"Bonjour ! Je suis votre conseiller juridique virtuel pour la copropriété. Posez-moi toute question sur le règlement, les charges, les travaux, vos droits... 😊\n\n⚠️ Information à titre indicatif — ne se substitue pas à un avis juridique professionnel."}]);
  const [aiQuery,setAiQuery]=useState("");
  const [aiLoading,setAiLoading]=useState(false);

  // ─── MEDIATION STATE ───
  const [medView,setMedView]=useState("intro");
  const [medStep,setMedStep]=useState(0);
  const [medDesc,setMedDesc]=useState("");
  const [medReform,setMedReform]=useState(null);

  // ─── AGENDA STATE ───
  const [agendaTab,setAgendaTab]=useState("docs");
  const [docSearch,setDocSearch]=useState("");

  // ─── SUJETS STATE ───
  const [sujets,setSujets]=useState(INIT_SUJETS);
  const [sujetId,setSujetId]=useState(null);
  const [sujetFilter,setSujetFilter]=useState("all");
  const [showNewSujet,setShowNewSujet]=useState(false);
  const [newSujetD,setNewSujetD]=useState({title:"",category:"securite",desc:""});
  const [sigText,setSigText]=useState("");
  const [sujetAiIdx,setSujetAiIdx]=useState(null);
  const [sujetAiLoading,setSujetAiLoading]=useState(false);
  const [sujetAiResult,setSujetAiResult]=useState(null);
  const [consultVote,setConsultVote]=useState(null);

  // ─── SIGNALER+ STATE ───
  const [showSignaler,setShowSignaler]=useState(false);
  const [sigVoie,setSigVoie]=useState(null); // null | "probleme" | "entraide"
  const [sigCatSel,setSigCatSel]=useState(null); // selected SIG_CATS category
  const [sigSitSel,setSigSitSel]=useState(null); // selected situation within category
  const [sigComment,setSigComment]=useState("");
  const [sigDone,setSigDone]=useState(null); // {type:"new"|"added"|"urgent_called"|"urgent_alerted", title, count}
  const [entTplSel,setEntTplSel]=useState(null);
  const [entFields,setEntFields]=useState({});
  const [entDone,setEntDone]=useState(false);

  // ─── WHATSAPP IMPORT STATE ───
  const [showWaImport,setShowWaImport]=useState(false);
  const [waStep,setWaStep]=useState(0); // 0=upload, 1=analyzing, 2=results
  const [waResult,setWaResult]=useState(null);
  const [waImported,setWaImported]=useState(!!waData);

  // Auto-import sujets from onboarding WhatsApp data
  useEffect(()=>{
    if(waData&&waData.themes?.length){
      const newS=waData.themes.map((t,i)=>({id:Date.now()+i,title:t.title,category:t.cat,status:t.count>=3?"escalade":"signale",signalCount:t.count,threshold:3,createdAt:waData.firstDate?.split("/").reverse().join("-")||"2024-01-01",lastSignal:waData.lastDate?.split("/").reverse().join("-")||"2025-01-01",residents:waData.leaders?.map(l=>l.name).slice(0,3)||[],createdBy:"Import WhatsApp",desc:`Sujet détecté dans ${waData.totalMsgs} messages WhatsApp (${t.count} mentions).`,timeline:[{date:new Date().toISOString().split("T")[0],type:"info",author:"Import WhatsApp",text:`Détecté dans l'historique : ${t.count} messages sur ${waData.periodMonths} mois.`}],aiSugg:[{type:"consultation",text:"Lancer une consultation sur ce sujet"},{type:"charte",text:"Formaliser une règle dans la Charte"}],consultation:null}));
      setSujets(p=>[...newS,...p]);
    }
  },[]);

  const EVENTS=[
    {id:1,title:"Assemblée Générale Ordinaire",date:"2026-04-15",time:"18:30",type:"ag",loc:"Salle des fêtes",desc:"Budget, travaux façade, élection CS."},
    {id:2,title:"Début travaux ravalement",date:"2026-05-02",type:"travaux",desc:"Échafaudages côté rue. Durée 3 mois."},
    {id:3,title:"Fête des voisins",date:"2026-05-29",time:"18:00",type:"social",loc:"Jardin commun",desc:"Chacun apporte un plat !"},
    {id:4,title:"Paiement charges Q2",date:"2026-06-30",type:"echeance",desc:"Appel de charges 2ème trimestre."},
    {id:5,title:"Entretien chaudière",date:"2026-04-08",time:"09:00",type:"entretien",desc:"Intervention Engie."},
  ];
  const DOCS=[
    {name:"Règlement de copropriété",type:"pdf",cat:"reglement",date:"2020-03-15"},
    {name:"PV AG 2025",type:"pdf",cat:"ag",date:"2025-04-20",isNew:true},
    {name:"Budget prévisionnel 2026",type:"xlsx",cat:"finances",date:"2025-12-01",isNew:true},
    {name:"Contrat syndic 2024-2027",type:"pdf",cat:"contrats",date:"2024-01-10"},
    {name:"Devis ravalement façade",type:"pdf",cat:"travaux",date:"2025-11-15"},
    {name:"Appel de charges Q1 2026",type:"pdf",cat:"finances",date:"2026-01-05"},
  ];

  const EC={ag:T.coral,travaux:T.sunrise,social:T.sky,echeance:T.purple,entretien:T.forest};
  const EL={ag:"AG",travaux:"Travaux",social:"Social",echeance:"Échéance",entretien:"Entretien"};
  const CC={officiel:T.coral,entraide:T.sky,convivialité:T.sunrise,travaux:T.bark,incidents:"#C0392B",suggestions:T.purple};

  const COPROS=[
    {name:copro?.name||"Résidence Les Tilleuls",addr:"12 Rue des Tilleuls, Lyon",members:isNew?1:14,logements:copro?.logements||24,active:true},
    {name:"Le Clos des Vignes",addr:"8 Impasse des Vignes, Lyon",members:5,logements:12,active:false},
  ];

  // ─── AI CALLS ───
  const callAI = async (system,prompt) => {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:[{role:"user",content:prompt}]})});
      const d = await r.json();
      return d.content?.[0]?.text || null;
    } catch(e) { return null; }
  };

  const handleReformulate = () => {
    if(!draft.trim())return; setReforming(true);
    // Simulated AI reformulation — generates contextual responses based on keywords
    setTimeout(()=>{
      const d=draft.toLowerCase();
      const isBruit=d.includes("bruit")||d.includes("boucan")||d.includes("musique")||d.includes("tapage");
      const isTravaux=d.includes("travaux")||d.includes("chantier")||d.includes("perceuse");
      const isParties=d.includes("poubelle")||d.includes("parties communes")||d.includes("couloir")||d.includes("hall");
      const isAnimal=d.includes("chien")||d.includes("chat")||d.includes("animal");
      const ref=isBruit?"(Art. 2 du règlement — nuisances sonores)":isTravaux?"(Art. 5 — travaux et horaires autorisés)":isParties?"(Art. 3 — usage des parties communes)":isAnimal?"(Art. 8 — animaux domestiques)":"";
      setReforms({
        diplomatique:{
          text:isBruit?"Je souhaiterais attirer votre attention sur le niveau sonore constaté récemment. Serait-il possible d'en discuter afin de trouver un arrangement qui convienne à tous ?":isTravaux?"Je comprends la nécessité des travaux en cours. Serait-il envisageable de limiter les interventions bruyantes aux créneaux autorisés par le règlement ?":isParties?"J'aimerais aborder avec bienveillance la question de l'entretien de nos espaces communs. Pourrions-nous trouver ensemble des solutions pour que chacun s'y sente bien ?":isAnimal?"Je me permets de vous contacter au sujet d'un petit désagrément lié à la présence d'un animal. Pourrions-nous en discuter calmement ?":"Je souhaiterais attirer votre attention sur un point qui me semble important pour notre vie collective. Pourrions-nous en échanger ?",
          emoji:"🤝",ref
        },
        chaleureux:{
          text:isBruit?"Salut les voisins ! 😊 Petit message pour parler du bruit — je sais que chacun a sa vie, mais ce serait super si on pouvait se mettre d'accord sur des créneaux pour les activités bruyantes. Merci de votre compréhension !":isTravaux?"Hello ! Je voulais juste signaler que les travaux sont parfois un peu intenses 🛠 Rien de grave, mais si on pouvait respecter les horaires prévus, ce serait top ! Bon courage pour les travaux !":isParties?"Coucou les voisins ! 😊 Petit rappel amical : nos parties communes sont notre espace partagé — prenons-en soin ensemble pour que chacun s'y sente comme chez soi !":isAnimal?"Hello ! 🐾 Petit message au sujet de nos amis à quatre pattes — je suis sûr qu'on peut trouver un arrangement qui convienne à tous, animaux compris !":"Salut les voisins ! 😊 Je voulais partager une réflexion sur notre vie commune. On est une chouette copro, continuons à bien vivre ensemble !",
          emoji:"💛",ref
        },
        factuel:{
          text:isBruit?`Signalement : des nuisances sonores répétées ont été constatées en soirée. Le règlement de copropriété interdit les bruits excessifs après 22h ${ref}. Merci de veiller au respect de cette disposition.`:isTravaux?`Information : les travaux bruyants sont autorisés uniquement en semaine de 8h à 19h et le samedi de 9h à 12h ${ref}. Merci de respecter ces créneaux.`:isParties?`Rappel : les parties communes doivent être maintenues propres et dégagées ${ref}. Tout objet personnel doit être retiré des espaces partagés.`:isAnimal?`Rappel réglementaire : les propriétaires d'animaux sont tenus de veiller à ce que leurs animaux ne causent pas de nuisances ${ref}.`:`Information à l'attention de la copropriété : un point nécessite notre attention collective. Merci de votre collaboration.`,
          emoji:"📋",ref
        },
      });
      setReforming(false);
    },1200);
  };

  const handlePublish = () => {
    const text=selReform?reforms[selReform].text:draft;
    setPosts([{id:Date.now(),author:userName,floor:currentApt,time:"À l'instant",text,cat:feedCat==="all"?"convivialité":feedCat,likedBy:[],role,replies:[]},... posts]);
    setDraft("");setReforms(null);setSelReform(null);setShowComposer(false);
  };

  const handleAISend = async () => {
    if(!aiQuery.trim())return;const q=aiQuery;setAiQuery("");
    setAiMsgs(p=>[...p,{role:"user",text:q}]);setAiLoading(true);
    const txt = await callAI(`Tu es un conseiller juridique bienveillant pour copropriétaires. Règlement:\n${REGLEMENT}\nRéponds de façon claire, cite les articles pertinents, oriente vers la médiation. Sois chaleureux mais précis. Termine par: "⚠️ Information à titre indicatif." Réponds en français.`,q);
    setAiMsgs(p=>[...p,{role:"assistant",text:txt||"Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer."}]);
    setAiLoading(false);
  };

  const handleMedReform = async () => {
    if(!medDesc.trim())return; setReforming(true);
    const txt = await callAI(`Tu es un médiateur AI neutre pour copropriété. Règlement:\n${REGLEMENT}\nL'utilisateur décrit un différend. Reformule en exposé neutre et factuel, propose un message respectueux à envoyer au voisin, et suggère 2 pistes de compromis. Réponds en JSON: {"resume_neutre":"...","message_propose":"...","compromis":["...","..."]}`,medDesc);
    try { setMedReform(JSON.parse(txt.replace(/```json|```/g,"").trim())); } catch { setMedReform({resume_neutre:"Un différend a été signalé concernant des nuisances entre voisins.",message_propose:"Bonjour, je souhaitais aborder avec vous un sujet qui me préoccupe, dans un esprit constructif...",compromis:["Convenir de créneaux horaires acceptables","Mettre en place un signal d'alerte amiable"]}); }
    setReforming(false);setMedStep(2);
  };

  // ─── SUJETS HANDLERS ───
  const sujetDetail=sujets.find(s=>s.id===sujetId);
  const filteredSujets=sujets.filter(s=>sujetFilter==="all"||s.status===sujetFilter).sort((a,b)=>{const o={escalade:0,consultation:1,action:2,signale:3,resolu:4};return(o[a.status]??5)-(o[b.status]??5)});
  const sujetStats={total:sujets.length,escalade:sujets.filter(s=>s.status==="escalade").length,nonResolu:sujets.filter(s=>s.status!=="resolu").length,resolu:sujets.filter(s=>s.status==="resolu").length};

  const addSignal=(sid)=>{if(!sigText.trim())return;setSujets(p=>p.map(s=>{if(s.id!==sid)return s;const nc=s.signalCount+1;const nt=[...s.timeline,{date:new Date().toISOString().split("T")[0],type:"signal",author:userName,text:sigText}];let ns=s.status;if(nc>=s.threshold&&s.status==="signale"){ns="escalade";nt.push({date:new Date().toISOString().split("T")[0],type:"escalade",author:"Système",text:`Seuil de ${s.threshold} signalements atteint — escalade automatique.`})}return{...s,signalCount:nc,status:ns,timeline:nt,lastSignal:new Date().toISOString().split("T")[0],residents:s.residents.includes(userName)?s.residents:[...s.residents,userName]}}));setSigText("")};

  const launchConsult=(sid,sug)=>{setSujets(p=>p.map(s=>{if(s.id!==sid)return s;const q=sug.text.includes("«")?sug.text.split("«")[1].split("»")[0].trim():sug.text;return{...s,status:"consultation",consultation:{question:q,cost:sug.cost||null,votes:{oui:4,non:1,abstention:1},total:isNew?1:14,deadline:"2026-04-18"},timeline:[...s.timeline,{date:new Date().toISOString().split("T")[0],type:"consultation",author:userName,text:`Consultation lancée : "${q}"`}]}}));setSujetAiIdx(null)};

  const genSujetAi=async(sujet,sug)=>{setSujetAiLoading(true);setSujetAiResult(null);const sys=`Tu es un assistant juridique pour copropriété française. Génère un document professionnel en français. Cite les obligations légales.`;const pr=sug.type==="lettre"?`Lettre formelle: "${sujet.title}". ${sujet.desc}. ${sujet.signalCount} signalements depuis ${sujet.createdAt}. Adressée au syndic.`:sug.type==="charte"?`Article de Charte de Vie Commune: "${sujet.title}". ${sujet.desc}. Clair et applicable.`:`Plan d'action: "${sujet.title}". ${sujet.desc}. ${sujet.signalCount} signalements. Coûts et délais.`;const r=await callAI(sys,pr);setSujetAiResult(r||"Document en cours de préparation...");setSujetAiLoading(false)};

  // ─── WHATSAPP IMPORT HANDLER ───
  const handleWaFile=(e)=>{const f=e.target.files?.[0];if(!f)return;setWaStep(1);const reader=new FileReader();reader.onload=(ev)=>{setTimeout(()=>{try{const parsed=parseWhatsApp(ev.target.result);setWaResult(parsed);setWaStep(2)}catch{setWaResult({totalMsgs:0,participants:[],themes:[],firstDate:"",lastDate:"",leaders:[],periodMonths:0});setWaStep(2)}},1500)};reader.readAsText(f)};

  const importWaSujets=()=>{if(!waResult)return;const newS=waResult.themes.filter(t=>!sujets.some(s=>s.title.toLowerCase().includes(t.title.toLowerCase().split("—")[0].trim()))).map((t,i)=>({id:Date.now()+i,title:t.title,category:t.cat,status:t.count>=3?"escalade":"signale",signalCount:t.count,threshold:3,createdAt:waResult.firstDate?.split("/").reverse().join("-")||"2024-01-01",lastSignal:waResult.lastDate?.split("/").reverse().join("-")||"2025-01-01",residents:waResult.leaders.map(l=>l.name).slice(0,3),createdBy:"Import WhatsApp",desc:`Sujet détecté automatiquement dans ${waResult.totalMsgs} messages WhatsApp (${t.count} mentions).`,timeline:[{date:new Date().toISOString().split("T")[0],type:"info",author:"Import WhatsApp",text:`Détecté dans l'historique WhatsApp : ${t.count} messages sur ${waResult.periodMonths} mois.`}],aiSugg:[{type:"consultation",text:`Lancer une consultation sur ce sujet`},{type:"charte",text:`Formaliser une règle dans la Charte`}],consultation:null}));if(newS.length)setSujets(p=>[...newS,...p]);setWaImported(true);setShowWaImport(false);setWaStep(0);setWaResult(null);setAgendaTab("sujets");setTab("copro")};

  // ─── SIGNALER+ HANDLERS ───
  const resetSignaler=()=>{setShowSignaler(false);setSigVoie(null);setSigCatSel(null);setSigSitSel(null);setSigComment("");setSigDone(null);setEntTplSel(null);setEntFields({});setEntDone(false)};

  const submitSignal=(cat,sit,comment)=>{
    const title=`${cat.label} — ${sit.label}`;const txt=comment||sit.label;const today=new Date().toISOString().split("T")[0];
    const match=sujets.find(s=>s.category===cat.cat&&(s.title.toLowerCase().includes(cat.label.toLowerCase())||cat.label.toLowerCase().includes(s.title.toLowerCase().split("—")[0].trim().toLowerCase())));
    if(match){
      const nc=match.signalCount+1;const nt=[...match.timeline,{date:today,type:"signal",author:userName,text:txt}];let ns=match.status;
      if(nc>=match.threshold&&match.status==="signale"){ns="escalade";nt.push({date:today,type:"escalade",author:"Système",text:`Seuil de ${match.threshold} signalements atteint — escalade automatique.`})}
      setSujets(p=>p.map(s=>s.id===match.id?{...s,signalCount:nc,status:ns,timeline:nt,lastSignal:today,residents:s.residents.includes(userName)?s.residents:[...s.residents,userName]}:s));
      return{type:"added",title:match.title,count:nc};
    }else{
      const ns={id:Date.now(),title,category:cat.cat,status:"signale",signalCount:1,threshold:3,createdAt:today,lastSignal:today,residents:[userName],createdBy:userName,desc:txt,timeline:[{date:today,type:"signal",author:userName,text:txt}],aiSugg:[{type:"consultation",text:"Lancer une consultation"},{type:"charte",text:"Formaliser dans la Charte"}],consultation:null};
      setSujets(p=>[ns,...p]);
      return{type:"new",title,count:1};
    }
  };

  const handleUrgentAction=(cat,sit,action)=>{
    // action: "called" | "alerted"
    const today=new Date().toISOString().split("T")[0];const title=`${cat.label} — ${sit.label}`;
    const postText=action==="called"
      ?`🔴 ${sit.label} signalé(e) par ${userName}. ${sit.fiche.contact} contacté. 📞 ${sit.fiche.tel}`
      :`🔴 ${sit.label} signalé(e) par ${userName}. Quelqu'un peut-il contacter ${sit.fiche.contact} ? 📞 ${sit.fiche.tel}`;
    setPosts(p=>[{id:Date.now(),author:userName,floor:currentApt,time:"À l'instant",text:postText,cat:"incidents",likedBy:[],role,replies:[]},...p]);
    // Also create/update sujet
    const r=submitSignal(cat,sit,postText);
    setSigDone({type:action==="called"?"urgent_called":"urgent_alerted",title,count:r.count,contact:sit.fiche.contact,tel:sit.fiche.tel});
  };

  const submitNonUrgent=()=>{
    const cat=sigCatSel;const sit=sigSitSel;if(!cat||!sit)return;
    const comment=sigComment.trim()||sit.label;
    const r=submitSignal(cat,sit,comment);
    // Also post to feed
    setPosts(p=>[{id:Date.now(),author:userName,floor:currentApt,time:"À l'instant",text:`🟡 ${cat.icon} ${cat.label} — ${sit.label}${sigComment.trim()?" : "+sigComment.trim():""}`,cat:"incidents",likedBy:[],role,replies:[]},...p]);
    setSigDone(r);
  };

  const submitEntraide=()=>{
    const tpl=entTplSel;if(!tpl)return;
    const details=tpl.fields.map(f=>entFields[f]?`${f}: ${entFields[f]}`:"").filter(Boolean).join(" · ");
    const text=`${tpl.defaultText}${details?"\n"+details:""}`;
    setPosts(p=>[{id:Date.now(),author:userName,floor:currentApt,time:"À l'instant",text,cat:"entraide",likedBy:[],role,replies:[]},...p]);
    setEntDone(true);
  };

  const TABS=[
    {id:"home",icon:"🏠",label:"Accueil",color:T.forest},
    {id:"feed",icon:"💬",label:"Fil",color:T.sky},
    {id:"agenda",icon:"📅",label:"Agenda",color:T.sunrise},
    {id:"ai",icon:"⚖️",label:"Conseil",color:T.purple},
    {id:"copro",icon:"🏢",label:"Copro",color:T.bark},
  ];

  const CATS=[{id:"all",l:"Tous",i:"📋"},{id:"officiel",l:"Officiel",i:"📢"},{id:"convivialité",l:"Social",i:"🎉"},{id:"entraide",l:"Entraide",i:"🤝"},{id:"travaux",l:"Travaux",i:"🛠"},{id:"incidents",l:"Urgences",i:"⚠️"},{id:"suggestions",l:"Idées",i:"💡"}];

  const filteredPosts = feedCat==="all"?posts:posts.filter(p=>p.cat===feedCat);

  const activeCopro = COPROS[0];

  return (
    <div style={{height:"100%",background:T.sand,fontFamily:SANS,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
      {/* ─── HEADER ─── */}
      <div style={{background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,padding:"48px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",flexShrink:0,zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          <button onClick={()=>setShowProfile(true)} style={{background:"none",border:"2px solid rgba(255,255,255,0.3)",cursor:"pointer",padding:0,borderRadius:14,flexShrink:0}}>
            {profilePhoto
              ?<img src={profilePhoto} style={{width:36,height:36,borderRadius:12,objectFit:"cover"}} alt=""/>
              :<div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
            }
          </button>
          <button onClick={()=>setShowCoproInfo(true)} style={{background:"none",border:"none",cursor:"pointer",padding:0,minWidth:0,textAlign:"left"}}>
            <h1 style={{fontFamily:FONT,fontSize:15,color:"#fff",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textDecoration:"none"}}>{activeCopro.name}</h1>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.65)",margin:"1px 0 0"}}>{activeCopro.members} voisin{activeCopro.members>1?"s":""} · {activeCopro.logements} log. · {Math.round(activeCopro.members/activeCopro.logements*100)}%</p>
          </button>
          <button onClick={()=>setCoproSelector(!coproSelector)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 6px",flexShrink:0}}>
            <span style={{color:"rgba(255,255,255,0.6)",fontSize:14}}>▼</span>
          </button>
        </div>
        <button onClick={()=>setShowInvite(true)} style={{padding:"7px 10px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS,flexShrink:0}}>+ Inviter</button>

        {/* Copro Selector Dropdown */}
        {coproSelector&&<div style={{position:"absolute",top:"100%",left:16,right:16,background:"#fff",borderRadius:16,boxShadow:"0 8px 32px rgba(0,0,0,0.12)",zIndex:100,overflow:"hidden"}}>
          {COPROS.map((c,i)=>(
            <button key={i} onClick={()=>setCoproSelector(false)} style={{width:"100%",padding:"14px 16px",border:"none",borderBottom:i<COPROS.length-1?`1px solid ${T.sand}`:"none",background:c.active?`${T.leafLight}18`:"transparent",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,fontFamily:SANS}}>
              <div style={{width:40,height:40,borderRadius:12,background:c.active?`${T.forest}15`:T.sand,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏠</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{c.name}</div><div style={{fontSize:11,color:T.textMuted}}>{c.addr}</div></div>
              {c.active&&<span style={{color:T.forest,fontSize:16}}>✓</span>}
            </button>
          ))}
          <button style={{width:"100%",padding:"12px 16px",border:"none",background:T.sand,cursor:"pointer",textAlign:"center",fontFamily:SANS,fontSize:13,fontWeight:600,color:T.forest}}>+ Ajouter une copropriété</button>
        </div>}
      </div>

      {/* Progress bar */}
      <div style={{padding:"0 16px",flexShrink:0}}><div style={{height:3,borderRadius:2,background:T.sandDark,marginTop:-1.5,position:"relative",zIndex:2}}>
        <div style={{height:"100%",borderRadius:2,width:`${(activeCopro.members/activeCopro.logements)*100}%`,background:`linear-gradient(90deg,${T.sunrise},${T.leaf})`,transition:"width 1s"}}/>
      </div></div>

      {/* ─── TAB CONTENT ─── */}
      <div style={{flex:1,overflowY:"auto",minHeight:0}}>

        {/* ═══ HOME TAB ═══ */}
        {tab==="home"&&<div style={{padding:14}}>
          {/* Syndic demo banner */}
          {role==="syndic"&&!verifiedSyndic&&(
            <div onClick={()=>setShowVerifyGate("syndic")} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:`${T.coral}10`,borderRadius:14,marginBottom:12,cursor:"pointer",border:`1.5px solid ${T.coral}30`}}>
              <span style={{fontSize:18}}>🏛</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.coral}}>Mode démo syndic</div><div style={{fontSize:11,color:T.textMuted}}>Vérifiez votre statut professionnel pour activer toutes les fonctions</div></div>
              <span style={{fontSize:11,fontWeight:600,color:T.coral}}>Vérifier →</span>
            </div>
          )}
          {/* Welcome card */}
          <Card style={{background:`linear-gradient(135deg,${T.forest}08,${T.leafLight}22)`,border:`1px solid ${T.leafLight}44`,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              {profilePhoto
                ?<img src={profilePhoto} style={{width:44,height:44,borderRadius:14,objectFit:"cover"}} alt=""/>
                :<div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:17,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
              }
              <div><h2 style={{fontFamily:FONT,fontSize:19,color:T.forest,margin:0}}>Bonjour {userName.split(" ")[0]} !</h2><p style={{fontSize:12,color:T.textLight,margin:"2px 0 0"}}>{role==="proprio"?"Copropriétaire":role==="locataire"?"Locataire":role==="concierge"?"Concierge":"Syndic"}{isCS?" · Conseil syndical":""} · App. {currentApt}</p></div>
            </div>
            {isNew?
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:0}}>Bienvenue sur VoisinSereins ! Vous êtes le premier membre de votre copropriété. Invitez vos voisins pour profiter pleinement de l'app.</p>:
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:0}}>Votre copropriété est active avec {activeCopro.members} voisins connectés sur {activeCopro.logements} logements.</p>
            }
          </Card>

          {/* WhatsApp import banner — shown until imported */}
          {!waImported&&<Card style={{background:"linear-gradient(135deg,#25D36612,#128C7E08)",border:"1.5px solid #25D36630",padding:18,cursor:"pointer"}} onClick={()=>{setShowWaImport(true);setWaStep(0);setWaResult(null)}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:48,height:48,borderRadius:14,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💬</div>
              <div style={{flex:1}}>
                <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#128C7E"}}>Vous avez un groupe WhatsApp ?</h3>
                <p style={{margin:"3px 0 0",fontSize:12,color:T.textLight,lineHeight:1.4}}>Importez-le pour détecter les sujets récurrents et retrouver vos voisins déjà là.</p>
              </div>
              <span style={{fontSize:18,color:"#25D366"}}>→</span>
            </div>
            <div style={{display:"flex",gap:6,marginTop:10}}>
              {["📢 Sujets détectés","👥 Résidents identifiés","⚡ Warm start"].map((t,i)=>(
                <span key={i} style={{flex:1,textAlign:"center",padding:"4px 2px",borderRadius:6,background:"rgba(255,255,255,0.7)",fontSize:9,fontWeight:600,color:"#128C7E"}}>{t}</span>
              ))}
            </div>
          </Card>}

          {/* Progress card */}
          <Card style={{padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h3 style={{fontSize:14,fontWeight:700,color:T.forest,margin:0,fontFamily:SANS}}>Couverture de la copropriété</h3>
              <span style={{fontSize:20,fontWeight:700,color:T.forest}}>{Math.round(activeCopro.members/activeCopro.logements*100)}%</span>
            </div>
            <div style={{height:10,borderRadius:5,background:T.sand,marginBottom:8}}>
              <div style={{height:"100%",borderRadius:5,width:`${(activeCopro.members/activeCopro.logements)*100}%`,background:`linear-gradient(90deg,${T.forest},${T.leaf})`,transition:"width 1s"}}/>
            </div>
            <p style={{fontSize:12,color:T.textMuted,margin:"0 0 12px"}}>{activeCopro.members} logements représentés sur {activeCopro.logements}</p>
            <Btn full small onClick={()=>setShowInvite(true)} style={{background:`linear-gradient(135deg,${T.sunrise},${T.coral})`}}>📨 Inviter mes voisins</Btn>
          </Card>

          {/* Quick access grid */}
          <h3 style={{fontSize:13,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"18px 0 10px"}}>Accès rapide</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            {[
              {icon:"⚠️",label:"Signaler +",desc:"Problème ou entraide",color:T.coral,tab:"signaler"},
              {icon:"⚖️",label:"Conseiller juridique",desc:"Posez vos questions",color:T.purple,tab:"ai"},
              {icon:"💬",label:"Fil d'actualité",desc:isNew?"En attente de voisins":`${posts.filter(p=>!p.welcome).length} messages`,color:T.sky,tab:"feed"},
              {icon:"📅",label:"Agenda",desc:`${EVENTS.length} événements`,color:T.sunrise,tab:"agenda"},
              {icon:"✉️",label:"Messages",desc:isNew?"—":`${convos.filter(c=>c.unread>0).length} non lu(s)`,color:T.forest,tab:"copro_msg"},
              {icon:"📁",label:"Documents",desc:"Règlement, AG, finances",color:T.bark,tab:"copro_docs"},
              {icon:"📋",label:"Sujets",desc:`${sujetStats.nonResolu} non résolu${sujetStats.nonResolu>1?"s":""}`,color:T.amber,tab:"copro_sujets"},
              {icon:"👤",label:"Mon profil",desc:userName,color:T.forestLight,tab:"profile"},
            ].map((item,i)=>(
              <button key={i} onClick={()=>{if(item.tab==="copro_msg"){setAgendaTab("msg");setTab("copro")}else if(item.tab==="copro_docs"){setAgendaTab("docs");setTab("copro")}else if(item.tab==="copro_sujets"){setAgendaTab("sujets");setSujetId(null);setTab("copro")}else if(item.tab==="signaler"){setShowSignaler(true);setSigVoie(null);setSigDone(null);setEntDone(false)}else if(item.tab==="profile"){setShowProfile(true)}else{setTab(item.tab)}}} style={{padding:16,borderRadius:16,border:"none",background:"#fff",cursor:"pointer",textAlign:"left",fontFamily:SANS,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",gap:8,transition:"transform 0.15s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{width:40,height:40,borderRadius:12,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{item.icon}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{item.label}</div><div style={{fontSize:11,color:T.textMuted}}>{item.desc}</div></div>
              </button>
            ))}
          </div>

          {/* Upcoming events */}
          <h3 style={{fontSize:13,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>Prochains événements</h3>
          {EVENTS.sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3).map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#fff",borderRadius:14,marginBottom:8,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",cursor:"pointer"}} onClick={()=>setTab("agenda")}>
              <div style={{width:42,height:42,borderRadius:12,background:`${EC[e.type]}15`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:700,color:EC[e.type]}}>{new Date(e.date).getDate()}</span>
                <span style={{fontSize:8,fontWeight:600,color:EC[e.type],textTransform:"uppercase"}}>{new Date(e.date).toLocaleDateString("fr-FR",{month:"short"})}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.title}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{e.time||"Toute la journée"}{e.loc?` · ${e.loc}`:""}</div>
              </div>
              <span style={{padding:"3px 7px",borderRadius:6,fontSize:9,fontWeight:700,background:`${EC[e.type]}18`,color:EC[e.type],flexShrink:0}}>{EL[e.type]}</span>
            </div>
          ))}
          <button onClick={()=>setTab("agenda")} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,fontWeight:600,color:T.forestLight}}>Voir tout l'agenda →</button>

          {/* Recent activity */}
          <h3 style={{fontSize:13,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"16px 0 10px"}}>Dernière activité</h3>
          {posts.slice(0,2).map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",background:"#fff",borderRadius:14,marginBottom:8,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",cursor:"pointer"}} onClick={()=>setTab("feed")}>
              <Av name={p.author} size={32}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,color:T.textMuted}}><strong style={{color:T.text}}>{p.author}</strong> · {p.time}</div>
                <p style={{fontSize:13,color:T.text,lineHeight:1.5,margin:"3px 0 0",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.text}</p>
              </div>
            </div>
          ))}
          <button onClick={()=>setTab("feed")} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,fontWeight:600,color:T.forestLight}}>Voir tout le fil →</button>

          {/* Copro info quick card */}
          <Card style={{marginTop:10,background:`${T.sunriseLight}12`,border:`1px solid ${T.sunriseLight}44`,padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <span style={{fontSize:20}}>🏡</span>
              <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{activeCopro.name}</div><div style={{fontSize:11,color:T.textMuted}}>{activeCopro.addr}</div></div>
            </div>
            <div style={{display:"flex",gap:8}}>
              {[{l:"1975",d:"Construction"},{l:activeCopro.logements,d:"Logements"},{l:"DPE D",d:"Énergie"}].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center",padding:"6px 0"}}><div style={{fontSize:15,fontWeight:700,color:T.bark}}>{s.l}</div><div style={{fontSize:9,color:T.textMuted}}>{s.d}</div></div>
              ))}
            </div>
            <button onClick={()=>setShowCoproInfo(true)} style={{width:"100%",marginTop:8,padding:8,borderRadius:8,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,fontWeight:600,color:T.forest}}>Voir toutes les infos →</button>
          </Card>
        </div>}

        {/* Signaler+ FAB — visible on Home and Feed */}
        {(tab==="home"||tab==="feed")&&<button onClick={()=>{setShowSignaler(true);setSigVoie(null);setSigDone(null);setEntDone(false)}} style={{position:"absolute",bottom:68,right:18,width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${T.coral},${T.sunrise})`,border:"none",color:"#fff",fontSize:24,cursor:"pointer",boxShadow:`0 4px 16px ${T.coral}44`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"transform 0.15s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.93)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>+</button>}

        {/* ═══ FEED TAB ═══ */}
        {tab==="feed"&&<div style={{padding:"14px 14px 70px"}}>
          {/* Compose bar */}
          <button onClick={()=>setShowComposer(true)} style={{width:"100%",padding:"12px 16px",borderRadius:14,border:"none",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:SANS,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",marginBottom:14,textAlign:"left"}}>
            <div style={{width:32,height:32,borderRadius:10,background:`${T.forest}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✏️</div>
            <span style={{fontSize:13,color:T.textMuted,flex:1}}>Écrire un message à la copropriété...</span>
            <span style={{fontSize:11,fontWeight:600,color:T.forest}}>Publier</span>
          </button>

          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>{CATS.map(c=><Chip key={c.id} label={c.l} icon={c.i} active={feedCat===c.id} color={CC[c.id]||T.forest} onClick={()=>setFeedCat(c.id)}/>)}</div>
          {filteredPosts.map(p=>{
            if(p.welcome) return (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:`${T.leafLight}15`,borderRadius:12,marginBottom:8,border:`1px solid ${T.leafLight}33`}}>
                <span style={{fontSize:18}}>👋</span>
                <p style={{fontSize:12,color:T.forest,margin:0,flex:1}}><strong>Bienvenue à {p.author}</strong> <span style={{color:T.textMuted,fontWeight:400}}>(App. {p.floor})</span> 🎉</p>
                <span style={{fontSize:10,color:T.textMuted}}>{p.time}</span>
              </div>
            );
            const myLike=p.likedBy.includes(userName);
            const isOwn=p.author===userName;
            return (
            <Card key={p.id}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Av name={p.author}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.author} <span style={{fontWeight:400,color:T.textMuted,fontSize:11}}>· {p.floor}</span>
                    {p.role==="syndic"&&<span style={{marginLeft:6,padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:T.coral,color:"#fff"}}>SYNDIC</span>}
                    {p.role==="CS"&&<span style={{marginLeft:6,padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:T.sky,color:"#fff"}}>CS</span>}
                  </div>
                  <div style={{fontSize:10,color:T.textMuted}}>{p.time}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{position:"relative"}}>
                    <button onClick={()=>isOwn&&setEditingCat(editingCat===p.id?null:p.id)} style={{padding:"3px 9px",borderRadius:7,fontSize:10,fontWeight:600,background:`${CC[p.cat]||T.sand}18`,color:CC[p.cat]||T.textMuted,border:"none",cursor:isOwn?"pointer":"default",fontFamily:SANS,display:"flex",alignItems:"center",gap:3}}>
                      {p.cat}{isOwn&&<span style={{fontSize:8}}>▼</span>}
                    </button>
                    {editingCat===p.id&&<div style={{position:"absolute",top:"100%",right:0,marginTop:4,background:"#fff",borderRadius:10,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",zIndex:50,overflow:"hidden",minWidth:130}}>
                      {CATS.filter(c=>c.id!=="all").map(c=>(
                        <button key={c.id} onClick={()=>{setPosts(prev=>prev.map(x=>x.id===p.id?{...x,cat:c.id}:x));setEditingCat(null)}} style={{width:"100%",padding:"8px 12px",border:"none",borderBottom:`1px solid ${T.sand}`,background:p.cat===c.id?`${T.leafLight}18`:"transparent",cursor:"pointer",textAlign:"left",fontFamily:SANS,fontSize:11,display:"flex",alignItems:"center",gap:6}}>
                          <span>{c.i}</span><span style={{color:p.cat===c.id?T.forest:T.text}}>{c.l}</span>
                        </button>
                      ))}
                    </div>}
                  </div>
                  {isOwn&&<button onClick={()=>setPosts(prev=>prev.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",fontSize:14,color:T.textMuted,cursor:"pointer",padding:2}} title="Supprimer">×</button>}
                </div>
              </div>
              <p style={{fontSize:13.5,color:T.text,lineHeight:1.6,margin:"0 0 8px"}}>{p.text}</p>
              {/* Replies */}
              {p.replies.length>0&&<div style={{marginBottom:8,paddingLeft:12,borderLeft:`2px solid ${T.sandDark}`}}>
                {p.replies.map((r,ri)=>(
                  <div key={ri} style={{marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:600,color:T.text}}>{r.author}</span>
                    <span style={{fontSize:10,color:T.textMuted}}> · {r.time}</span>
                    <p style={{fontSize:12,color:T.textLight,lineHeight:1.5,margin:"2px 0 0"}}>{r.text}</p>
                  </div>
                ))}
              </div>}
              {/* Reply input */}
              {replyingTo===p.id&&<div style={{display:"flex",gap:6,marginBottom:8}}>
                <input value={replyDraft} onChange={e=>setReplyDraft(e.target.value)} placeholder="Votre réponse..." autoFocus style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1.5px solid ${T.sandDark}`,fontSize:12,fontFamily:SANS,outline:"none",background:"#fff"}} onKeyDown={e=>{if(e.key==="Enter"&&replyDraft.trim()){setPosts(prev=>prev.map(x=>x.id===p.id?{...x,replies:[...x.replies,{author:userName,text:replyDraft,time:"Maint."}]}:x));setReplyDraft("");setReplyingTo(null)}}}/>
                <button onClick={()=>{if(replyDraft.trim()){setPosts(prev=>prev.map(x=>x.id===p.id?{...x,replies:[...x.replies,{author:userName,text:replyDraft,time:"Maint."}]}:x));setReplyDraft("");setReplyingTo(null)}}} style={{width:36,height:36,borderRadius:10,border:"none",background:replyDraft.trim()?T.forest:T.sandDark,color:"#fff",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
              </div>}
              {/* Actions: like + reply */}
              <div style={{display:"flex",gap:14,alignItems:"center"}}>
                <button
                  onMouseDown={()=>{const t=setTimeout(()=>{setShowLikers(p.id);setLongPressTimer(null)},500);setLongPressTimer(t)}}
                  onMouseUp={()=>{if(longPressTimer){clearTimeout(longPressTimer);setLongPressTimer(null);setPosts(prev=>prev.map(x=>x.id===p.id?{...x,likedBy:myLike?x.likedBy.filter(n=>n!==userName):[...x.likedBy,userName]}:x))}}}
                  onMouseLeave={()=>{if(longPressTimer){clearTimeout(longPressTimer);setLongPressTimer(null)}}}
                  onTouchStart={()=>{const t=setTimeout(()=>{setShowLikers(p.id);setLongPressTimer(null)},500);setLongPressTimer(t)}}
                  onTouchEnd={e=>{e.preventDefault();if(longPressTimer){clearTimeout(longPressTimer);setLongPressTimer(null);setPosts(prev=>prev.map(x=>x.id===p.id?{...x,likedBy:myLike?x.likedBy.filter(n=>n!==userName):[...x.likedBy,userName]}:x))}}}
                  style={{background:"none",border:"none",fontSize:12,color:myLike?T.coral:T.textMuted,cursor:"pointer",fontFamily:SANS,fontWeight:myLike?600:400,userSelect:"none"}}>
                  {myLike?"❤️":"🤍"} {p.likedBy.length}
                </button>
                <button onClick={()=>{setReplyingTo(replyingTo===p.id?null:p.id);setReplyDraft("")}} style={{background:"none",border:"none",fontSize:12,color:replyingTo===p.id?T.forest:T.textMuted,cursor:"pointer",fontFamily:SANS}}>💬 Répondre{p.replies.length>0?` (${p.replies.length})`:""}</button>
              </div>
              {/* Likers popup */}
              {showLikers===p.id&&<div style={{marginTop:8,background:"#fff",borderRadius:12,border:`1px solid ${T.sandDark}`,padding:10,boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,fontWeight:700,color:T.text}}>Aimé par {p.likedBy.length} personne{p.likedBy.length>1?"s":""}</span>
                  <button onClick={()=>setShowLikers(null)} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:T.textMuted}}>×</button>
                </div>
                {p.likedBy.map((n,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderTop:i>0?`1px solid ${T.sand}`:"none"}}>
                    <Av name={n} size={24}/><span style={{fontSize:12,color:T.text}}>{n}</span>
                  </div>
                ))}
              </div>}
            </Card>
          )})}

          {/* Compose FAB removed — compose bar at top + Signaler+ FAB replaces */}

          {/* Composer */}
          {showComposer&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={()=>{setShowComposer(false);setReforms(null);setSelReform(null)}}>
            <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 18px 28px",maxHeight:"78vh",overflowY:"auto"}}>
              <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 14px"}}/>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 10px"}}>Nouveau message</h3>
              <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Écrivez librement, l'IA vous aidera à reformuler..." rows={3} style={{width:"100%",border:`2px solid ${T.sandDark}`,borderRadius:12,padding:12,fontSize:13,fontFamily:SANS,resize:"none",outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
              <Btn full disabled={reforming||!draft.trim()} onClick={handleReformulate} style={{marginTop:8,background:reforming?T.sandDark:`linear-gradient(135deg,${T.sky},${T.forest})`}} small>{reforming?"✨ Analyse en cours...":"✨ Reformuler avec l'IA"}</Btn>
              {reforms&&<div style={{marginTop:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <div style={{width:20,height:20,borderRadius:6,background:`${T.sky}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>🤖</div>
                  <span style={{fontSize:12,fontWeight:700,color:T.sky}}>3 reformulations proposées</span>
                </div>
                {Object.entries(reforms).map(([style,data])=>(
                  <button key={style} onClick={()=>setSelReform(style)} style={{width:"100%",padding:14,borderRadius:14,textAlign:"left",border:selReform===style?`2.5px solid ${T.forest}`:`1.5px solid ${T.sandDark}`,background:selReform===style?`${T.leafLight}15`:"#fff",cursor:"pointer",fontFamily:SANS,marginBottom:8,transition:"all 0.2s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                      <span style={{fontSize:16}}>{data.emoji}</span>
                      <span style={{fontSize:13,fontWeight:700,color:selReform===style?T.forest:T.text,textTransform:"capitalize"}}>{style}</span>
                      {selReform===style&&<span style={{marginLeft:"auto",color:T.forest,fontSize:14}}>✓</span>}
                    </div>
                    <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>{data.text}</div>
                    {data.ref&&<div style={{marginTop:6,fontSize:10,color:T.sky,fontWeight:600,background:`${T.sky}10`,padding:"3px 8px",borderRadius:6,display:"inline-block"}}>{data.ref}</div>}
                  </button>
                ))}
              </div>}
              {(selReform||draft.trim())&&<Btn full onClick={handlePublish} style={{marginTop:10}}>{selReform?`Publier version ${selReform}`:"Publier l'original"}</Btn>}
            </div>
          </div>}
        </div>}

        {/* ═══ MESSAGES TAB ═══ */}
        {/* ═══ AGENDA TAB (standalone) ═══ */}
        {tab==="agenda"&&<div style={{padding:14}}>
          <h3 style={{fontFamily:FONT,fontSize:18,color:T.forest,margin:"0 0 14px"}}>📅 Agenda de la copropriété</h3>
          {EVENTS.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(e=>(
            <Card key={e.id} style={{borderLeft:`4px solid ${EC[e.type]}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                <div><h4 style={{margin:"0 0 3px",fontSize:14,color:T.text}}>{e.title}</h4>
                  <p style={{margin:0,fontSize:12,color:T.textMuted}}>{new Date(e.date).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}{e.time&&` · ${e.time}`}</p>
                </div>
                <span style={{padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:`${EC[e.type]}18`,color:EC[e.type]}}>{EL[e.type]}</span>
              </div>
              {e.desc&&<p style={{fontSize:12,color:T.textLight,lineHeight:1.5,marginTop:6,marginBottom:0}}>{e.desc}</p>}
              {e.loc&&<p style={{fontSize:11,color:T.textMuted,marginTop:4,marginBottom:0}}>📍 {e.loc}</p>}
            </Card>
          ))}
        </div>}

        {/* ═══ CONSEIL AI TAB ═══ */}
        {tab==="ai"&&<div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            {aiMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
                <div style={{maxWidth:"85%",padding:"11px 14px",borderRadius:14,background:m.role==="user"?`linear-gradient(135deg,${T.forest},${T.forestLight})`:"#fff",color:m.role==="user"?"#fff":T.text,fontSize:13,lineHeight:1.6,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",whiteSpace:"pre-wrap"}}>{m.text}</div>
              </div>
            ))}
            {aiLoading&&<Dots/>}
            {aiMsgs.length===1&&<div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:8}}>
              {["Mon voisin fait du bruit le dimanche","Règles pour les animaux ?","Comment contester une charge ?","Puis-je installer une clim sur mon balcon ?"].map((q,i)=>(
                <button key={i} onClick={()=>setAiQuery(q)} style={{padding:"8px 12px",borderRadius:10,border:`1px solid ${T.sandDark}`,background:"#fff",fontSize:12,color:T.text,cursor:"pointer",fontFamily:SANS}}>{q}</button>
              ))}
            </div>}
          </div>
          <div style={{padding:"10px 14px",background:T.warmWhite,borderTop:`1px solid ${T.sandDark}`,display:"flex",gap:8}}>
            <input value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAISend()} placeholder="Posez votre question juridique..." style={{flex:1,padding:"10px 14px",borderRadius:12,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff"}}/>
            <button onClick={handleAISend} disabled={!aiQuery.trim()} style={{width:42,height:42,borderRadius:12,border:"none",background:aiQuery.trim()?`linear-gradient(135deg,${T.forest},${T.forestLight})`:T.sandDark,color:"#fff",fontSize:16,cursor:aiQuery.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
          </div>
        </div>}

        {/* ═══ COPRO TAB (Docs + Messages + Sujets) ═══ */}
        {tab==="copro"&&<div style={{padding:14}}>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{id:"docs",l:"📁 Docs"},{id:"msg",l:"✉️ Messages"},{id:"sujets",l:"📋 Sujets"}].map(t=>(
              <button key={t.id} onClick={()=>{setAgendaTab(t.id);if(t.id==="sujets"){setSujetId(null)}}} style={{padding:"8px 14px",borderRadius:10,border:"none",background:agendaTab===t.id?T.forest:"#fff",color:agendaTab===t.id?"#fff":T.text,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS,flex:1,textAlign:"center"}}>{t.l}</button>
            ))}
          </div>

          {/* Unverified copro banner */}
          {role==="proprio"&&!verifiedProprio&&(
            <div onClick={()=>setShowVerifyGate("proprio")} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:`${T.sunriseLight}18`,borderRadius:12,marginBottom:12,cursor:"pointer",border:`1.5px solid ${T.sunriseLight}44`}}>
              <span style={{fontSize:16}}>🔒</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.bark}}>Accès limité</div><div style={{fontSize:10,color:T.textMuted}}>Vérifiez votre statut pour accéder aux documents financiers et votes</div></div>
              <span style={{fontSize:10,fontWeight:600,color:T.sunrise}}>Vérifier →</span>
            </div>
          )}

          {agendaTab==="docs"&&<div>
            <div style={{background:"#fff",borderRadius:12,padding:"3px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
              <span>🔍</span><input value={docSearch} onChange={e=>setDocSearch(e.target.value)} placeholder="Rechercher..." style={{flex:1,border:"none",outline:"none",padding:"10px 0",fontSize:13,fontFamily:SANS,background:"transparent"}}/>
            </div>
            {["reglement","ag","finances","travaux","contrats"].map(cat=>{
              const d=DOCS.filter(d=>d.cat===cat&&(!docSearch||d.name.toLowerCase().includes(docSearch.toLowerCase())));
              if(!d.length)return null;
              const labels={reglement:"📜 Règlement",ag:"🏛 AG",finances:"💰 Finances",travaux:"🔧 Travaux",contrats:"📄 Contrats"};
              const isLocked = cat==="finances" && role==="proprio" && !verifiedProprio;
              return <div key={cat} style={{marginBottom:16,position:"relative"}}>
                <h4 style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>{labels[cat]}</h4>
                {isLocked&&<div onClick={()=>setShowVerifyGate("proprio")} style={{position:"relative",borderRadius:12,overflow:"hidden",cursor:"pointer"}}>
                  <div style={{filter:"blur(4px)",opacity:0.5,pointerEvents:"none"}}>
                    {d.map((doc,i)=>(
                      <div key={i} style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:8,background:"#eee"}}/>
                        <div><div style={{fontSize:13,color:T.textMuted}}>Document verrouillé</div></div>
                      </div>
                    ))}
                  </div>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{background:"#fff",borderRadius:14,padding:"14px 20px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:20}}>🔒</span>
                      <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>Vérification requise</div><div style={{fontSize:11,color:T.forestLight}}>Cliquez pour vérifier votre statut</div></div>
                    </div>
                  </div>
                </div>}
                {!isLocked&&d.map((doc,i)=>(
                  <div key={i} style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
                    <div style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:doc.type==="pdf"?"#FEE2E2":"#E0F2FE",fontSize:12,fontWeight:700,color:doc.type==="pdf"?"#DC2626":"#0284C7"}}>{doc.type.toUpperCase()}</div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:T.text,display:"flex",alignItems:"center",gap:4}}>{doc.name}{doc.isNew&&<span style={{padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700,background:T.coral,color:"#fff"}}>NEW</span>}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>{new Date(doc.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
                    </div>
                    <button style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:T.forestLight}}>⬇</button>
                  </div>
                ))}
              </div>;
            })}
            {(role==="locataire"||role==="concierge")&&<div style={{background:`${T.sunriseLight}33`,borderRadius:12,padding:14,marginTop:8}}><p style={{fontSize:12,color:T.bark,margin:0}}>🔒 En tant que {role==="concierge"?"concierge":"locataire"}, certains documents financiers ne sont pas accessibles.</p></div>}
          </div>}

          {/* Messages inside Copro */}
          {agendaTab==="msg"&&<div>
            {msgView==="list"?<div>
              {/* Mediation card */}
              <div onClick={()=>setTab("mediation")} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:`linear-gradient(135deg,${T.purple}10,${T.sky}10)`,borderRadius:14,marginBottom:12,cursor:"pointer",border:`1px solid ${T.purple}22`}}>
                <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.purple}20,${T.sky}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🕊</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.purple}}>Médiation entre voisins</div><div style={{fontSize:10,color:T.textMuted}}>Résoudre un différend avec l'AI</div></div>
                <span style={{fontSize:12,color:T.purple}}>→</span>
              </div>
              {/* New message */}
              <button onClick={()=>setMsgView("newmsg")} style={{width:"100%",padding:"10px 12px",background:`${T.forest}06`,borderRadius:14,border:`1.5px dashed ${T.forestLight}44`,marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:SANS,textAlign:"left"}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${T.forest}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✏️</div>
                <div><div style={{fontSize:13,fontWeight:600,color:T.forest}}>Nouveau message</div><div style={{fontSize:10,color:T.textMuted}}>{role==="locataire"?"Écrire à un voisin":"Écrire à un voisin ou au syndic"}</div></div>
              </button>
              {convos.filter(c=>!(role==="locataire"&&c.role==="syndic")).map(c=>(
                <button key={c.id} onClick={()=>{setActiveConv(c);setMsgView("conv")}} style={{width:"100%",padding:"10px 12px",background:"#fff",borderRadius:14,border:"none",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:SANS,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",textAlign:"left"}}>
                  <Av name={c.name} size={36}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>{c.name}</span><span style={{fontSize:10,color:T.textMuted}}>{c.time}</span></div>
                    <p style={{fontSize:11,color:T.textMuted,margin:"1px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg}</p>
                  </div>
                  {c.unread>0&&<div style={{width:18,height:18,borderRadius:9,background:T.coral,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{c.unread}</div>}
                </button>
              ))}
            </div>:
            msgView==="newmsg"?<div>
              <button onClick={()=>setMsgView("list")} style={{background:"none",border:"none",fontSize:13,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:4}}>← Retour</button>
              <h3 style={{fontFamily:FONT,fontSize:16,color:T.forest,margin:"0 0 4px"}}>Nouveau message</h3>
              <p style={{fontSize:11,color:T.textMuted,margin:"0 0 10px"}}>Choisissez un destinataire</p>
              {[
                {name:"Marie D.",floor:"3B",role:"CS"},
                {name:"Thomas R.",floor:"1A",role:"proprio"},
                {name:"Sophie L.",floor:"4C",role:"locataire"},
                {name:"Anna K.",floor:"5A",role:"proprio"},
                {name:"Paul V.",floor:"1C",role:"proprio"},
                ...(role!=="locataire"?[{name:"Syndic Urbania",floor:"",role:"syndic"}]:[]),
              ].map((dest,i)=>(
                <button key={i} onClick={()=>{setActiveConv({id:Date.now(),name:dest.name,floor:dest.floor});setConvMsgs([]);setMsgView("conv")}} style={{width:"100%",padding:"8px 12px",background:"#fff",borderRadius:12,border:"none",marginBottom:5,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:SANS,boxShadow:"0 1px 3px rgba(0,0,0,0.03)",textAlign:"left"}}>
                  <Av name={dest.name} size={32}/>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.text}}>{dest.name}</div>{dest.floor&&<div style={{fontSize:9,color:T.textMuted}}>App. {dest.floor}</div>}</div>
                  {dest.role==="syndic"&&<span style={{padding:"2px 5px",borderRadius:3,fontSize:8,fontWeight:700,background:T.coral,color:"#fff"}}>SYNDIC</span>}
                  {dest.role==="CS"&&<span style={{padding:"2px 5px",borderRadius:3,fontSize:8,fontWeight:700,background:T.sky,color:"#fff"}}>CS</span>}
                </button>
              ))}
              {role==="locataire"&&<div style={{background:`${T.sunriseLight}22`,borderRadius:10,padding:10,marginTop:6}}><p style={{fontSize:11,color:T.bark,margin:0}}>ℹ️ En tant que locataire, les messages au syndic ne sont pas disponibles.</p></div>}
            </div>:
            <div style={{display:"flex",flexDirection:"column",minHeight:300}}>
              <div style={{padding:"10px 12px",background:"#fff",borderBottom:`1px solid ${T.sandDark}`,display:"flex",alignItems:"center",gap:8,borderRadius:"12px 12px 0 0"}}>
                <button onClick={()=>setMsgView("list")} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:T.forest}}>←</button>
                <Av name={activeConv?.name||""} size={28}/>
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{activeConv?.name}</div></div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:10,minHeight:200,background:"#fff"}}>
                {convMsgs.length===0&&<div style={{textAlign:"center",padding:30}}><div style={{fontSize:28,marginBottom:6}}>💬</div><p style={{fontSize:12,color:T.textMuted}}>Premier message à {activeConv?.name}</p></div>}
                {convMsgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start",marginBottom:8}}>
                    <div style={{maxWidth:"80%",padding:"8px 12px",borderRadius:12,background:m.from==="me"?`linear-gradient(135deg,${T.forest},${T.forestLight})`:"#f5f5f5",color:m.from==="me"?"#fff":T.text,fontSize:12,lineHeight:1.5}}>
                      {m.text}<div style={{fontSize:8,marginTop:3,opacity:0.6,textAlign:"right"}}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{padding:"8px 10px",background:T.warmWhite,borderTop:`1px solid ${T.sandDark}`,display:"flex",gap:6,borderRadius:"0 0 12px 12px"}}>
                <input value={msgDraft} onChange={e=>setMsgDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&msgDraft.trim()){setConvMsgs(p=>[...p,{from:"me",text:msgDraft,time:"Maint."}]);setMsgDraft("")}}} placeholder="Message..." style={{flex:1,padding:"8px 12px",borderRadius:10,border:`1.5px solid ${T.sandDark}`,fontSize:12,fontFamily:SANS,outline:"none",background:"#fff"}}/>
                <button onClick={()=>{if(msgDraft.trim()){setConvMsgs(p=>[...p,{from:"me",text:msgDraft,time:"Maint."}]);setMsgDraft("")}}} style={{width:36,height:36,borderRadius:10,border:"none",background:msgDraft.trim()?T.forest:T.sandDark,color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
              </div>
            </div>}
          </div>}

          {/* ═══ SUJETS SUB-TAB ═══ */}
          {agendaTab==="sujets"&&<div>
            {/* WhatsApp import banner */}
            <div onClick={()=>{setShowWaImport(true);setWaStep(0);setWaResult(null)}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"linear-gradient(135deg,#25D36612,#25D36606)",borderRadius:14,marginBottom:10,cursor:"pointer",border:"1.5px solid #25D36630"}}>
              <div style={{width:32,height:32,borderRadius:8,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💬</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#128C7E"}}>Importer un groupe WhatsApp</div><div style={{fontSize:10,color:T.textMuted}}>Détecte automatiquement les sujets récurrents</div></div>
              <span style={{fontSize:11,color:"#128C7E",fontWeight:600}}>→</span>
            </div>
            {/* Stats */}
            <div style={{display:"flex",gap:5,marginBottom:8}}>
              {[{v:sujetStats.total,l:"Total",c:T.text},{v:sujetStats.escalade,l:"Escalade",c:T.amber},{v:sujetStats.nonResolu,l:"Non résolus",c:T.coral},{v:sujetStats.resolu,l:"Résolus",c:T.green}].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center",padding:"6px 2px",background:"#fff",borderRadius:10,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:8,color:T.textMuted,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Filters */}
            <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:3,marginBottom:8}}>
              {[{id:"all",l:"Tous"},...Object.entries(SUJET_STATUS).map(([id,v])=>({id,l:v.label}))].map(f=>(
                <button key={f.id} onClick={()=>setSujetFilter(f.id)} style={{padding:"4px 9px",borderRadius:16,border:"none",whiteSpace:"nowrap",background:sujetFilter===f.id?T.forest:"#fff",color:sujetFilter===f.id?"#fff":T.textLight,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:SANS,boxShadow:sujetFilter===f.id?"none":"0 1px 3px rgba(0,0,0,0.06)"}}>{f.l}</button>
              ))}
            </div>

            {/* ── DETAIL VIEW ── */}
            {sujetId&&sujetDetail?<div>
              <button onClick={()=>{setSujetId(null);setSujetAiIdx(null);setSujetAiResult(null);setConsultVote(null)}} style={{background:"none",border:"none",fontSize:12,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600,marginBottom:8,display:"flex",alignItems:"center",gap:3}}>← Retour</button>
              {(()=>{const st=SUJET_STATUS[sujetDetail.status];const cat=SUJET_CAT[sujetDetail.category];return(<div>
                <Card style={{borderLeft:`4px solid ${st.color}`,padding:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
                    <span style={{fontSize:13}}>{cat.icon}</span>
                    <span style={{fontSize:9,fontWeight:700,color:cat.color,textTransform:"uppercase"}}>{cat.label}</span>
                    <div style={{flex:1}}/>
                    <span style={{padding:"2px 8px",borderRadius:16,fontSize:9,fontWeight:700,background:st.bg,color:st.color,display:"flex",alignItems:"center",gap:2}}>{st.icon} {st.label}</span>
                  </div>
                  <h3 style={{margin:"0 0 4px",fontSize:15,fontWeight:700,color:T.text,fontFamily:FONT}}>{sujetDetail.title}</h3>
                  <p style={{fontSize:11,color:T.textLight,lineHeight:1.4,margin:"0 0 8px"}}>{sujetDetail.desc}</p>
                  <div style={{display:"flex",gap:6}}>
                    {[{v:sujetDetail.signalCount,l:"Signalements",i:"📢",c:sujetDetail.signalCount>=sujetDetail.threshold?T.red:T.sky},{v:sujetDetail.residents.length,l:"Résidents",i:"👥",c:T.forest},{v:Math.ceil((new Date()-new Date(sujetDetail.createdAt))/(86400000)),l:"Jours",i:"📅",c:T.bark}].map((m,i)=>(
                      <div key={i} style={{flex:1,background:T.sand,borderRadius:8,padding:"6px 2px",textAlign:"center"}}><span style={{fontSize:11}}>{m.i}</span><div style={{fontSize:15,fontWeight:700,color:m.c}}>{m.v}</div><div style={{fontSize:7,color:T.textMuted,fontWeight:600}}>{m.l}</div></div>
                    ))}
                  </div>
                </Card>
                {/* Consultation */}
                {sujetDetail.consultation&&<Card style={{border:`2px solid ${T.purple}30`,background:`${T.purple}06`,padding:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:16}}>🗳</span><div><h4 style={{margin:0,fontSize:12,fontWeight:700,color:T.purple}}>Consultation en cours</h4><p style={{margin:0,fontSize:9,color:T.textMuted}}>Jusqu'au {sujetDetail.consultation.deadline}</p></div></div>
                  <p style={{fontSize:12,fontWeight:600,color:T.text,margin:"0 0 8px"}}>« {sujetDetail.consultation.question} »</p>
                  {sujetDetail.consultation.cost&&<p style={{fontSize:10,color:T.bark,margin:"0 0 8px",background:`${T.sunriseLight}33`,padding:"4px 6px",borderRadius:4}}>💰 {sujetDetail.consultation.cost}</p>}
                  {[{l:"Pour",c:sujetDetail.consultation.votes.oui,color:T.green},{l:"Contre",c:sujetDetail.consultation.votes.non,color:T.coral},{l:"Abstention",c:sujetDetail.consultation.votes.abstention,color:T.textMuted}].map((v,i)=>(
                    <div key={i} style={{marginBottom:4}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:1}}><span style={{fontWeight:600,color:v.color}}>{v.l}</span><span style={{color:T.textMuted}}>{v.c}/{sujetDetail.consultation.total}</span></div><div style={{height:5,borderRadius:3,background:T.sand}}><div style={{height:"100%",borderRadius:3,width:`${(v.c/sujetDetail.consultation.total)*100}%`,background:v.color}}/></div></div>
                  ))}
                  {!consultVote?<div style={{display:"flex",gap:5,marginTop:6}}>{[{l:"Pour",c:T.green,v:"oui"},{l:"Contre",c:T.coral,v:"non"},{l:"Abstention",c:T.textMuted,v:"abs"}].map(b=><button key={b.v} onClick={()=>setConsultVote(b.v)} style={{flex:1,padding:"6px",borderRadius:8,border:`1.5px solid ${b.c}40`,background:`${b.c}08`,color:b.c,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:SANS}}>{b.l}</button>)}</div>
                  :<div style={{padding:"6px 10px",borderRadius:8,background:`${T.green}12`,textAlign:"center",marginTop:6}}><span style={{fontSize:11,fontWeight:600,color:T.green}}>✓ Vote enregistré</span></div>}
                </Card>}
                {/* Resolved */}
                {sujetDetail.status==="resolu"&&<Card style={{background:T.greenLight,border:`1.5px solid ${T.green}30`,padding:12}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20}}>✅</span><div><h4 style={{margin:0,fontSize:12,fontWeight:700,color:T.green}}>Résolu</h4><p style={{margin:0,fontSize:10,color:T.textLight}}>Le {sujetDetail.resolvedAt}</p></div></div></Card>}
                {/* AI Suggestions */}
                {sujetDetail.status!=="resolu"&&sujetDetail.aiSugg.length>0&&<Card style={{border:`1px solid ${T.forestLight}30`,background:`linear-gradient(135deg,${T.forest}04,${T.leafLight}10)`,padding:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><div style={{width:24,height:24,borderRadius:6,background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:12}}>🤖</span></div><h4 style={{margin:0,fontSize:11,fontWeight:700,color:T.forest}}>Actions IA suggérées</h4></div>
                  {sujetDetail.aiSugg.map((sug,i)=>(
                    <div key={i} style={{marginBottom:5}}>
                      <button onClick={()=>{setSujetAiIdx(sujetAiIdx===i?null:i);setSujetAiResult(null)}} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:sujetAiIdx===i?`1.5px solid ${T.forest}`:`1px solid ${T.sandDark}`,background:sujetAiIdx===i?`${T.leafLight}18`:"#fff",cursor:"pointer",textAlign:"left",fontFamily:SANS,display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:12}}>{sug.type==="consultation"?"🗳":sug.type==="lettre"?"✉️":sug.type==="charte"?"📜":"💡"}</span>
                        <span style={{flex:1,fontSize:10,fontWeight:500,color:T.text,lineHeight:1.3}}>{sug.text}</span>
                        <span style={{fontSize:10,color:T.forestLight}}>{sujetAiIdx===i?"▲":"▼"}</span>
                      </button>
                      {sujetAiIdx===i&&<div style={{padding:10,background:"#fff",borderRadius:"0 0 8px 8px",borderTop:`1px solid ${T.sand}`}}>
                        {sug.type==="consultation"?<div>
                          <p style={{fontSize:10,color:T.textLight,margin:"0 0 6px"}}>Consultation de 14 jours.</p>
                          {sug.cost&&<p style={{fontSize:10,color:T.bark,margin:"0 0 6px"}}>💰 {sug.cost}</p>}
                          <Btn full small onClick={()=>launchConsult(sujetDetail.id,sug)} style={{background:`linear-gradient(135deg,${T.purple},${T.sky})`}}>🗳 Lancer</Btn>
                        </div>:<div>
                          <p style={{fontSize:10,color:T.textLight,margin:"0 0 6px"}}>{sug.type==="lettre"?"Courrier professionnel avec obligations légales.":sug.type==="charte"?"Article de Charte de Vie Commune.":"Plan d'action structuré."}</p>
                          <Btn full small disabled={sujetAiLoading} onClick={()=>genSujetAi(sujetDetail,sug)}>{sujetAiLoading?"Génération...":"✨ Générer"}</Btn>
                          {sujetAiResult&&<div style={{marginTop:6,padding:10,background:`${T.leafLight}12`,borderRadius:8,border:`1px solid ${T.leafLight}44`}}>
                            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}><span style={{fontSize:10}}>📄</span><span style={{fontSize:10,fontWeight:700,color:T.forest}}>Document généré</span></div>
                            <pre style={{fontSize:9,color:T.text,lineHeight:1.4,margin:0,whiteSpace:"pre-wrap",fontFamily:SANS}}>{sujetAiResult}</pre>
                            <div style={{display:"flex",gap:4,marginTop:6}}>
                              <button style={{flex:1,padding:"5px",borderRadius:6,border:`1px solid ${T.forest}`,background:"transparent",color:T.forest,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>📋 Copier</button>
                              <button style={{flex:1,padding:"5px",borderRadius:6,border:"none",background:T.forest,color:"#fff",fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>📤 Partager</button>
                            </div>
                          </div>}
                        </div>}
                      </div>}
                    </div>
                  ))}
                </Card>}
                {/* Timeline */}
                <h4 style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"10px 0 6px"}}>Historique</h4>
                <div style={{position:"relative",paddingLeft:16}}>
                  <div style={{position:"absolute",left:5,top:4,bottom:4,width:2,background:T.sandDark,borderRadius:1}}/>
                  {sujetDetail.timeline.map((ev,i)=>{const tc={signal:{c:T.sky,i:"📢"},escalade:{c:T.amber,i:"⚡"},action:{c:T.forest,i:"⚙️"},consultation:{c:T.purple,i:"🗳"},resolu:{c:T.green,i:"✅"},info:{c:T.bark,i:"💬"}}[ev.type]||{c:T.textMuted,i:"•"};return(
                    <div key={i} style={{position:"relative",marginBottom:8,paddingLeft:10}}>
                      <div style={{position:"absolute",left:-12,top:4,width:10,height:10,borderRadius:"50%",background:`${tc.c}18`,border:`2px solid ${tc.c}`,zIndex:1}}/>
                      <div style={{background:"#fff",borderRadius:10,padding:"6px 10px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,fontWeight:600,color:tc.c}}>{tc.i} {ev.author}</span><span style={{fontSize:8,color:T.textMuted}}>{ev.date}</span></div>
                        <p style={{fontSize:10,color:T.text,lineHeight:1.3,margin:0}}>{ev.text}</p>
                      </div>
                    </div>)})}
                </div>
                {/* Add signal */}
                {sujetDetail.status!=="resolu"&&<Card style={{marginTop:4,padding:10}}>
                  <h4 style={{margin:"0 0 4px",fontSize:11,fontWeight:600,color:T.text}}>Ajouter un signalement</h4>
                  <textarea value={sigText} onChange={e=>setSigText(e.target.value)} placeholder="Décrivez ce que vous avez constaté..." rows={2} style={{width:"100%",border:`1.5px solid ${T.sandDark}`,borderRadius:8,padding:7,fontSize:11,fontFamily:SANS,resize:"none",outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
                  <Btn full small disabled={!sigText.trim()} onClick={()=>addSignal(sujetDetail.id)} style={{marginTop:4}}>📢 Signaler</Btn>
                </Card>}
              </div>)})()}
            </div>:

            /* ── LIST VIEW ── */
            <div>
              {filteredSujets.length===0&&<div style={{textAlign:"center",padding:20}}><div style={{fontSize:36,marginBottom:4}}>📋</div><p style={{fontSize:12,color:T.textMuted}}>Aucun sujet</p></div>}
              {filteredSujets.map(s=>{const st=SUJET_STATUS[s.status];const cat=SUJET_CAT[s.category];return(
                <div key={s.id} onClick={()=>{setSujetId(s.id);setSujetAiIdx(null);setSujetAiResult(null);setConsultVote(null)}} style={{background:"#fff",borderRadius:14,padding:12,marginBottom:7,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",cursor:"pointer",borderLeft:`3px solid ${st.color}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                    <span style={{fontSize:11}}>{cat.icon}</span><span style={{fontSize:8,fontWeight:700,color:cat.color,textTransform:"uppercase"}}>{cat.label}</span>
                    <div style={{flex:1}}/><span style={{padding:"2px 7px",borderRadius:12,fontSize:8,fontWeight:700,background:st.bg,color:st.color,display:"flex",alignItems:"center",gap:2}}>{st.icon} {st.label}</span>
                  </div>
                  <h4 style={{margin:"0 0 3px",fontSize:12,fontWeight:600,color:T.text}}>{s.title}</h4>
                  <p style={{fontSize:10,color:T.textLight,lineHeight:1.3,margin:"0 0 6px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.desc}</p>
                  <div style={{display:"flex",alignItems:"center",gap:8,fontSize:9,color:T.textMuted}}><span>📢 {s.signalCount}</span><span>👥 {s.residents.length}</span><div style={{flex:1}}/><span>{s.status==="resolu"?`Résolu ${s.resolvedAt}`:s.lastSignal}</span></div>
                  {s.status!=="resolu"&&<div style={{marginTop:4}}><div style={{height:3,borderRadius:2,background:T.sand}}><div style={{height:"100%",borderRadius:2,width:`${Math.min(100,(s.signalCount/s.threshold)*100)}%`,background:s.signalCount>=s.threshold?`linear-gradient(90deg,${T.amber},${T.red})`:`linear-gradient(90deg,${T.sky},${T.forestLight})`}}/></div><div style={{fontSize:7,color:T.textMuted,marginTop:1}}>{s.signalCount>=s.threshold?"Seuil dépassé":`${s.signalCount}/${s.threshold}`}</div></div>}
                </div>)})}
              <button onClick={()=>setShowNewSujet(true)} style={{width:"100%",padding:10,borderRadius:12,border:`2px dashed ${T.sandDark}`,background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,fontWeight:600,color:T.forestLight,marginTop:3}}>+ Signaler un sujet</button>
            </div>}
          </div>}
        </div>}

        {/* ═══ MEDIATION (inside messages) ═══ */}
        {tab==="mediation"&&<div style={{padding:14}}>
          <button onClick={()=>{setAgendaTab("msg");setTab("copro")}} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>← Retour aux messages</button>

          {medStep===0&&<div>
            <Card style={{textAlign:"center",padding:28}}>
              <div style={{fontSize:48,marginBottom:12}}>🕊</div>
              <h2 style={{fontFamily:FONT,fontSize:22,color:T.forest,margin:"0 0 8px"}}>Médiation assistée par AI</h2>
              <p style={{fontSize:14,color:T.textLight,lineHeight:1.6,margin:"0 0 20px"}}>Décrivez votre différend. L'AI vous aidera à formuler une demande respectueuse et à trouver un compromis.</p>
              <p style={{fontSize:11,color:T.textMuted,margin:"0 0 20px"}}>L'AI est neutre, confidentielle, et ne prend jamais parti. Ce n'est pas une médiation juridique — c'est une aide à la désescalade.</p>
              <Btn full onClick={()=>setMedStep(1)}>Commencer une médiation</Btn>
            </Card>
          </div>}

          {medStep===1&&<div>
            <Card>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 4px"}}>Étape 1 — Décrivez la situation</h3>
              <p style={{fontSize:12,color:T.textMuted,margin:"0 0 12px"}}>Exprimez-vous librement. L'AI reformulera de manière neutre.</p>
              <textarea value={medDesc} onChange={e=>setMedDesc(e.target.value)} placeholder="Mon voisin du 3ème fait du bruit tous les soirs après 22h..." rows={5} style={{width:"100%",border:`2px solid ${T.sandDark}`,borderRadius:12,padding:12,fontSize:13,fontFamily:SANS,resize:"none",outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
              <Btn full disabled={reforming||!medDesc.trim()} onClick={handleMedReform} style={{marginTop:10}}>{reforming?"Analyse en cours...":"🕊 Analyser et reformuler"}</Btn>
            </Card>
          </div>}

          {medStep===2&&medReform&&<div>
            <Card>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 4px"}}>Étape 2 — Reformulation neutre</h3>
              <p style={{fontSize:12,color:T.textMuted,margin:"0 0 10px"}}>Voici comment l'AI perçoit la situation de manière factuelle :</p>
              <div style={{background:`${T.leafLight}18`,borderRadius:12,padding:14,marginBottom:14}}>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>{medReform.resume_neutre}</p>
              </div>

              <h4 style={{fontSize:14,fontWeight:600,color:T.text,margin:"0 0 6px"}}>Message proposé au voisin :</h4>
              <div style={{background:"#fff",borderRadius:12,padding:14,border:`1px solid ${T.sandDark}`,marginBottom:14}}>
                <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:0}}>{medReform.message_propose}</p>
              </div>

              <h4 style={{fontSize:14,fontWeight:600,color:T.text,margin:"0 0 6px"}}>Pistes de compromis :</h4>
              {medReform.compromis.map((c,i)=>(
                <div key={i} style={{background:`${T.sunriseLight}22`,borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>💡</span><span style={{fontSize:13,color:T.text}}>{c}</span>
                </div>
              ))}

              <div style={{display:"flex",gap:8,marginTop:16}}>
                <Btn full onClick={()=>{setMedStep(0);setMedDesc("");setMedReform(null)}}>Envoyer au voisin</Btn>
                <Btn full primary={false} onClick={()=>setMedStep(1)}>Modifier</Btn>
              </div>
            </Card>
          </div>}
        </div>}

      </div>

      {/* ─── BOTTOM TAB BAR ─── */}
      {tab!=="mediation"&&<div style={{background:"rgba(253,251,247,0.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.sandDark}`,padding:"6px 4px calc(10px + env(safe-area-inset-bottom, 8px))",display:"flex",justifyContent:"space-around",flexShrink:0,zIndex:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 8px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
            <span style={{fontSize:22}}>{t.icon}</span>
            <span style={{fontSize:10,fontWeight:700,fontFamily:SANS,color:tab===t.id?t.color:T.textMuted}}>{t.label}</span>
            {tab===t.id&&<div style={{position:"absolute",bottom:2,left:"50%",transform:"translateX(-50%)",width:22,height:3,borderRadius:2,background:t.color}}/>}
          </button>
        ))}
      </div>}

      {showInvite&&<InviteKit copro={copro||{label:"Ma copropriété"}} userName={userName} onClose={()=>setShowInvite(false)}/>}

      {/* ═══ NEW SUJET MODAL ═══ */}
      {showNewSujet&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={()=>setShowNewSujet(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 18px 28px",maxHeight:"80vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 16px"}}/>
          <h3 style={{fontFamily:FONT,fontSize:19,color:T.forest,margin:"0 0 4px"}}>Nouveau sujet</h3>
          <p style={{fontSize:12,color:T.textMuted,margin:"0 0 14px"}}>Signalez un problème récurrent</p>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Catégorie</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
              {Object.entries(SUJET_CAT).map(([id,c])=>(
                <button key={id} onClick={()=>setNewSujetD(p=>({...p,category:id}))} style={{padding:"5px 9px",borderRadius:16,border:newSujetD.category===id?`2px solid ${c.color}`:`1px solid ${T.sandDark}`,background:newSujetD.category===id?`${c.color}12`:"#fff",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:SANS,color:newSujetD.category===id?c.color:T.textLight,display:"flex",alignItems:"center",gap:3}}>{c.icon} {c.label}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <label style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Titre</label>
            <input value={newSujetD.title} onChange={e=>setNewSujetD(p=>({...p,title:e.target.value}))} placeholder="Ex: Fuite d'eau au sous-sol" style={{width:"100%",marginTop:4,padding:10,borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1}}>Description</label>
            <textarea value={newSujetD.desc} onChange={e=>setNewSujetD(p=>({...p,desc:e.target.value}))} placeholder="Décrivez le problème..." rows={3} style={{width:"100%",marginTop:4,padding:10,borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:12,fontFamily:SANS,resize:"none",outline:"none",boxSizing:"border-box",background:"#fff"}}/>
          </div>
          <Btn full disabled={!newSujetD.title.trim()} onClick={()=>{setSujets(p=>[{id:Date.now(),title:newSujetD.title,category:newSujetD.category,status:"signale",signalCount:1,threshold:3,createdAt:new Date().toISOString().split("T")[0],lastSignal:new Date().toISOString().split("T")[0],residents:[userName],createdBy:userName,desc:newSujetD.desc||newSujetD.title,timeline:[{date:new Date().toISOString().split("T")[0],type:"signal",author:userName,text:newSujetD.desc||newSujetD.title}],aiSugg:[],consultation:null},...p]);setShowNewSujet(false);setNewSujetD({title:"",category:"securite",desc:""});setAgendaTab("sujets");setTab("copro")}}>📢 Créer le sujet</Btn>
        </div>
      </div>}

      {/* ═══ WHATSAPP IMPORT MODAL ═══ */}
      {showWaImport&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={()=>setShowWaImport(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 18px 28px",maxHeight:"85vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 16px"}}/>
          {waStep===0&&<div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{width:56,height:56,borderRadius:16,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 10px"}}>💬</div>
              <h3 style={{fontFamily:FONT,fontSize:20,color:T.forest,margin:"0 0 4px"}}>Import WhatsApp</h3>
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.5,margin:0}}>Importez l'historique de votre groupe WhatsApp pour détecter automatiquement les sujets récurrents et pré-peupler votre copropriété.</p>
            </div>
            <div style={{background:`${T.leafLight}18`,borderRadius:12,padding:12,marginBottom:14}}>
              <h4 style={{fontSize:12,fontWeight:600,color:T.forest,margin:"0 0 6px"}}>Ce que l'IA va extraire :</h4>
              {["Participants et rôles (propriétaire, locataire, étage)","Sujets récurrents avec fréquence de mention","Leaders communautaires (qui porte la charge)","Épisodes d'entraide entre voisins"].map((t,i)=><p key={i} style={{fontSize:11,color:T.text,margin:"3px 0",lineHeight:1.4}}>▸ {t}</p>)}
            </div>
            <div style={{background:`${T.sunriseLight}22`,borderRadius:12,padding:12,marginBottom:14}}>
              <p style={{fontSize:11,color:T.bark,margin:0,lineHeight:1.5}}>🔒 <strong>Privacy-by-design</strong> — Seuls les insights structurés sont conservés. Les messages originaux ne sont jamais stockés. Chaque résident peut supprimer ses données.</p>
            </div>
            <label style={{display:"block",width:"100%",padding:14,borderRadius:14,border:`2px dashed ${T.forestLight}`,background:`${T.forest}06`,cursor:"pointer",textAlign:"center",fontFamily:SANS}}>
              <input type="file" accept=".txt" onChange={handleWaFile} style={{display:"none"}}/>
              <span style={{fontSize:24,display:"block",marginBottom:4}}>📎</span>
              <span style={{fontSize:13,fontWeight:600,color:T.forest}}>Choisir le fichier .txt</span>
              <span style={{fontSize:11,color:T.textMuted,display:"block",marginTop:2}}>Export WhatsApp → Plus → Exporter la discussion</span>
            </label>
          </div>}
          {waStep===1&&<div style={{textAlign:"center",padding:"30px 0"}}>
            <div style={{width:50,height:50,border:`3px solid ${T.sandDark}`,borderTopColor:"#25D366",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
            <h3 style={{fontFamily:FONT,fontSize:18,color:T.forest,margin:"0 0 6px"}}>Analyse en cours...</h3>
            <p style={{fontSize:12,color:T.textMuted}}>L'IA parcourt vos messages</p>
          </div>}
          {waStep===2&&waResult&&<div>
            <div style={{textAlign:"center",marginBottom:14}}>
              <div style={{fontSize:36,marginBottom:6}}>✨</div>
              <h3 style={{fontFamily:FONT,fontSize:18,color:T.forest,margin:"0 0 4px"}}>Analyse terminée</h3>
              <p style={{fontSize:12,color:T.textLight}}>{waResult.totalMsgs} messages · {waResult.participants.length} participants · {waResult.periodMonths} mois</p>
            </div>
            {/* Participants */}
            <h4 style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>👥 Résidents identifiés</h4>
            <div style={{marginBottom:12}}>
              {waResult.participants.slice(0,6).map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#fff",borderRadius:10,marginBottom:4,boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                  <Av name={p.name} size={28}/>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{p.name}</div><div style={{fontSize:9,color:T.textMuted}}>{p.floor||"—"} · {p.role} · {p.msgCount} msg ({p.pct}%)</div></div>
                  {p.pct>=20&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:8,fontWeight:700,background:`${T.sunrise}18`,color:T.sunrise}}>Leader</span>}
                </div>
              ))}
            </div>
            {/* Themes */}
            {waResult.themes.length>0&&<div>
              <h4 style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>📋 Sujets détectés</h4>
              {waResult.themes.map((t,i)=>{const cat=SUJET_CAT[t.cat];return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#fff",borderRadius:10,marginBottom:4,borderLeft:`3px solid ${cat?.color||T.sky}`,boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                  <span style={{fontSize:14}}>{cat?.icon||"📌"}</span>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:600,color:T.text}}>{t.title}</div><div style={{fontSize:9,color:T.textMuted}}>{t.count} mentions</div></div>
                  {t.count>=3&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:8,fontWeight:700,background:T.amberLight,color:T.amber}}>⚡ Escalade</span>}
                </div>
              )})}
            </div>}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <Btn full onClick={importWaSujets} style={{background:`linear-gradient(135deg,#25D366,${T.forest})`}}>✅ Importer {waResult.themes.length} sujet{waResult.themes.length>1?"s":""}</Btn>
            </div>
            <button onClick={()=>{setShowWaImport(false);setWaStep(0)}} style={{width:"100%",marginTop:8,padding:10,borderRadius:10,border:`1px solid ${T.sandDark}`,background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,color:T.textMuted,textAlign:"center"}}>Fermer sans importer</button>
          </div>}
        </div>
      </div>}

      {/* ═══ SIGNALER+ MODAL ═══ */}
      {showSignaler&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={resetSignaler}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 18px 28px",maxHeight:"88vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 14px"}}/>

          {/* ── Confirmation screens ── */}
          {sigDone?<div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:44,marginBottom:6}}>{sigDone.type==="urgent_called"?"📞":sigDone.type==="urgent_alerted"?"📢":sigDone.type==="added"?"📊":"🆕"}</div>
            <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 4px"}}>{sigDone.type==="urgent_called"?"Contact effectué !":sigDone.type==="urgent_alerted"?"Voisins alertés !":sigDone.type==="added"?"Signalement ajouté !":"Nouveau sujet créé !"}</h3>
            <p style={{fontSize:13,color:T.textLight,lineHeight:1.4,margin:"0 0 4px"}}>{sigDone.title}</p>
            {(sigDone.type==="urgent_called"||sigDone.type==="urgent_alerted")&&<p style={{fontSize:12,color:T.coral,fontWeight:600,margin:"0 0 4px"}}>Publié dans le fil d'activité</p>}
            {sigDone.type==="added"&&<p style={{fontSize:14,fontWeight:700,color:T.amber,margin:"0 0 10px"}}>C'est le {sigDone.count}ème signalement</p>}
            {sigDone.type==="new"&&<p style={{fontSize:11,color:T.textMuted,margin:"0 0 10px"}}>Invitez vos voisins à signaler aussi.</p>}
            <div style={{display:"flex",gap:8}}>
              <Btn full small onClick={()=>{resetSignaler();setAgendaTab("sujets");setTab("copro")}}>📋 Sujets</Btn>
              <Btn full small primary={false} onClick={resetSignaler}>Fermer</Btn>
            </div>
          </div>

          :entDone?<div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:44,marginBottom:6}}>✅</div>
            <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 4px"}}>Demande publiée !</h3>
            <p style={{fontSize:12,color:T.textLight,margin:"0 0 10px"}}>Visible dans le fil. Vos voisins peuvent répondre.</p>
            <div style={{display:"flex",gap:8}}>
              <Btn full small onClick={()=>{resetSignaler();setTab("feed")}}>💬 Voir le fil</Btn>
              <Btn full small primary={false} onClick={resetSignaler}>Fermer</Btn>
            </div>
          </div>

          /* ── Voie selection ── */
          :!sigVoie?<div>
            <h3 style={{fontFamily:FONT,fontSize:20,color:T.forest,margin:"0 0 4px",textAlign:"center"}}>Signaler +</h3>
            <p style={{fontSize:12,color:T.textMuted,margin:"0 0 14px",textAlign:"center"}}>Que souhaitez-vous faire ?</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSigVoie("probleme")} style={{flex:1,padding:18,borderRadius:16,border:`2px solid ${T.coral}30`,background:`${T.coral}06`,cursor:"pointer",textAlign:"center",fontFamily:SANS}}>
                <div style={{fontSize:32,marginBottom:6}}>⚠️</div>
                <div style={{fontSize:13,fontWeight:700,color:T.coral}}>Un problème</div>
                <div style={{fontSize:10,color:T.textMuted,marginTop:2,lineHeight:1.3}}>Urgent ou récurrent</div>
              </button>
              <button onClick={()=>setSigVoie("entraide")} style={{flex:1,padding:18,borderRadius:16,border:`2px solid ${T.sky}30`,background:`${T.sky}06`,cursor:"pointer",textAlign:"center",fontFamily:SANS}}>
                <div style={{fontSize:32,marginBottom:6}}>🤝</div>
                <div style={{fontSize:13,fontWeight:700,color:T.sky}}>De l'aide</div>
                <div style={{fontSize:10,color:T.textMuted,marginTop:2,lineHeight:1.3}}>Demander ou proposer</div>
              </button>
            </div>
          </div>

          /* ── Problème flow ── */
          :sigVoie==="probleme"?<div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <button onClick={()=>{if(sigSitSel){setSigSitSel(null)}else if(sigCatSel){setSigCatSel(null)}else{setSigVoie(null)}}} style={{background:"none",border:"none",fontSize:13,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600}}>←</button>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:0}}>Signaler un problème</h3>
            </div>

            {/* Step 1: Category grid */}
            {!sigCatSel?<div>
              <p style={{fontSize:12,color:T.textMuted,margin:"0 0 8px"}}>Quel type de problème ?</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {SIG_CATS.map(c=>{
                  const hasUrg=c.sits.some(s=>s.urg);
                  return(
                  <button key={c.id} onClick={()=>setSigCatSel(c)} style={{padding:"14px 6px",borderRadius:14,border:"none",background:"#fff",cursor:"pointer",textAlign:"center",fontFamily:SANS,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative",transition:"transform 0.1s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.95)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                    {hasUrg&&<div style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:4,background:T.red}}/>}
                    <span style={{fontSize:24}}>{c.icon}</span>
                    <span style={{fontSize:10,fontWeight:600,color:T.text,lineHeight:1.2}}>{c.label}</span>
                  </button>)
                })}
              </div>
            </div>

            /* Step 2: Situation selection */
            :!sigSitSel?<div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,background:`${SUJET_CAT[sigCatSel.cat]?.color||T.sky}10`,borderRadius:10,padding:"8px 12px"}}>
                <span style={{fontSize:18}}>{sigCatSel.icon}</span>
                <span style={{fontSize:13,fontWeight:600,color:T.text}}>{sigCatSel.label}</span>
              </div>
              <p style={{fontSize:12,color:T.textMuted,margin:"0 0 8px"}}>Que se passe-t-il ?</p>
              {sigCatSel.sits.map(s=>(
                <button key={s.id} onClick={()=>setSigSitSel(s)} style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:"#fff",cursor:"pointer",marginBottom:5,display:"flex",alignItems:"center",gap:10,fontFamily:SANS,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",textAlign:"left"}}>
                  <div style={{width:10,height:10,borderRadius:5,background:s.urg?T.red:T.amber,flexShrink:0}}/>
                  <span style={{flex:1,fontSize:12,fontWeight:500,color:T.text}}>{s.label}</span>
                  {s.urg&&<span style={{padding:"2px 7px",borderRadius:6,fontSize:9,fontWeight:700,background:`${T.red}15`,color:T.red}}>URGENT</span>}
                </button>
              ))}
            </div>

            /* Step 3a: Fiche réflexe (urgent) */
            :sigSitSel.urg?<div>
              <div style={{background:`${T.red}08`,border:`2px solid ${T.red}25`,borderRadius:16,padding:16,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:5,background:T.red}}/>
                  <h4 style={{margin:0,fontSize:14,fontWeight:700,color:T.red}}>{sigSitSel.label}</h4>
                </div>
                {/* Contact */}
                <div style={{background:"#fff",borderRadius:12,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${T.forest}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📞</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{sigSitSel.fiche.contact}</div>
                    <div style={{fontSize:15,fontWeight:700,color:T.forest,marginTop:1}}>{sigSitSel.fiche.tel}</div>
                  </div>
                </div>
                {/* Steps */}
                <div style={{marginBottom:10}}>
                  {sigSitSel.fiche.steps.map((step,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                      <div style={{width:22,height:22,borderRadius:11,background:T.forest,color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                      <p style={{margin:0,fontSize:12,color:T.text,lineHeight:1.4,paddingTop:2}}>{step}</p>
                    </div>
                  ))}
                </div>
                {/* Conditional */}
                {sigSitSel.fiche.cond&&<div style={{background:`${T.amber}12`,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>⚠️</span>
                  <p style={{margin:0,fontSize:11,color:T.bark,fontWeight:600,lineHeight:1.3}}>{sigSitSel.fiche.cond}</p>
                </div>}
              </div>
              {/* Action buttons */}
              <div style={{display:"flex",gap:8}}>
                <Btn full small onClick={()=>handleUrgentAction(sigCatSel,sigSitSel,"called")} style={{background:`linear-gradient(135deg,${T.forest},${T.forestLight})`}}>📞 J'appelle</Btn>
                <Btn full small onClick={()=>handleUrgentAction(sigCatSel,sigSitSel,"alerted")} style={{background:`linear-gradient(135deg,${T.coral},${T.sunrise})`}}>📢 Alerter les voisins</Btn>
              </div>
            </div>

            /* Step 3b: Comment + submit (non-urgent) */
            :<div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,background:`${T.amber}10`,borderRadius:10,padding:"8px 12px"}}>
                <div style={{width:10,height:10,borderRadius:5,background:T.amber}}/>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>{sigCatSel.icon} {sigCatSel.label} — {sigSitSel.label}</span>
              </div>
              <textarea value={sigComment} onChange={e=>setSigComment(e.target.value)} placeholder="Commentaire optionnel (lieu, heure, détail...)" rows={2} style={{width:"100%",border:`1.5px solid ${T.sandDark}`,borderRadius:10,padding:10,fontSize:12,fontFamily:SANS,resize:"none",outline:"none",background:"#fff",color:T.text,boxSizing:"border-box",marginBottom:10}}/>
              <Btn full onClick={submitNonUrgent} style={{background:`linear-gradient(135deg,${T.amber},${T.sunrise})`}}>📢 Signaler</Btn>
            </div>}
          </div>

          /* ── Entraide flow ── */
          :<div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <button onClick={()=>{if(entTplSel){setEntTplSel(null);setEntFields({})}else{setSigVoie(null)}}} style={{background:"none",border:"none",fontSize:13,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600}}>←</button>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:0}}>Demander ou proposer de l'aide</h3>
            </div>
            {!entTplSel?<div>
              <p style={{fontSize:12,color:T.textMuted,margin:"0 0 8px"}}>De quoi avez-vous besoin ?</p>
              {ENTRAIDE_TPL.map(t=>(
                <button key={t.id} onClick={()=>setEntTplSel(t)} style={{width:"100%",padding:"11px 14px",borderRadius:14,border:"none",background:"#fff",cursor:"pointer",marginBottom:5,display:"flex",alignItems:"center",gap:10,fontFamily:SANS,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",textAlign:"left"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:`${T.sky}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{t.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.text}}>{t.label}</div>
                    <div style={{fontSize:10,color:T.textMuted,marginTop:1}}>{t.defaultText}</div>
                  </div>
                  <span style={{fontSize:12,color:T.textMuted}}>→</span>
                </button>
              ))}
            </div>
            :<div>
              <div style={{background:`${T.sky}10`,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:16}}>{entTplSel.icon}</span>
                <span style={{fontSize:12,fontWeight:600,color:T.text}}>{entTplSel.label}</span>
              </div>
              {entTplSel.fields.map(f=>(
                <div key={f} style={{marginBottom:7}}>
                  <label style={{fontSize:10,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5}}>{f}</label>
                  <input value={entFields[f]||""} onChange={e=>setEntFields(p=>({...p,[f]:e.target.value}))} placeholder={f} style={{width:"100%",marginTop:3,padding:9,borderRadius:10,border:`1.5px solid ${T.sandDark}`,fontSize:12,fontFamily:SANS,outline:"none",boxSizing:"border-box",background:"#fff"}}/>
                </div>
              ))}
              <Btn full onClick={submitEntraide} style={{background:`linear-gradient(135deg,${T.sky},${T.forest})`}}>🤝 Publier</Btn>
            </div>}
          </div>}
        </div>
      </div>}

      {/* ═══ PROFILE MODAL ═══ */}
      {showProfile&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={()=>setShowProfile(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 20px 36px",maxHeight:"85vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 18px"}}/>

          {/* Profile header */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{position:"relative"}}>
              <label style={{cursor:"pointer",display:"block"}}>
                {profilePhoto
                  ?<img src={profilePhoto} style={{width:60,height:60,borderRadius:18,objectFit:"cover"}} alt=""/>
                  :<div style={{width:60,height:60,borderRadius:18,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:22,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
                }
                <input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>setProfilePhoto(ev.target.result);r.readAsDataURL(f)}}} style={{display:"none"}}/>
                <div style={{position:"absolute",bottom:-2,right:-2,width:22,height:22,borderRadius:11,background:T.forest,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>📷</div>
              </label>
              {(verifiedProprio||verifiedSyndic)&&<div style={{position:"absolute",top:-2,right:-2,width:18,height:18,borderRadius:9,background:T.forest,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff"}}>✓</div>}
            </div>
            <div style={{flex:1}}>
              <h3 style={{fontFamily:FONT,fontSize:20,color:T.text,margin:"0 0 2px"}}>{userName}</h3>
              <p style={{fontSize:12,color:T.textMuted,margin:0}}>{userEmail}</p>
              <div style={{marginTop:4,display:"flex",gap:5,flexWrap:"wrap"}}>
                <span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:`${T.forest}15`,color:T.forest,display:"flex",alignItems:"center",gap:3}}>
                  {role==="proprio"?"Copropriétaire":role==="locataire"?"Locataire":role==="concierge"?"Concierge":"Syndic"}
                  {((role==="proprio"&&verifiedProprio)||(role==="syndic"&&verifiedSyndic))&&<span style={{fontSize:8}}>✓</span>}
                </span>
                {isCS&&<span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,background:`${T.sky}20`,color:T.sky,display:"flex",alignItems:"center",gap:3}}>CS{verifiedCS&&<span style={{fontSize:8}}>✓</span>}</span>}
                <span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:600,background:T.sand,color:T.bark}}>App. {currentApt}</span>
              </div>
            </div>
          </div>

          {/* Verification status banner */}
          {role==="proprio"&&!verifiedProprio&&(
            <div style={{background:`${T.sunriseLight}22`,borderRadius:12,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🔒</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.bark}}>Statut non vérifié</div><div style={{fontSize:11,color:T.textMuted,marginTop:1}}>Les documents financiers et les votes d'AG nécessitent une vérification.</div></div>
              <button onClick={()=>{setShowProfile(false);setShowVerifyGate("proprio")}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:T.sunrise,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS,flexShrink:0}}>Vérifier</button>
            </div>
          )}
          {role==="syndic"&&!verifiedSyndic&&(
            <div style={{background:`${T.coral}12`,borderRadius:12,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>🏛</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.coral}}>Dashboard en mode démo</div><div style={{fontSize:11,color:T.textMuted,marginTop:1}}>Vérification professionnelle nécessaire pour activer les fonctions syndic.</div></div>
              <button onClick={()=>{setShowProfile(false);setShowVerifyGate("syndic")}} style={{padding:"6px 12px",borderRadius:8,border:"none",background:T.coral,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS,flexShrink:0}}>Vérifier</button>
            </div>
          )}
          {(verifiedProprio||verifiedSyndic)&&(
            <div style={{background:`${T.leafLight}22`,borderRadius:12,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>✅</span>
              <div><div style={{fontSize:13,fontWeight:600,color:T.forest}}>Statut vérifié</div><div style={{fontSize:11,color:T.textMuted,marginTop:1}}>Vous avez accès à toutes les fonctions de votre rôle.</div></div>
            </div>
          )}

          {/* Activity stats */}
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <div style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
              <div style={{fontSize:22,fontWeight:700,color:T.forest}}>{posts.filter(p=>p.author===userName).length}</div>
              <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>Publications</div>
            </div>
            <div style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
              <div style={{fontSize:22,fontWeight:700,color:T.sunrise}}>{3}</div>
              <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>Invitations acceptées</div>
            </div>
            <div style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
              <div style={{fontSize:22,fontWeight:700,color:T.sky}}>{posts.reduce((n,p)=>n+p.replies.filter(r=>r.author===userName).length,0)}</div>
              <div style={{fontSize:10,color:T.textMuted,marginTop:2}}>Réponses</div>
            </div>
          </div>

          {/* Profile fields */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>Nom complet</label>
            <input value={userName} onChange={e=>setUserName(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:14,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
          </div>

          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <div style={{flex:2}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Bâtiment</label>
              <input value={userBuilding} onChange={e=>{setUserBuilding(e.target.value);setUserFloorEdited(false)}} placeholder="A, Mimosa..." style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Étage</label>
              <input type="number" value={userEtage} onChange={e=>{setUserEtage(e.target.value);setUserFloorEdited(false)}} placeholder="3" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div style={{flex:1.5}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Porte</label>
              <input value={userDoor} onChange={e=>{if(e.target.value.length<=8){setUserDoor(e.target.value);setUserFloorEdited(false)}}} placeholder="Gauche" maxLength={8} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Appartement <span style={{fontSize:8,fontWeight:400,textTransform:"none",letterSpacing:0}}>(auto-généré, modifiable)</span></label>
            <input value={currentApt} onChange={e=>{setUserFloor(e.target.value);setUserFloorEdited(true)}} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${userFloorEdited?T.sunrise:T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:userFloorEdited?"#fff":`${T.leafLight}12`,color:T.text,boxSizing:"border-box"}}/>
            {userFloorEdited&&<p style={{fontSize:10,color:T.sunrise,margin:"3px 0 0"}}>✏️ Modifié manuellement</p>}
          </div>

          {/* Multi-logement — compact "add" link */}
          {role!=="syndic"&&<div style={{marginBottom:16}}>
            {extraLogements.length>0&&extraLogements.map((lg,i)=>(
              <div key={i} style={{display:"flex",gap:6,alignItems:"center",padding:"8px 10px",background:"#fff",borderRadius:10,marginBottom:4,border:`1px solid ${T.sandDark}`}}>
                <span style={{fontSize:12}}>🏠</span>
                <span style={{fontSize:12,flex:1,color:T.text}}>{lg}</span>
                <button onClick={()=>setExtraLogements(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",fontSize:14,color:T.textMuted,cursor:"pointer"}}>×</button>
              </div>
            ))}
            <button onClick={()=>{const name=prompt("Nom du logement supplémentaire (ex: 5ème Droite - B)");if(name)setExtraLogements(p=>[...p,name])}} style={{background:"none",border:"none",cursor:"pointer",fontFamily:SANS,fontSize:11,fontWeight:600,color:T.forestLight,padding:"4px 0",display:"flex",alignItems:"center",gap:4}}>+ Ajouter un logement supplémentaire</button>
          </div>}

          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>Email</label>
            <div style={{padding:"10px 14px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:14,fontFamily:SANS,color:T.textMuted,background:T.sand}}>{userEmail}</div>
          </div>

          {/* Lots - copropriétaire only */}
          {role==="proprio"&&<div style={{marginBottom:20}}>
            <label style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>Numéros de lots</label>
            <input value={userLots} onChange={e=>setUserLots(e.target.value)} placeholder="12, 45, 78" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:14,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            <p style={{fontSize:10,color:T.textMuted,margin:"4px 0 0",lineHeight:1.4}}>🔒 Visible uniquement par le syndic — utile pour identifier vos lots dans les échanges officiels.</p>
          </div>}

          {/* Settings toggles */}
          <h4 style={{fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 12px"}}>Préférences</h4>

          {[
            {label:"Notifications push",desc:"Nouveaux messages, voisins, événements",value:userNotifs,set:setUserNotifs,disabled:false},
            {label:"Coach AI à l'écriture",desc:"Toujours actif — non désactivable",value:true,set:()=>{},disabled:true,locked:true},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i===0?`1px solid ${T.sand}`:"none"}}>
              <div style={{opacity:s.disabled?0.7:1}}>
                <div style={{fontSize:14,fontWeight:500,color:T.text,display:"flex",alignItems:"center",gap:5}}>
                  {s.label}
                  {s.locked&&<span style={{fontSize:10}}>🔒</span>}
                </div>
                <div style={{fontSize:11,color:T.textMuted}}>{s.desc}</div>
              </div>
              <div style={{position:"relative"}}>
                <button onClick={()=>!s.disabled&&s.set(!s.value)} style={{width:48,height:28,borderRadius:14,border:"none",background:s.value?(s.disabled?`${T.forest}99`:T.forest):T.sandDark,cursor:s.disabled?"default":"pointer",position:"relative",transition:"background 0.2s"}}>
                  <div style={{width:22,height:22,borderRadius:11,background:"#fff",position:"absolute",top:3,left:s.value?23:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)",opacity:s.disabled?0.8:1}}/>
                </button>
              </div>
            </div>
          ))}

          {/* Role info + change role */}
          <div style={{background:`${T.leafLight}18`,borderRadius:14,padding:14,marginTop:20,marginBottom:8}}>
            <h4 style={{fontSize:13,fontWeight:600,color:T.forest,margin:"0 0 6px"}}>Vos droits d'accès ({role==="proprio"?"copropriétaire":role==="locataire"?"locataire":role==="concierge"?"concierge":"syndic"})</h4>
            {role==="proprio"?
              <p style={{fontSize:12,color:T.textLight,margin:0,lineHeight:1.5}}>Accès complet : documents AG, votes, médiation, conseil juridique copropriété, tous les fils, messagerie, petites annonces.{isCS?" En tant que membre du conseil syndical, vous avez également accès aux outils de suivi CS.":""}{!verifiedProprio?" Les fonctions sensibles (docs financiers, votes) nécessitent une vérification.":""}</p>:
            role==="syndic"?
              <p style={{fontSize:12,color:T.textLight,margin:0,lineHeight:1.5}}>Dashboard de gestion, diffusion officielle, analytics d'engagement, ticketing, gestion des procurations et votes AG.{!verifiedSyndic?" Mode démo actif — vérification professionnelle requise pour activer.":""}</p>:
            role==="concierge"?
              <p style={{fontSize:12,color:T.textLight,margin:0,lineHeight:1.5}}>Fil d'actualité, petites annonces, messagerie (y compris avec le syndic), conseil AI. Pas d'accès aux documents financiers ni aux votes d'AG.</p>:
              <p style={{fontSize:12,color:T.textLight,margin:0,lineHeight:1.5}}>Fil d'actualité, petites annonces, messagerie, conseil AI (orienté bail). Les documents financiers et votes d'AG sont réservés aux copropriétaires.</p>
            }
          </div>

          <button onClick={()=>setShowRoleSwitch(true)} style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.forest,textAlign:"left",display:"flex",alignItems:"center",gap:10,marginBottom:16}}>🔄 Changer de rôle</button>

          {/* Actions */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.text,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>📤 Exporter mes données</button>
            <button style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.text,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>🔒 Changer de mot de passe</button>
            <button style={{width:"100%",padding:12,borderRadius:10,border:"none",background:`${T.coral}12`,cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:600,color:T.coral,textAlign:"left",display:"flex",alignItems:"center",gap:10}}>🚪 Se déconnecter</button>
          </div>

          <p style={{fontSize:10,color:T.textMuted,textAlign:"center",marginTop:16}}>VoisinSereins.ai v1.0 · Données hébergées en France (UE)</p>
        </div>
      </div>}

      {/* ═══ COPRO INFO MODAL ═══ */}
      {showCoproInfo&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={()=>setShowCoproInfo(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 20px 36px",maxHeight:"85vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 18px"}}/>

          {/* Copro header */}
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 12px",boxShadow:`0 4px 16px ${T.forest}33`}}>🏡</div>
            <h3 style={{fontFamily:FONT,fontSize:22,color:T.forest,margin:"0 0 4px"}}>{activeCopro.name}</h3>
            <p style={{fontSize:13,color:T.textLight,margin:0}}>{activeCopro.addr}</p>
          </div>

          {/* Stats cards */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {[
              {v:activeCopro.logements,l:"Logements",c:T.forest},
              {v:activeCopro.members,l:"Membres actifs",c:T.sky},
              {v:Math.round(activeCopro.members/activeCopro.logements*100)+"%",l:"Couverture",c:T.sunrise},
            ].map((s,i)=>(
              <div key={i} style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 10px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:T.textMuted,fontWeight:500,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:600,color:T.forest}}>Progression de la copropriété</span>
              <span style={{fontSize:12,color:T.textMuted}}>{activeCopro.members}/{activeCopro.logements} logements</span>
            </div>
            <div style={{height:8,borderRadius:4,background:T.sand}}>
              <div style={{height:"100%",borderRadius:4,width:`${(activeCopro.members/activeCopro.logements)*100}%`,background:`linear-gradient(90deg,${T.forest},${T.leaf})`,transition:"width 1s"}}/>
            </div>
          </div>

          {/* Info details */}
          <h4 style={{fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>Informations de la copropriété</h4>

          {[
            {icon:"📍",label:"Adresse",value:activeCopro.addr},
            {icon:"🏗",label:"Année de construction",value:"1975"},
            {icon:"🏢",label:"Nombre de logements",value:activeCopro.logements+" logements"},
            {icon:"📊",label:"Diagnostic énergétique",value:"DPE : D (énergie) / E (climat)"},
            {icon:"💰",label:"Prix moyen au m²",value:"4 250 €/m² (données DVF)"},
            {icon:"🏛",label:"Syndic",value:"Syndic Urbania — Cabinet Durand"},
            {icon:"👥",label:"Conseil syndical",value:"Marie D. (présidente), Paul V., Anna K."},
            {icon:"📋",label:"Immatriculation ANAH",value:"N° 069 123 456"},
          ].map((info,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:i<7?`1px solid ${T.sand}`:"none"}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{info.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:T.textMuted,fontWeight:600}}>{info.label}</div>
                <div style={{fontSize:13,color:T.text,marginTop:1}}>{info.value}</div>
              </div>
            </div>
          ))}

          {/* Documents section */}
          <h4 style={{fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"20px 0 10px"}}>Documents clés</h4>

          {[
            {icon:"📜",name:"Règlement de copropriété",size:"2,4 Mo",type:"PDF"},
            {icon:"🏛",name:"PV dernière AG (avril 2025)",size:"1,1 Mo",type:"PDF"},
            {icon:"📊",name:"Carnet d'entretien",size:"850 Ko",type:"PDF"},
          ].map((doc,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#fff",borderRadius:12,marginBottom:6,boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
              <span style={{fontSize:20}}>{doc.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:T.text}}>{doc.name}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{doc.type} · {doc.size}</div>
              </div>
              <button style={{padding:"6px 12px",borderRadius:8,border:"none",background:`${T.forest}12`,color:T.forest,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:SANS}}>⬇ Télécharger</button>
            </div>
          ))}

          {/* Upload button */}
          <button style={{width:"100%",padding:12,borderRadius:12,border:`2px dashed ${T.sandDark}`,background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:600,color:T.forestLight,marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>📎 Ajouter un document</button>

          {/* Footer info */}
          <div style={{background:`${T.sunriseLight}18`,borderRadius:12,padding:14,marginTop:16}}>
            <p style={{fontSize:12,color:T.bark,margin:0,lineHeight:1.6}}>💡 Les données de la copropriété (année, DPE, prix/m²) sont estimées automatiquement à partir du Registre National des Copropriétés (ANAH), de la BDNB et des données DVF. Elles seront affinées quand le syndic rejoint la plateforme.</p>
          </div>

          <Btn full onClick={()=>setShowCoproInfo(false)} style={{marginTop:16}}>Fermer</Btn>
        </div>
      </div>}

      {/* ═══ VERIFICATION GATE MODAL ═══ */}
      {showVerifyGate&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.3s"}} onClick={()=>setShowVerifyGate(null)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:380,background:T.warmWhite,borderRadius:22,padding:28,boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:48,marginBottom:12}}>{showVerifyGate==="syndic"?"🏛":showVerifyGate==="cs"?"👥":"🔑"}</div>
            <h3 style={{fontFamily:FONT,fontSize:20,color:T.forest,margin:"0 0 6px"}}>
              {showVerifyGate==="syndic"?"Vérification syndic":showVerifyGate==="cs"?"Vérification conseil syndical":"Vérification copropriétaire"}
            </h3>
            <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:0}}>
              {showVerifyGate==="syndic"?"Pour activer les fonctions de gestion syndic, nous devons vérifier votre statut professionnel.":
               showVerifyGate==="cs"?"Pour accéder aux outils du conseil syndical, nous devons vérifier votre mandat.":
               "Pour accéder aux documents financiers et aux votes d'AG, nous devons vérifier votre statut de copropriétaire."}
            </p>
          </div>

          <h4 style={{fontSize:12,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>
            {showVerifyGate==="syndic"?"Méthode de vérification":"Justificatif accepté"}
          </h4>

          {showVerifyGate==="syndic"?
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[{i:"📧",l:"Email professionnel",d:"Adresse @votrecabinet.fr"},{i:"🔑",l:"Code d'activation",d:"Fourni par VoisinSereins"},{i:"👥",l:"Validation par un membre CS",d:"Un membre vérifié confirme"}].map((m,i)=>(
                <button key={i} onClick={()=>{setVerifiedSyndic(true);setVerifySyndicPending(false);setShowVerifyGate(null)}} style={{padding:14,borderRadius:12,border:`1.5px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,fontFamily:SANS}}>
                  <span style={{fontSize:22}}>{m.i}</span>
                  <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{m.l}</div><div style={{fontSize:11,color:T.textMuted}}>{m.d}</div></div>
                </button>
              ))}
            </div>:
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {(showVerifyGate==="cs"?
                [{i:"📋",l:"PV d'AG mentionnant votre élection",d:"Document officiel"},{i:"👥",l:"Validation par le syndic",d:"Le syndic confirme votre mandat"}]:
                [{i:"📄",l:"Taxe foncière",d:"Dernière taxe foncière à votre nom"},{i:"🏠",l:"Titre de propriété",d:"Acte notarié ou attestation"},{i:"🤝",l:"Validation par le syndic",d:"Le syndic confirme votre statut"}]
              ).map((m,i)=>(
                <button key={i} onClick={()=>{if(showVerifyGate==="cs"){setVerifiedCS(true)}else{setVerifiedProprio(true)}setShowVerifyGate(null)}} style={{padding:14,borderRadius:12,border:`1.5px solid ${T.sandDark}`,background:"#fff",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,fontFamily:SANS}}>
                  <span style={{fontSize:22}}>{m.i}</span>
                  <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{m.l}</div><div style={{fontSize:11,color:T.textMuted}}>{m.d}</div></div>
                </button>
              ))}
            </div>
          }

          <p style={{fontSize:11,color:T.textMuted,textAlign:"center",lineHeight:1.5,margin:"0 0 16px"}}>La vérification est traitée sous 24-48h. Vos données sont hébergées en France et protégées par le RGPD.</p>

          <button onClick={()=>setShowVerifyGate(null)} style={{width:"100%",padding:12,borderRadius:10,border:`1px solid ${T.sandDark}`,background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.textMuted,textAlign:"center"}}>Plus tard</button>
        </div>
      </div>}

      {/* ═══ ROLE SWITCH MODAL ═══ */}
      {showRoleSwitch&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.3s"}} onClick={()=>setShowRoleSwitch(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:380,background:T.warmWhite,borderRadius:22,padding:28,boxShadow:"0 16px 48px rgba(0,0,0,0.15)"}}>
          <h3 style={{fontFamily:FONT,fontSize:20,color:T.forest,margin:"0 0 6px",textAlign:"center"}}>Changer de rôle</h3>
          <p style={{fontSize:13,color:T.textLight,textAlign:"center",margin:"0 0 20px",lineHeight:1.5}}>Vos vérifications déjà effectuées restent valides.</p>

          {[
            {id:"proprio",icon:"🔑",label:"Copropriétaire",desc:"Accès complet avec vérification",verified:verifiedProprio},
            {id:"locataire",icon:"🏠",label:"Locataire",desc:"Fil, annonces, messagerie, conseil AI",verified:true},
            {id:"concierge",icon:"🛎",label:"Concierge / Gardien",desc:"Comme locataire + messagerie syndic",verified:true},
            {id:"syndic",icon:"🏛",label:"Syndic professionnel",desc:"Dashboard de gestion",verified:verifiedSyndic},
          ].map((r,i)=>(
            <button key={r.id} onClick={()=>{setRole(r.id);if(r.id!=="proprio")setIsCS(false);setShowRoleSwitch(false);setShowProfile(false)}} style={{
              width:"100%",padding:14,borderRadius:14,border:role===r.id?`2px solid ${T.forest}`:`1.5px solid ${T.sandDark}`,
              background:role===r.id?`${T.leafLight}18`:"#fff",marginBottom:8,cursor:"pointer",textAlign:"left",
              display:"flex",alignItems:"center",gap:12,fontFamily:SANS,
            }}>
              <div style={{width:42,height:42,borderRadius:12,background:role===r.id?`${T.forest}15`:T.sand,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:6}}>
                  {r.label}
                  {r.verified&&<span style={{padding:"1px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:`${T.forest}15`,color:T.forest}}>✓ vérifié</span>}
                </div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:1}}>{r.desc}</div>
              </div>
              {role===r.id&&<span style={{color:T.forest,fontSize:16}}>✓</span>}
            </button>
          ))}

          {role==="proprio"&&<div style={{marginTop:4}}>
            <button onClick={()=>setIsCS(!isCS)} style={{width:"100%",padding:12,borderRadius:12,border:isCS?`2px solid ${T.sky}`:`1.5px solid ${T.sandDark}`,background:isCS?`${T.skyLight}22`:"#fff",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:SANS}}>
              <div style={{width:22,height:22,borderRadius:6,border:isCS?`2px solid ${T.sky}`:`2px solid ${T.sandDark}`,background:isCS?T.sky:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isCS&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}</div>
              <div style={{fontSize:13,fontWeight:500,color:T.text}}>Membre du conseil syndical {verifiedCS&&<span style={{padding:"1px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:`${T.sky}20`,color:T.sky}}>✓ vérifié</span>}</div>
            </button>
          </div>}

          <button onClick={()=>setShowRoleSwitch(false)} style={{width:"100%",marginTop:16,padding:12,borderRadius:10,border:"none",background:T.sandDark,cursor:"pointer",fontFamily:SANS,fontSize:13,fontWeight:500,color:T.textLight,textAlign:"center"}}>Fermer</button>
        </div>
      </div>}

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        *{box-sizing:border-box}
        input::placeholder,textarea::placeholder{color:${T.barkLight}}
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT
   ═══════════════════════════════════════ */
export default function VoisinSereins() {
  const [screen,setScreen]=useState("welcome");
  const [copro,setCopro]=useState(null);
  const [isNew,setIsNew]=useState(false);
  const [userRole,setUserRole]=useState("proprio");
  const [userIsCS,setUserIsCS]=useState(false);
  const [waData,setWaData]=useState(null); // WhatsApp parsed data from onboarding

  return (
    <div style={{maxWidth:420,margin:"0 auto",height:"100dvh",background:T.warmWhite,position:"relative",overflow:"hidden"}}>
      {screen==="welcome"&&<OnboardingWelcome onNext={()=>setScreen("address")}/>}
      {screen==="address"&&<OnboardingAddress
        onFound={c=>{setCopro(c);setIsNew(false);setScreen("role")}}
        onCreate={c=>{const street=c.label?.split(",")[0]?.trim()||"Ma copropriété";const num=street.match(/^\d+\s*/);const name="Copropriété "+(num?street.replace(num[0],""):street);setCopro({...c,name,city:c.label?.split(",").pop()?.trim()||"France",members:1,logements:20});setIsNew(true);setScreen("whatsapp")}}
      />}
      {screen==="whatsapp"&&<OnboardingWhatsApp copro={copro} onImport={(data)=>{setWaData(data);setScreen("role")}} onSkip={()=>setScreen("role")}/>}
      {screen==="role"&&<OnboardingRole copro={copro} onContinue={({role,isCS})=>{setUserRole(role);setUserIsCS(isCS);setScreen("app")}}/>}
      {screen==="app"&&<MainApp copro={copro} role={userRole} isCS={userIsCS} isNew={isNew} waData={waData}/>}
    </div>
  );
}
