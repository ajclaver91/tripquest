import {useEffect,useState} from 'react'
import {Compass,Plus,KeyRound,LogOut,ArrowLeft,Settings,UserRound,CalendarDays,Copy,Share2,Crown,Users,X} from 'lucide-react'
import {supabase} from './supabase'

const emptyGame={name:'',emoji:'🧭',start_date:'',end_date:'',description:''}
const tripStatus=(s,e)=>{if(!s||!e)return'Fechas por definir';const t=new Date();t.setHours(0,0,0,0);const a=new Date(s+'T00:00:00'),b=new Date(e+'T00:00:00'),d=86400000;if(t<a){const n=Math.ceil((a-t)/d);return n===1?'Empieza mañana':`Empieza en ${n} días`}if(t>b)return'Aventura finalizada';return`Día ${Math.floor((t-a)/d)+1} de ${Math.floor((b-a)/d)+1}`}

function Auth(){const[register,setRegister]=useState(false),[f,setF]=useState({nickname:'',email:'',password:''}),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setMsg('');const r=register?await supabase.auth.signUp({email:f.email.trim(),password:f.password,options:{data:{nickname:f.nickname.trim()}}}):await supabase.auth.signInWithPassword({email:f.email.trim(),password:f.password});if(r.error)setMsg(r.error.message);else if(register)setMsg('Cuenta creada. Revisa el correo si se exige confirmación.');setBusy(false)}return <main className="auth"><section className="brand"><div className="mark"><Compass size={42}/></div><p className="eyebrow">TRIPQUEST</p><h1>Haz que el viaje empiece antes de salir.</h1><p className="lead">Crea una aventura, invita a tus Questers y convierte el viaje en un juego compartido.</p></section><form className="card authCard" onSubmit={submit}><div className="switch"><button type="button" className={!register?'active':''} onClick={()=>setRegister(false)}>Entrar</button><button type="button" className={register?'active':''} onClick={()=>setRegister(true)}>Crear cuenta</button></div>{register&&<label>¿Cómo te llamamos?<input required value={f.nickname} onChange={e=>setF({...f,nickname:e.target.value})} placeholder="Tu nick"/></label>}<label>Email<input required type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label><label>Contraseña<input required minLength="6" type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label><button className="primary wide" disabled={busy}>{busy?'Un momento…':register?'Crear mi cuenta':'Entrar'}</button>{msg&&<p className="msg">{msg}</p>}</form></main>}

function Modal({type,onClose,onDone}){const[game,setGame]=useState(emptyGame),[code,setCode]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);let r;if(type==='create')r=await supabase.rpc('create_tripquest_game',{p_name:game.name.trim(),p_emoji:game.emoji||'🧭',p_start_date:game.start_date,p_end_date:game.end_date,p_description:game.description.trim()||null});else r=await supabase.rpc('join_tripquest_game',{p_invite_code:code.trim().toUpperCase()});if(r.error)setMsg(r.error.message);else onDone();setBusy(false)}return <div className="backdrop"><form className="card modal" onSubmit={submit}><button type="button" className="icon" onClick={onClose}><ArrowLeft/></button>{type==='create'?<><p className="eyebrow">NUEVA AVENTURA</p><h2>¿Cómo empieza vuestra historia?</h2><label>Nombre<input required value={game.name} onChange={e=>setGame({...game,name:e.target.value})} placeholder="Galicia 2026"/></label><label>Emoji<input required maxLength="4" value={game.emoji} onChange={e=>setGame({...game,emoji:e.target.value})}/></label><div className="cols"><label>Empieza<input required type="date" value={game.start_date} onChange={e=>setGame({...game,start_date:e.target.value})}/></label><label>Termina<input required type="date" value={game.end_date} onChange={e=>setGame({...game,end_date:e.target.value})}/></label></div><label>Descripción<textarea rows="3" value={game.description} onChange={e=>setGame({...game,description:e.target.value})}/></label></>:<><p className="eyebrow">UNIRME</p><h2>Introduce el código</h2><input required className="code" maxLength="6" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="A7K2P9"/></>}<button className="primary wide" disabled={busy}>{busy?'Un momento…':type==='create'?'Crear aventura':'Unirme'}</button>{msg&&<p className="msg">{msg}</p>}</form></div>}

