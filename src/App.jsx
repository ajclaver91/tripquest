import {useEffect,useState} from 'react'
import {Compass,Plus,KeyRound,LogOut,ArrowLeft,Settings,UserRound,CalendarDays,Copy,Share2,Crown,Users,X,Home,Trophy,Target,Backpack,Star} from 'lucide-react'
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
  const[ranking,setRanking]=useState([]);
  const[rankingLoading,setRankingLoading]=useState(false);
  const[rankingError,setRankingError]=useState('');
  const[pointsForm,setPointsForm]=useState({user_id:'',amount:'10',reason:''});
  const[pointsBusy,setPointsBusy]=useState(false);
  const[pointsMessage,setPointsMessage]=useState('');
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

  async function loadQuesters(){
    setQuestersLoading(true);
    setQuestersError('');
    const{data,error}=await supabase.rpc('list_tripquest_game_members',{p_game_id:g.id});
    if(error){
      console.error('Error cargando Questers:',error);
      setQuesters([]);
      setQuestersError(error.message);
    }else{
      setQuesters(data||[]);
      if(!pointsForm.user_id&&data?.length){
        setPointsForm(form=>({...form,user_id:data[0].user_id}));
      }
    }
    setQuestersLoading(false);
  }

  async function loadRanking(){
    setRankingLoading(true);
    setRankingError('');
    const{data,error}=await supabase.rpc('list_tripquest_ranking',{p_game_id:g.id});
    if(error){
      console.error('Error cargando ranking:',error);
      setRanking([]);
      setRankingError(error.message);
    }else{
      setRanking(data||[]);
    }
    setRankingLoading(false);
  }

  async function adjustPoints(e){
    e.preventDefault();
    setPointsBusy(true);
    setPointsMessage('');
    const amount=Number(pointsForm.amount);
    if(!pointsForm.user_id){
      setPointsMessage('Selecciona un Quester.');
      setPointsBusy(false);
      return;
    }
    if(!Number.isInteger(amount)||amount===0){
      setPointsMessage('Los puntos deben ser un número entero distinto de cero.');
      setPointsBusy(false);
      return;
    }
    if(!pointsForm.reason.trim()){
      setPointsMessage('Escribe el motivo.');
      setPointsBusy(false);
      return;
    }
    const{error}=await supabase.rpc('admin_adjust_tripquest_points',{
      p_game_id:g.id,
      p_user_id:pointsForm.user_id,
      p_amount:amount,
      p_reason:pointsForm.reason.trim()
    });
    if(error){
      setPointsMessage(error.message);
    }else{
      setPointsMessage(amount>0?'Puntos añadidos':'Puntos descontados');
      setPointsForm(form=>({...form,amount:'10',reason:''}));
      await loadRanking();
    }
    setPointsBusy(false);
  }

  function openPage(nextPage){
    setPage(nextPage);
    if(nextPage==='questers')loadQuesters();
    if(nextPage==='ranking')loadRanking();
    if(nextPage==='points'){
      loadQuesters();
      loadRanking();
    }
  }

  function changeMode(nextMode){
    setMode(nextMode);
    setPage('home');
  }

  const adminSections=[
    {id:'points',label:'⭐ Puntos',detail:'Gestionar clasificación'},
    {id:'envelopes',label:'✉️ Sobres',detail:'Próximo sprint'},
    {id:'auction',label:'🔨 Subasta',detail:'Próximo sprint'},
    {id:'advantages',label:'🎒 Ventajas',detail:'Próximo sprint'},
    {id:'stages',label:'🗺️ Etapas',detail:'Próximo sprint'},
    {id:'questers',label:'👥 Questers',detail:'Ver participantes'},
    {id:'settings',label:'⚙️ Ajustes',detail:'Próximo sprint'}
  ];

  const playerNav=[
    {id:'home',label:'Inicio',icon:<Home size={21}/>},
    {id:'ranking',label:'Ranking',icon:<Trophy size={21}/>},
    {id:'challenges',label:'Retos',icon:<Target size={21}/>},
    {id:'advantages',label:'Ventajas',icon:<Backpack size={21}/>}
  ];

  const title=
    page==='ranking'?'Ranking':
    page==='questers'?'Questers':
    page==='points'?'Puntos':
    page==='challenges'?'Retos':
    page==='advantages'?'Ventajas':
    g.name;

  const topThree=['🥇','🥈','🥉'];

  return <main className="shell" style={{paddingBottom:mode==='player'?'105px':undefined}}>
    <header className="top">
      <button className="icon" onClick={page==='home'?onBack:()=>setPage('home')}><ArrowLeft/></button>
      <div>
        <p className="eyebrow">{g.emoji} AVENTURA</p>
        <h1>{title}</h1>
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

      {mode==='admin'&&<section className="card" style={{marginTop:'14px',padding:'16px 18px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div>
            <p className="eyebrow" style={{marginBottom:'4px'}}>CÓDIGO DE INVITACIÓN</p>
            <strong style={{fontSize:'1.1rem',letterSpacing:'.12em'}}>{g.invite_code}</strong>
          </div>
          <button className="secondary" onClick={copyCode}><Copy size={17}/>{copied?'Copiado':'Copiar'}</button>
        </div>
      </section>}

      {mode==='player'?<section className="grid">
        <button className="card tile" style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}} onClick={()=>openPage('ranking')}>
          <strong>🏆 Ranking</strong><small>Consulta la clasificación</small>
        </button>
        <button className="card tile" style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}} onClick={()=>openPage('questers')}>
          <strong>👥 Questers</strong><small>Ver participantes</small>
        </button>
        <button className="card tile" style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}} onClick={()=>openPage('challenges')}>
          <strong>🎯 Retos</strong><small>Próximo sprint</small>
        </button>
        <button className="card tile" style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}} onClick={()=>openPage('advantages')}>
          <strong>🎒 Ventajas</strong><small>Próximo sprint</small>
        </button>
      </section>:<section className="grid">
        {adminSections.map(section=>
          <button className="card tile" style={{textAlign:'left',color:'inherit',border:'1px solid rgba(23,63,53,.11)'}} key={section.id} onClick={()=>openPage(section.id)}>
            <strong>{section.label}</strong><small>{section.detail}</small>
          </button>
        )}
      </section>}
    </>:page==='ranking'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">CLASIFICACIÓN</p>
        <h2 style={{marginBottom:'7px'}}>Así va la aventura</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Los puntos pertenecen únicamente a esta aventura.</p>
      </section>

      <section style={{display:'grid',gap:'10px',marginTop:'14px'}}>
        {rankingLoading&&<article className="card" style={{padding:'18px'}}>Cargando clasificación…</article>}
        {rankingError&&<article className="card" style={{padding:'18px',color:'#a13f3f'}}>{rankingError}</article>}
        {!rankingLoading&&!rankingError&&ranking.map((q,index)=>
          <article className="card" key={q.user_id} style={{
            padding:'16px',
            display:'flex',
            alignItems:'center',
            gap:'13px',
            border:index<3?'1px solid rgba(214,166,62,.45)':'1px solid rgba(23,63,53,.11)'
          }}>
            <div style={{width:'34px',fontSize:index<3?'1.5rem':'1rem',fontWeight:'950',textAlign:'center'}}>
              {topThree[index]||`${index+1}.`}
            </div>
            <div style={{width:'50px',height:'50px',borderRadius:'16px',background:q.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.65rem'}}>
              {q.avatar_emoji||'🧭'}
            </div>
            <div style={{flex:1}}>
              <strong>{q.nickname}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>{q.member_role==='owner'?'Creador · Admin':'Quester'}</small>
            </div>
            <strong style={{fontSize:'1.25rem'}}>{q.total_points} pt</strong>
          </article>
        )}
        {!rankingLoading&&!rankingError&&!ranking.length&&<article className="card" style={{padding:'18px'}}>Todavía no hay Questers.</article>}
      </section>
    </>:page==='points'&&mode==='admin'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">ADMINISTRAR PUNTOS</p>
        <h2 style={{marginBottom:'7px'}}>Actualiza la clasificación</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Usa cantidades positivas para sumar y negativas para restar.</p>
      </section>

      <form className="card" onSubmit={adjustPoints} style={{padding:'20px',marginTop:'14px'}}>
        <label>Quester
          <select value={pointsForm.user_id} onChange={e=>setPointsForm({...pointsForm,user_id:e.target.value})}>
            <option value="">Selecciona un Quester</option>
            {questers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}
          </select>
        </label>
        <label>Puntos
          <input type="number" step="1" value={pointsForm.amount} onChange={e=>setPointsForm({...pointsForm,amount:e.target.value})}/>
        </label>
        <label>Motivo
          <input value={pointsForm.reason} onChange={e=>setPointsForm({...pointsForm,reason:e.target.value})} placeholder="Reto completado, penalización…"/>
        </label>
        <button className="primary wide" disabled={pointsBusy}><Star size={18}/>{pointsBusy?'Guardando…':'Registrar puntos'}</button>
        {pointsMessage&&<p className="msg">{pointsMessage}</p>}
      </form>

      <section style={{marginTop:'14px'}}>
        <p className="eyebrow">CLASIFICACIÓN ACTUAL</p>
        <div style={{display:'grid',gap:'8px'}}>
          {ranking.map((q,index)=><article className="card" key={q.user_id} style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <strong style={{width:'30px'}}>{index+1}.</strong>
            <span style={{fontSize:'1.35rem'}}>{q.avatar_emoji||'🧭'}</span>
            <span style={{flex:1,fontWeight:'800'}}>{q.nickname}</span>
            <strong>{q.total_points} pt</strong>
          </article>)}
        </div>
      </section>
    </>:page==='questers'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">{mode==='admin'?'GESTIÓN DE LA AVENTURA':'COMPAÑEROS DE VIAJE'}</p>
        <h2 style={{marginBottom:'8px'}}>{questers.length} {questers.length===1?'Quester':'Questers'}</h2>
        <p style={{color:'var(--muted)'}}>
          {mode==='admin'?'Aquí puedes comprobar quién se ha unido. El creador aparece identificado como Admin.':'Estas son las personas que forman parte de la aventura.'}
        </p>
      </section>

      <section style={{display:'grid',gap:'10px',marginTop:'14px'}}>
        {questersLoading&&<article className="card" style={{padding:'18px'}}>Cargando Questers…</article>}
        {questersError&&<article className="card" style={{padding:'18px',color:'#a13f3f'}}>{questersError}</article>}
        {!questersLoading&&!questersError&&questers.map(q=>
          <article className="card" key={q.user_id} style={{padding:'17px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'17px',background:q.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.7rem',flexShrink:0}}>
              {q.avatar_emoji||'🧭'}
            </div>
            <div style={{flex:1}}>
              <strong style={{display:'flex',alignItems:'center',gap:'7px',fontSize:'1.02rem'}}>
                {q.nickname}{q.member_role==='owner'&&<Crown size={17}/>}
              </strong>
              <small style={{color:'var(--muted)'}}>{q.member_role==='owner'?'Creador · Admin':'Quester'}</small>
            </div>
          </article>
        )}
      </section>
    </>:<>
      <section className="card" style={{padding:'24px'}}>
        <p className="eyebrow">PRÓXIMO SPRINT</p>
        <h2>{page==='challenges'?'🎯 Retos':page==='advantages'?'🎒 Ventajas':'Sección'}</h2>
        <p style={{color:'var(--muted)'}}>Esta sección se incorporará en los siguientes sprints.</p>
      </section>
    </>}

    {mode==='player'&&<nav style={{
      position:'fixed',
      left:'50%',
      transform:'translateX(-50%)',
      bottom:'max(10px, env(safe-area-inset-bottom))',
      width:'min(620px, calc(100% - 20px))',
      padding:'7px',
      borderRadius:'20px',
      background:'rgba(255,253,247,.96)',
      border:'1px solid rgba(23,63,53,.13)',
      boxShadow:'0 16px 38px rgba(23,63,53,.2)',
      display:'grid',
      gridTemplateColumns:'repeat(4,1fr)',
      gap:'5px',
      zIndex:10,
      backdropFilter:'blur(12px)'
    }}>
      {playerNav.map(item=><button key={item.id} onClick={()=>openPage(item.id)} style={{
        border:0,
        borderRadius:'14px',
        padding:'9px 5px',
        display:'grid',
        justifyItems:'center',
        gap:'3px',
        background:page===item.id?'#173f35':'transparent',
        color:page===item.id?'white':'#62736d',
        fontWeight:'850',
        fontSize:'.72rem'
      }}>{item.icon}<span>{item.label}</span></button>)}
    </nav>}
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
</div></header><section className="heading"><div><p className="eyebrow">MIS AVENTURAS</p><h2>Mis aventuras</h2></div><div className="actions"><button className="primary" onClick={()=>setModal('create')}><Plus size={18}/>Crear</button><button className="secondary" onClick={()=>setModal('join')}><KeyRound size={18}/>Unirme</button></div></section>{loading?<p>Cargando…</p>:memberships.length?<section className="games">{memberships.map(m=><button className="card game" key={m.id} onClick={()=>setSelected(m)}><span className="emoji">{m.games.emoji}</span><span><strong>{m.games.name}</strong><small>{tripStatus(m.games.start_date,m.games.end_date)}</small></span><em style={{display:'grid',gap:'4px',justifyItems:'end'}}><span style={{display:'flex',alignItems:'center',gap:'5px'}}><Users size={16}/>{m.games.member_count}</span><span style={{display:'flex',alignItems:'center',gap:'5px'}}><CalendarDays size={16}/>{new Date(m.games.start_date+'T00:00:00').toLocaleDateString('es-ES')}</span></em></button>)}</section>:<section className="card empty"><div>🌍</div><p className="eyebrow">TU PRIMERA AVENTURA</p><h2>El viaje puede empezar hoy.</h2><p>Crea una aventura o únete con un código.</p></section>}{modal&&<Modal type={modal} onClose={()=>setModal(null)} onDone={()=>{setModal(null);load()}}/>}{profileOpen&&<div className="backdrop"><form className="card modal" onSubmit={saveProfile}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}><div><p className="eyebrow">MI PERFIL</p><h2 style={{marginBottom:0}}>Personaliza tu Quester</h2></div><button type="button" className="icon" onClick={()=>setProfileOpen(false)}><X/></button></div><div style={{width:'88px',height:'88px',borderRadius:'26px',background:profile.profile_color,display:'grid',placeItems:'center',fontSize:'3rem',margin:'8px auto 20px'}}>{profile.avatar_emoji||'🧭'}</div><label>Nickname<input required maxLength="30" value={profile.nickname} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label><label>Emoji<input required maxLength="4" value={profile.avatar_emoji} onChange={e=>setProfile({...profile,avatar_emoji:e.target.value})} placeholder="🧭"/></label><label>Color<div style={{display:'grid',gridTemplateColumns:'70px 1fr',gap:'10px',alignItems:'center'}}><input type="color" value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})} style={{height:'48px',padding:'5px'}}/><input value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})}/></div></label><button className="primary wide" disabled={profileSaving}>{profileSaving?'Guardando…':'Guardar cambios'}</button>{profileMessage&&<p className="msg">{profileMessage}</p>}</form></div>}</main>}

export default function App(){const[session,setSession]=useState(null),[ready,setReady]=useState(false);useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});const{data}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);setReady(true)});return()=>data.subscription.unsubscribe()},[]);if(!ready)return <div className="splash"><Compass size={48}/><strong>TripQuest</strong></div>;return session?<Dashboard session={session}/>:<Auth/>}
