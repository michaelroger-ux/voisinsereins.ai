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
function MainApp({copro,role:initRole,isCS:initCS,isNew}) {
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
  const [userLots,setUserLots]=useState("");

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
  const [agendaTab,setAgendaTab]=useState("events");
  const [docSearch,setDocSearch]=useState("");

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

  const handleReformulate = async () => {
    if(!draft.trim())return; setReforming(true);
    const txt = await callAI(`Tu es un assistant de modération pour copropriété. Règlement:\n${REGLEMENT}\nReformule ce message en 3 styles: diplomatique, chaleureux, factuel. Si lié au règlement, cite l'article. Réponds UNIQUEMENT en JSON: {"diplomatique":"...","chaleureux":"...","factuel":"..."}`,`Message: "${draft}"`);
    try { setReforms(JSON.parse(txt.replace(/```json|```/g,"").trim())); } catch { setReforms({diplomatique:"Je souhaiterais attirer votre attention sur un point important.",chaleureux:"Chers voisins, j'espère que vous allez bien ! Je voulais aborder un sujet.",factuel:"Information : un point nécessite notre attention collective."}); }
    setReforming(false);
  };

  const handlePublish = () => {
    const text=selReform?reforms[selReform]:draft;
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

  const TABS=[
    {id:"home",icon:"🏠",label:"Accueil"},
    {id:"feed",icon:"💬",label:"Fil"},
    {id:"msg",icon:"✉️",label:"Messages"},
    {id:"ai",icon:"⚖️",label:"Conseil"},
    {id:"copro",icon:"🏢",label:"Copro"},
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
            <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
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
          {/* Unverified copro banner */}
          {role==="proprio"&&!verifiedProprio&&(
            <div onClick={()=>setShowVerifyGate("proprio")} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:`${T.sunriseLight}18`,borderRadius:14,marginBottom:12,cursor:"pointer",border:`1.5px solid ${T.sunriseLight}44`}}>
              <span style={{fontSize:18}}>🔒</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.bark}}>Accès limité</div><div style={{fontSize:11,color:T.textMuted}}>Vérifiez votre statut pour accéder aux documents financiers et votes</div></div>
              <span style={{fontSize:11,fontWeight:600,color:T.sunrise}}>Vérifier →</span>
            </div>
          )}
          {/* Welcome card */}
          <Card style={{background:`linear-gradient(135deg,${T.forest}08,${T.leafLight}22)`,border:`1px solid ${T.leafLight}44`,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:17,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
              <div><h2 style={{fontFamily:FONT,fontSize:19,color:T.forest,margin:0}}>Bonjour {userName.split(" ")[0]} !</h2><p style={{fontSize:12,color:T.textLight,margin:"2px 0 0"}}>{role==="proprio"?"Copropriétaire":role==="locataire"?"Locataire":role==="concierge"?"Concierge":"Syndic"}{isCS?" · Conseil syndical":""} · App. {currentApt}</p></div>
            </div>
            {isNew?
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:0}}>Bienvenue sur VoisinSereins ! Vous êtes le premier membre de votre copropriété. Invitez vos voisins pour profiter pleinement de l'app.</p>:
              <p style={{fontSize:13,color:T.textLight,lineHeight:1.6,margin:0}}>Votre copropriété est active avec {activeCopro.members} voisins connectés sur {activeCopro.logements} logements.</p>
            }
          </Card>

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
              {icon:"⚖️",label:"Conseiller juridique",desc:"Posez vos questions",color:T.forest,tab:"ai"},
              {icon:"💬",label:"Fil d'actualité",desc:isNew?"En attente de voisins":`${posts.length} messages`,color:T.sky,tab:"feed"},
              {icon:"🕊",label:"Médiation",desc:"Résoudre un différend",color:T.purple,tab:"msg"},
              {icon:"📅",label:"Agenda & Docs",desc:`${EVENTS.length} événements`,color:T.sunrise,tab:"copro"},
              {icon:"🤝",label:"Entraide",desc:"Petites annonces",color:T.coral,tab:"copro_entraide"},
              {icon:"✉️",label:"Messages",desc:isNew?"—":`${convos.filter(c=>c.unread>0).length} non lu(s)`,color:T.bark,tab:"msg"},
            ].map((item,i)=>(
              <button key={i} onClick={()=>{if(item.tab==="copro_entraide"){setAgendaTab("entraide");setTab("copro")}else{setTab(item.tab)}}} style={{padding:16,borderRadius:16,border:"none",background:"#fff",cursor:"pointer",textAlign:"left",fontFamily:SANS,boxShadow:"0 2px 8px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",gap:8,transition:"transform 0.15s"}} onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{width:40,height:40,borderRadius:12,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{item.icon}</div>
                <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{item.label}</div><div style={{fontSize:11,color:T.textMuted}}>{item.desc}</div></div>
              </button>
            ))}
          </div>

          {/* Upcoming events */}
          <h3 style={{fontSize:13,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>Prochains événements</h3>
          {EVENTS.sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,3).map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#fff",borderRadius:14,marginBottom:8,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",cursor:"pointer"}} onClick={()=>{setAgendaTab("events");setTab("copro")}}>
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
          <button onClick={()=>{setAgendaTab("events");setTab("copro")}} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:12,fontWeight:600,color:T.forestLight}}>Voir tout l'agenda →</button>

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
                  <span style={{padding:"3px 9px",borderRadius:7,fontSize:10,fontWeight:600,background:`${CC[p.cat]||T.sand}18`,color:CC[p.cat]||T.textMuted}}>{p.cat}</span>
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

          {/* Compose FAB */}
          <button onClick={()=>setShowComposer(true)} style={{position:"absolute",bottom:68,right:18,width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${T.forest},${T.forestLight})`,border:"none",color:"#fff",fontSize:22,cursor:"pointer",boxShadow:`0 4px 16px ${T.forest}44`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>✏️</button>

          {/* Composer */}
          {showComposer&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:100,display:"flex",alignItems:"flex-end"}} onClick={()=>{setShowComposer(false);setReforms(null);setSelReform(null)}}>
            <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 18px 28px",maxHeight:"78vh",overflowY:"auto"}}>
              <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 14px"}}/>
              <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 10px"}}>Nouveau message</h3>
              <textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Écrivez librement, l'IA vous aidera à reformuler..." rows={3} style={{width:"100%",border:`2px solid ${T.sandDark}`,borderRadius:12,padding:12,fontSize:13,fontFamily:SANS,resize:"none",outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
              <Btn full disabled={reforming||!draft.trim()} onClick={handleReformulate} style={{marginTop:8,background:reforming?T.sandDark:`linear-gradient(135deg,${T.sky},${T.forest})`}} small>{reforming?"Reformulation...":"✨ Reformuler avec l'IA"}</Btn>
              {reforms&&<div style={{marginTop:12,display:"flex",flexDirection:"column",gap:7}}>
                {Object.entries(reforms).map(([style,text])=>(
                  <button key={style} onClick={()=>setSelReform(style)} style={{padding:12,borderRadius:12,textAlign:"left",border:selReform===style?`2px solid ${T.forest}`:`2px solid ${T.sandDark}`,background:selReform===style?`${T.leafLight}18`:"#fff",cursor:"pointer",fontFamily:SANS}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.forest,textTransform:"capitalize",marginBottom:3}}>{style}</div>
                    <div style={{fontSize:12,color:T.text,lineHeight:1.5}}>{text}</div>
                  </button>
                ))}
              </div>}
              {(selReform||draft.trim())&&<Btn full onClick={handlePublish} style={{marginTop:10}}>Publier {selReform?`(${selReform})`:"(original)"}</Btn>}
            </div>
          </div>}
        </div>}

        {/* ═══ MESSAGES TAB ═══ */}
        {tab==="msg"&&<div>
          {msgView==="list"?<div style={{padding:"14px 14px"}}>
            {/* Mediation card */}
            <div onClick={()=>setTab("mediation")} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:`linear-gradient(135deg,${T.purple}10,${T.sky}10)`,borderRadius:16,marginBottom:14,cursor:"pointer",border:`1.5px solid ${T.purple}25`,boxShadow:`0 2px 12px ${T.purple}08`}}>
              <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${T.purple}20,${T.sky}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🕊</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.purple}}>Médiation entre voisins</div><div style={{fontSize:12,color:T.textMuted,marginTop:1}}>Résoudre un différend avec l'aide de l'AI</div></div>
              <span style={{fontSize:14,color:T.purple,fontWeight:600}}>→</span>
            </div>

            <h4 style={{fontSize:11,fontWeight:700,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px"}}>Conversations</h4>
            {/* New message button */}
            <button onClick={()=>setMsgView("newmsg")} style={{width:"100%",padding:"12px 14px",background:`${T.forest}08`,borderRadius:16,border:`1.5px dashed ${T.forestLight}55`,marginBottom:12,cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:SANS,textAlign:"left"}}>
              <div style={{width:42,height:42,borderRadius:14,background:`${T.forest}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>✏️</div>
              <div><div style={{fontSize:14,fontWeight:600,color:T.forest}}>Nouveau message</div><div style={{fontSize:12,color:T.textMuted}}>{role==="locataire"?"Écrire à un voisin":"Écrire à un voisin ou au syndic"}</div></div>
            </button>
            {convos.filter(c=>!(role==="locataire"&&c.role==="syndic")).map(c=>(
              <button key={c.id} onClick={()=>{setActiveConv(c);setMsgView("conv")}} style={{width:"100%",padding:"12px 14px",background:"#fff",borderRadius:16,border:"none",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:SANS,boxShadow:"0 1px 6px rgba(0,0,0,0.04)",textAlign:"left"}}>
                <Av name={c.name} size={42}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:600,color:T.text}}>{c.name}</span><span style={{fontSize:10,color:T.textMuted}}>{c.time}</span></div>
                  <p style={{fontSize:12,color:T.textMuted,margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg}</p>
                </div>
                {c.unread>0&&<div style={{width:20,height:20,borderRadius:10,background:T.coral,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{c.unread}</div>}
              </button>
            ))}
          </div>:
          msgView==="newmsg"?<div style={{padding:14}}>
            <button onClick={()=>setMsgView("list")} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>← Retour</button>
            <h3 style={{fontFamily:FONT,fontSize:17,color:T.forest,margin:"0 0 6px"}}>Nouveau message</h3>
            <p style={{fontSize:12,color:T.textMuted,margin:"0 0 14px"}}>Choisissez un destinataire</p>
            {[
              {name:"Marie D.",floor:"3B",role:"CS"},
              {name:"Thomas R.",floor:"1A",role:"proprio"},
              {name:"Sophie L.",floor:"4C",role:"locataire"},
              {name:"Anna K.",floor:"5A",role:"proprio"},
              {name:"Paul V.",floor:"1C",role:"proprio"},
              ...(role!=="locataire"?[{name:"Syndic Urbania",floor:"",role:"syndic"}]:[]),
            ].map((dest,i)=>(
              <button key={i} onClick={()=>{setActiveConv({id:Date.now(),name:dest.name,floor:dest.floor});setConvMsgs([]);setMsgView("conv")}} style={{width:"100%",padding:"10px 14px",background:"#fff",borderRadius:14,border:"none",marginBottom:6,cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:SANS,boxShadow:"0 1px 4px rgba(0,0,0,0.03)",textAlign:"left"}}>
                <Av name={dest.name} size={36}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{dest.name}</div>{dest.floor&&<div style={{fontSize:10,color:T.textMuted}}>App. {dest.floor}</div>}</div>
                {dest.role==="syndic"&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:T.coral,color:"#fff"}}>SYNDIC</span>}
                {dest.role==="CS"&&<span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:T.sky,color:"#fff"}}>CS</span>}
              </button>
            ))}
            {role==="locataire"&&<div style={{background:`${T.sunriseLight}22`,borderRadius:12,padding:12,marginTop:8}}><p style={{fontSize:12,color:T.bark,margin:0}}>ℹ️ En tant que locataire, les messages au syndic ne sont pas disponibles. Contactez votre propriétaire pour toute demande au syndic.</p></div>}
          </div>:
          <div style={{display:"flex",flexDirection:"column",flex:1,minHeight:0}}>
            <div style={{padding:"12px 16px",background:"#fff",borderBottom:`1px solid ${T.sandDark}`,display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setMsgView("list")} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:T.forest}}>←</button>
              <Av name={activeConv?.name||""} size={32}/>
              <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>{activeConv?.name}</div><div style={{fontSize:10,color:T.textMuted}}>{activeConv?.floor}</div></div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:14}}>
              {convMsgs.length===0&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:36,marginBottom:8}}>💬</div><p style={{fontSize:13,color:T.textMuted}}>Écrivez votre premier message à {activeConv?.name}</p></div>}
              {convMsgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start",marginBottom:10}}>
                  <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:14,background:m.from==="me"?`linear-gradient(135deg,${T.forest},${T.forestLight})`:"#fff",color:m.from==="me"?"#fff":T.text,fontSize:13,lineHeight:1.5,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                    {m.text}<div style={{fontSize:9,marginTop:4,opacity:0.6,textAlign:"right"}}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 14px",background:T.warmWhite,borderTop:`1px solid ${T.sandDark}`,display:"flex",gap:8}}>
              <input value={msgDraft} onChange={e=>setMsgDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&msgDraft.trim()){setConvMsgs(p=>[...p,{from:"me",text:msgDraft,time:"Maint."}]);setMsgDraft("")}}} placeholder="Message..." style={{flex:1,padding:"10px 14px",borderRadius:12,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff"}}/>
              <button onClick={()=>{if(msgDraft.trim()){setConvMsgs(p=>[...p,{from:"me",text:msgDraft,time:"Maint."}]);setMsgDraft("")}}} style={{width:42,height:42,borderRadius:12,border:"none",background:msgDraft.trim()?`linear-gradient(135deg,${T.forest},${T.forestLight})`:T.sandDark,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↑</button>
            </div>
          </div>}
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

        {/* ═══ COPRO TAB (Agenda + Docs + Entraide) ═══ */}
        {tab==="copro"&&<div style={{padding:14}}>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{id:"events",l:"📅 Agenda"},{id:"docs",l:"📁 Documents"},{id:"entraide",l:"🤝 Entraide"}].map(t=>(
              <button key={t.id} onClick={()=>setAgendaTab(t.id)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:agendaTab===t.id?T.forest:"#fff",color:agendaTab===t.id?"#fff":T.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:SANS,flex:1,textAlign:"center"}}>{t.l}</button>
            ))}
          </div>

          {agendaTab==="events"&&<div>
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

          {agendaTab==="entraide"&&<div>
            <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto"}}>
              {[{l:"Toutes",i:"📋"},{l:"Services",i:"🔧"},{l:"Prêt",i:"📦"},{l:"Baby-sitting",i:"👶"},{l:"Dons",i:"🎁"}].map((c,i)=><Chip key={i} label={c.l} icon={c.i} active={i===0}/>)}
            </div>
            {[
              {author:"Sophie L.",floor:"4C",title:"Recherche baby-sitter",desc:"Pour samedi soir 19h-23h, 2 enfants (4 et 7 ans). Rémunération au tarif habituel.",cat:"👶",color:T.coral,time:"Auj."},
              {author:"Lucas M.",floor:"2B",title:"Prêt de perceuse",desc:"Je peux prêter ma perceuse Bosch ce week-end. Envoyez-moi un message !",cat:"📦",color:T.sky,time:"Hier"},
              {author:"Anna K.",floor:"5A",title:"Cours de yoga collectif",desc:"Je propose un cours de yoga dans le jardin commun chaque mercredi à 18h30. Gratuit et ouvert à tous !",cat:"🧘",color:T.purple,time:"Mar."},
              {author:"Paul V.",floor:"1C",title:"Don de livres",desc:"Je donne une cinquantaine de romans. Premiers arrivés, premiers servis ! Boîte aux lettres du 1C.",cat:"🎁",color:T.sunrise,time:"Lun."},
            ].map((a,i)=>(
              <Card key={i}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <Av name={a.author} size={34}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.author} <span style={{fontWeight:400,color:T.textMuted,fontSize:11}}>· {a.floor}</span></div><div style={{fontSize:10,color:T.textMuted}}>{a.time}</div></div>
                  <span style={{fontSize:18}}>{a.cat}</span>
                </div>
                <h4 style={{margin:"0 0 4px",fontSize:14,color:T.text}}>{a.title}</h4>
                <p style={{fontSize:13,color:T.textLight,lineHeight:1.5,margin:"0 0 10px"}}>{a.desc}</p>
                <Btn small primary={false}>💬 Contacter</Btn>
              </Card>
            ))}
            <button style={{width:"100%",padding:14,borderRadius:14,border:`2px dashed ${T.sandDark}`,background:"transparent",cursor:"pointer",fontFamily:SANS,fontSize:14,fontWeight:600,color:T.forestLight,marginTop:4}}>+ Poster une annonce</button>
          </div>}
        </div>}

        {/* ═══ MEDIATION (inside messages) ═══ */}
        {tab==="mediation"&&<div style={{padding:14}}>
          <button onClick={()=>setTab("msg")} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",color:T.forest,fontFamily:SANS,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:6}}>← Retour aux messages</button>

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
      {tab!=="mediation"&&<div style={{background:"rgba(253,251,247,0.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${T.sandDark}`,padding:"6px 8px calc(14px + env(safe-area-inset-bottom, 8px))",display:"flex",justifyContent:"space-around",flexShrink:0,zIndex:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"4px 10px 2px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative"}}>
            <span style={{fontSize:20}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:700,fontFamily:SANS,color:tab===t.id?T.forest:T.textMuted}}>{t.label}</span>
            {tab===t.id&&<div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:3,borderRadius:2,background:T.forest}}/>}
          </button>
        ))}
      </div>}

      {showInvite&&<InviteKit copro={copro||{label:"Ma copropriété"}} userName={userName} onClose={()=>setShowInvite(false)}/>}

      {/* ═══ PROFILE MODAL ═══ */}
      {showProfile&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.3s"}} onClick={()=>setShowProfile(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:420,background:T.warmWhite,borderRadius:"22px 22px 0 0",padding:"8px 20px 36px",maxHeight:"85vh",overflowY:"auto",animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:T.sandDark,margin:"8px auto 18px"}}/>

          {/* Profile header */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{position:"relative"}}>
              <div style={{width:60,height:60,borderRadius:18,background:`linear-gradient(135deg,${T.sunrise},${T.coral})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:22,fontFamily:SANS}}>{userName.split(" ").map(n=>n[0]).join("")}</div>
              {(verifiedProprio||verifiedSyndic)&&<div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:10,background:T.forest,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>✓</div>}
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

          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:2}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Bâtiment</label>
              <input value={userBuilding} onChange={e=>{setUserBuilding(e.target.value);setUserFloorEdited(false)}} placeholder="A, Mimosa..." style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div style={{flex:1}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Étage</label>
              <input value={userEtage} onChange={e=>{setUserEtage(e.target.value);setUserFloorEdited(false)}} placeholder="3" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${T.sandDark}`,fontSize:13,fontFamily:SANS,outline:"none",background:"#fff",color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div style={{flex:1.5}}>
              <label style={{fontSize:10,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:0.5,display:"block",marginBottom:4}}>Porte</label>
              <div style={{display:"flex",gap:4}}>
                {["Gauche","Centre","Droite"].map(d=>(
                  <button key={d} onClick={()=>{setUserDoor(d);setUserFloorEdited(false)}} style={{flex:1,padding:"9px 4px",borderRadius:8,border:userDoor===d?`2px solid ${T.forest}`:`1.5px solid ${T.sandDark}`,background:userDoor===d?`${T.leafLight}18`:"#fff",cursor:"pointer",fontFamily:SANS,fontSize:9,fontWeight:600,color:userDoor===d?T.forest:T.textMuted,textAlign:"center"}}>{d.charAt(0)}</button>
                ))}
              </div>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,fontWeight:600,color:T.textMuted,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>Appartement <span style={{fontSize:9,fontWeight:400,textTransform:"none",letterSpacing:0}}>(auto-généré, modifiable)</span></label>
            <input value={currentApt} onChange={e=>{setUserFloor(e.target.value);setUserFloorEdited(true)}} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${userFloorEdited?T.sunrise:T.sandDark}`,fontSize:14,fontFamily:SANS,outline:"none",background:userFloorEdited?"#fff":`${T.leafLight}12`,color:T.text,boxSizing:"border-box"}}/>
            {userFloorEdited&&<p style={{fontSize:10,color:T.sunrise,margin:"4px 0 0"}}>✏️ Modifié manuellement</p>}
          </div>

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

  return (
    <div style={{maxWidth:420,margin:"0 auto",height:"100dvh",background:T.warmWhite,position:"relative",overflow:"hidden"}}>
      {screen==="welcome"&&<OnboardingWelcome onNext={()=>setScreen("address")}/>}
      {screen==="address"&&<OnboardingAddress
        onFound={c=>{setCopro(c);setIsNew(false);setScreen("role")}}
        onCreate={c=>{const street=c.label?.split(",")[0]?.trim()||"Ma copropriété";const num=street.match(/^\d+\s*/);const name="Copropriété "+(num?street.replace(num[0],""):street);setCopro({...c,name,city:c.label?.split(",").pop()?.trim()||"France",members:1,logements:20});setIsNew(true);setScreen("role")}}
      />}
      {screen==="role"&&<OnboardingRole copro={copro} onContinue={({role,isCS})=>{setUserRole(role);setUserIsCS(isCS);setScreen("app")}}/>}
      {screen==="app"&&<MainApp copro={copro} role={userRole} isCS={userIsCS} isNew={isNew}/>}
    </div>
  );
}