function Game({membership,onBack}){
  const[mode,setMode]=useState('player');
  const[page,setPage]=useState('home');
  const[copied,setCopied]=useState(false);
  const[questers,setQuesters]=useState([]);
  const[questersLoading,setQuestersLoading]=useState(false);
  const[questersError,setQuestersError]=useState('');
  const g=membership.games,owner=membership.role==='owner';

  async function copyCode(){
    try{
      await navigator.clipboard.writeText(g.invite_code);
      setCopied(true);
      setTimeout(()=>setCopied(false),1800);
    }catch{
      window.prompt('Copia este código:',g.invite_code);
    }
  }

  async function shareCode(){
    const text=`Únete a "${g.name}" en TripQuest con el código ${g.invite_code}`;
    if(navigator.share){
      try{await navigator.share({title:'Invitación a TripQuest',text});}catch{}
    }else{
      await copyCode();
    }
  }

  async function loadQuesters(){
    setQuestersLoading(true);
    setQuestersError('');
    const{data,error}=await supabase.rpc('list_tripquest_game_members',{
      p_game_id:g.id
    });
    if(error){
      console.error('Error cargando Questers:',error);
      setQuesters([]);
      setQuestersError(error.message);
    }else{
      setQuesters(data||[]);
    }
    setQuestersLoading(false);
  }

  function openPage(nextPage){
    setPage(nextPage);
    if(nextPage==='questers')loadQuesters();
  }

  function changeMode(nextMode){
    setMode(nextMode);
    setPage('home');
  }

  const playerSections=[
    {id:'home',label:'🏠 Inicio'},
    {id:'ranking',label:'🏆 Ranking'},
    {id:'envelopes',label:'✉️ Sobres'},
    {id:'challenges',label:'🎯 Retos'},
    {id:'stages',label:'🗺️ Etapas'},
    {id:'auction',label:'🔨 Subasta'},
    {id:'advantages',label:'🎒 Ventajas'},
    {id:'questers',label:'👥 Questers'}
  ];

  const adminSections=[
    {id:'envelopes',label:'✉️ Sobres'},
    {id:'points',label:'⭐ Puntos'},
    {id:'auction',label:'🔨 Subasta'},
    {id:'advantages',label:'🎒 Ventajas'},
    {id:'stages',label:'🗺️ Etapas'},
    {id:'questers',label:'👥 Questers'},
    {id:'settings',label:'⚙️ Ajustes'}
  ];

  const currentSections=mode==='player'?playerSections:adminSections;

  return <main className="shell">
    <header className="top">
      <button className="icon" onClick={page==='home'?onBack:()=>setPage('home')}><ArrowLeft/></button>
      <div>
        <p className="eyebrow">{g.emoji} AVENTURA</p>
        <h1>{page==='questers'?'Questers':g.name}</h1>
      </div>
    </header>

    {owner&&<div className="mode">
      <button className={mode==='player'?'active':''} onClick={()=>changeMode('player')}><UserRound size={18}/>Mi aventura</button>
      <button className={mode==='admin'?'active':''} onClick={()=>changeMode('admin')}><Settings size={18}/>Administrar</button>
    </div>}

    {page==='home'?<>
      <section className="card hero">
        <span>{g.emoji}</span>
        <p className="eyebrow">{mode==='admin'?'MODO ADMIN':'TRIPQUEST'}</p>
        <h2>{tripStatus(g.start_date,g.end_date)}</h2>
        <p>{g.description||'Haz que esta aventura sea inolvidable.'}</p>
      </section>

      <section className="grid">
        {currentSections.map(section=>
          <button
            className="card tile"
            style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}}
            key={section.id}
            onClick={()=>openPage(section.id)}
          >
            <strong>{section.label}</strong>
            <small>{section.id==='questers'?'Ver participantes':'Próximo sprint'}</small>
          </button>
        )}
      </section>
    </>:page==='questers'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">{mode==='admin'?'GESTIÓN DE LA AVENTURA':'COMPAÑEROS DE VIAJE'}</p>
        <h2 style={{marginBottom:'8px'}}>{questers.length} {questers.length===1?'Quester':'Questers'}</h2>
        <p style={{color:'var(--muted)'}}>
          {mode==='admin'
            ?'Aquí puedes comprobar quién se ha unido. El creador de la aventura aparece identificado como Admin.'
            :'Estas son las personas que forman parte de la aventura.'}
        </p>
      </section>

      {mode==='admin'&&<section className="card" style={{marginTop:'14px',padding:'18px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'14px',flexWrap:'wrap'}}>
          <div>
            <p className="eyebrow" style={{marginBottom:'5px'}}>INVITAR QUESTERS</p>
            <strong style={{fontSize:'1.3rem',letterSpacing:'.12em'}}>{g.invite_code}</strong>
          </div>
          <div className="actions">
            <button className="secondary" onClick={copyCode}><Copy size={17}/>{copied?'Copiado':'Copiar'}</button>
            <button className="secondary" onClick={shareCode}><Share2 size={17}/>Compartir</button>
          </div>
        </div>
      </section>}

      <section style={{display:'grid',gap:'10px',marginTop:'14px'}}>
        {questersLoading&&<article className="card" style={{padding:'18px'}}>Cargando Questers…</article>}
        {questersError&&<article className="card" style={{padding:'18px',color:'#a13f3f'}}>{questersError}</article>}
        {!questersLoading&&!questersError&&questers.map((q,index)=>
          <article className="card" key={q.user_id} style={{
            padding:'17px',
            display:'flex',
            alignItems:'center',
            gap:'14px'
          }}>
            <div style={{
              width:'52px',
              height:'52px',
              borderRadius:'17px',
              background:q.profile_color||'#e7eee9',
              display:'grid',
              placeItems:'center',
              fontSize:'1.7rem',
              flexShrink:0
            }}>{q.avatar_emoji||'🧭'}</div>
            <div style={{flex:1}}>
              <strong style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'1.02rem'}}>
                {q.nickname}
                {q.member_role==='owner'&&<Crown size={17}/>}
              </strong>
              <small style={{color:'var(--muted)'}}>
                {q.member_role==='owner'?'Creador · Admin':'Quester'}
              </small>
            </div>
            {q.member_role==='owner'&&
              <span style={{
                padding:'7px 10px',
                borderRadius:'999px',
                background:'#fff1bf',
                fontWeight:'900',
                fontSize:'.72rem'
              }}>ADMIN</span>}
          </article>
        )}
        {!questersLoading&&!questersError&&!questers.length&&
          <article className="card" style={{padding:'18px'}}>Todavía no hay Questers en esta aventura.</article>}
      </section>
    </>:<>
      <section className="card" style={{padding:'24px'}}>
        <p className="eyebrow">PRÓXIMO SPRINT</p>
        <h2>{currentSections.find(x=>x.id===page)?.label||'Sección'}</h2>
        <p style={{color:'var(--muted)'}}>Esta sección se irá incorporando en los siguientes sprints de TripQuest.</p>
      </section>
    </>}
  </main>
}
function Dashboard({session}){const[memberships,setMemberships]=useState([]),[loading,setLoading]=useState(true),[modal,setModal]=useState(null),[selected,setSelected]=useState(null),[profileOpen,setProfileOpen]=useState(false),[profile,setProfile]=useState({nickname:'',avatar_emoji:'🧭',profile_color:'#dfeee7'}),[profileSaving,setProfileSaving]=useState(false),[profileMessage,setProfileMessage]=useState('');async function load(){
  setLoading(true);
  const {data,error}=await supabase.rpc('list_my_tripquest_games_v2');
  if(error){
    console.error('Error cargando aventuras:',error);
    setMemberships([]);
    setLoading(false);
    return;
  }
  const mapped=(data||[]).map(row=>({
    id:row.membership_id,
    role:row.member_role,
    joined_at:row.joined_at,
    games:{
      id:row.game_id,
      name:row.game_name,
      emoji:row.game_emoji,
      description:row.game_description,
      start_date:row.game_start_date,
      end_date:row.game_end_date,
      invite_code:row.invite_code,
      member_count:row.member_count
    }
  }));
  setMemberships(mapped);
  setLoading(false);
}useEffect(()=>{load();loadProfile()},[]);
async function loadProfile(){
  const{data,error}=await supabase.from('profiles').select('nickname,avatar_emoji,profile_color').eq('id',session.user.id).single();
  if(!error&&data)setProfile({
    nickname:data.nickname||'',
    avatar_emoji:data.avatar_emoji||'🧭',
    profile_color:data.profile_color||'#dfeee7'
  });
}
async function saveProfile(e){
  e.preventDefault();
  setProfileSaving(true);
  setProfileMessage('');
  const cleanNickname=profile.nickname.trim();
  if(!cleanNickname){
    setProfileMessage('El nickname no puede quedar vacío.');
    setProfileSaving(false);
    return;
  }
  const{error}=await supabase.from('profiles').update({
    nickname:cleanNickname,
    avatar_emoji:profile.avatar_emoji||'🧭',
    profile_color:profile.profile_color||'#dfeee7'
  }).eq('id',session.user.id);
  if(error){
    setProfileMessage(error.message);
  }else{
    await supabase.auth.updateUser({data:{nickname:cleanNickname}});
    setProfile({...profile,nickname:cleanNickname});
    setProfileMessage('Perfil guardado');
    setTimeout(()=>{setProfileOpen(false);setProfileMessage('')},700);
  }
  setProfileSaving(false);
}if(selected)return <Game membership={selected} onBack={()=>setSelected(null)}/>;const nick=profile.nickname||session.user.user_metadata?.nickname||session.user.email?.split('@')[0];return <main className="shell"><header className="top"><div><p className="eyebrow">BIENVENIDO, QUESTER</p><h1>Hola, {nick}</h1></div><div style={{display:'flex',gap:'8px'}}>
  <button className="secondary" style={{padding:'11px 13px'}} onClick={()=>setProfileOpen(true)}><span style={{fontSize:'1.25rem'}}>{profile.avatar_emoji||'🧭'}</span><span>Mi perfil</span></button>
  <button className="icon" onClick={()=>supabase.auth.signOut()}><LogOut/></button>
</div></header><section className="heading"><div><p className="eyebrow">MIS AVENTURAS</p><h2>¿A cuál quieres entrar?</h2></div><div className="actions"><button className="primary" onClick={()=>setModal('create')}><Plus size={18}/>Crear</button><button className="secondary" onClick={()=>setModal('join')}><KeyRound size={18}/>Unirme</button></div></section>{loading?<p>Cargando…</p>:memberships.length?<section className="games">{memberships.map(m=><button className="card game" key={m.id} onClick={()=>setSelected(m)}><span className="emoji">{m.games.emoji}</span><span><strong>{m.games.name}</strong><small>{tripStatus(m.games.start_date,m.games.end_date)}</small></span><em style={{display:'grid',gap:'4px',justifyItems:'end'}}><span style={{display:'flex',alignItems:'center',gap:'5px'}}><Users size={16}/>{m.games.member_count}</span><span style={{display:'flex',alignItems:'center',gap:'5px'}}><CalendarDays size={16}/>{new Date(m.games.start_date+'T00:00:00').toLocaleDateString('es-ES')}</span></em></button>)}</section>:<section className="card empty"><div>🌍</div><p className="eyebrow">TU PRIMERA AVENTURA</p><h2>El viaje puede empezar hoy.</h2><p>Crea una aventura o únete con un código.</p></section>}{modal&&<Modal type={modal} onClose={()=>setModal(null)} onDone={()=>{setModal(null);load()}}/>}{profileOpen&&<div className="backdrop"><form className="card modal" onSubmit={saveProfile}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}><div><p className="eyebrow">MI PERFIL</p><h2 style={{marginBottom:0}}>Personaliza tu Quester</h2></div><button type="button" className="icon" onClick={()=>setProfileOpen(false)}><X/></button></div><div style={{width:'88px',height:'88px',borderRadius:'26px',background:profile.profile_color,display:'grid',placeItems:'center',fontSize:'3rem',margin:'8px auto 20px'}}>{profile.avatar_emoji||'🧭'}</div><label>Nickname<input required maxLength="30" value={profile.nickname} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label><label>Emoji<input required maxLength="4" value={profile.avatar_emoji} onChange={e=>setProfile({...profile,avatar_emoji:e.target.value})} placeholder="🧭"/></label><label>Color<div style={{display:'grid',gridTemplateColumns:'70px 1fr',gap:'10px',alignItems:'center'}}><input type="color" value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})} style={{height:'48px',padding:'5px'}}/><input value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})}/></div></label><button className="primary wide" disabled={profileSaving}>{profileSaving?'Guardando…':'Guardar cambios'}</button>{profileMessage&&<p className="msg">{profileMessage}</p>}</form></div>}</main>}

export default function App(){const[session,setSession]=useState(null),[ready,setReady]=useState(false);useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});const{data}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);setReady(true)});return()=>data.subscription.unsubscribe()},[]);if(!ready)return <div className="splash"><Compass size={48}/><strong>TripQuest</strong></div>;return session?<Dashboard session={session}/>:<Auth/>}
