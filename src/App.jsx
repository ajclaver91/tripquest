import {useEffect,useState} from 'react'
import {Compass,Plus,KeyRound,LogOut,ArrowLeft,Settings,UserRound,CalendarDays,Copy,Share2,Crown,Users,X,Home,Trophy,Target,Backpack,Star,CheckCircle2,MoreVertical,Pencil,Trash2,DoorOpen,Lock,Handshake,Send,Check,Clock3,RotateCcw} from 'lucide-react'
import {supabase} from './supabase'

const emptyGame={name:'',emoji:'🧭',start_date:'',end_date:'',description:''}
const tripStatus=(s,e)=>{if(!s||!e)return'Fechas por definir';const t=new Date();t.setHours(0,0,0,0);const a=new Date(s+'T00:00:00'),b=new Date(e+'T00:00:00'),d=86400000;if(t<a){const n=Math.ceil((a-t)/d);return n===1?'Empieza mañana':`Empieza en ${n} días`}if(t>b)return'Aventura finalizada';return`Día ${Math.floor((t-a)/d)+1} de ${Math.floor((b-a)/d)+1}`}

function Auth(){const[register,setRegister]=useState(false),[f,setF]=useState({nickname:'',email:'',password:''}),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setMsg('');const r=register?await supabase.auth.signUp({email:f.email.trim(),password:f.password,options:{data:{nickname:f.nickname.trim()},emailRedirectTo:`${window.location.origin}/?email_confirmed=1`}}):await supabase.auth.signInWithPassword({email:f.email.trim(),password:f.password});if(r.error)setMsg(r.error.message);else if(register)setMsg('Cuenta creada. Revisa el correo si se exige confirmación.');setBusy(false)}return <main className="auth"><section className="brand"><div className="mark"><Compass size={42}/></div><p className="eyebrow">TRIPQUEST</p><h1>Haz que el viaje empiece antes de salir.</h1><p className="lead">Crea una aventura, invita a tus Questers y convierte el viaje en un juego compartido.</p></section><form className="card authCard" onSubmit={submit}><div className="switch"><button type="button" className={!register?'active':''} onClick={()=>setRegister(false)}>Entrar</button><button type="button" className={register?'active':''} onClick={()=>setRegister(true)}>Crear cuenta</button></div>{register&&<label>¿Cómo te llamamos?<input required value={f.nickname} onChange={e=>setF({...f,nickname:e.target.value})} placeholder="Tu nick"/></label>}<label>Email<input required type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label><label>Contraseña<input required minLength="6" type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label><button className="primary wide" disabled={busy}>{busy?'Un momento…':register?'Crear mi cuenta':'Entrar'}</button>{msg&&<p className="msg">{msg}</p>}</form></main>}

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
  const[pointHistory,setPointHistory]=useState([]);
  const[historyLoading,setHistoryLoading]=useState(false);
  const[notificationCounts,setNotificationCounts]=useState({ranking:0,challenges:0,advantages:0,admin:0});

  const[dailyChallenges,setDailyChallenges]=useState([]);
  const[dailyLoading,setDailyLoading]=useState(false);
  const[specialChallenges,setSpecialChallenges]=useState([]);
  const[specialLoading,setSpecialLoading]=useState(false);
  const[library,setLibrary]=useState([]);
  const[adminDailyReviews,setAdminDailyReviews]=useState([]);
  const[adminSpecialReviews,setAdminSpecialReviews]=useState([]);
  const[challengeBusy,setChallengeBusy]=useState(false);
  const[challengeMessage,setChallengeMessage]=useState('');
  const[challengeForm,setChallengeForm]=useState({
    kind:'secret_individual',
    title:'',
    description:'',
    points:'20',
    recipient_ids:[],
    random_count:'1'
  });

  const g=membership.games;
  const owner=membership.role==='owner';

  useEffect(()=>{
    loadQuesters();
    loadDailyChallenges();
    loadNotificationCounts();
  },[g.id]);

  async function loadNotificationCounts(){
    const{data,error}=await supabase.rpc('get_tripquest_notification_counts',{p_game_id:g.id});
    if(error){
      console.error('Error cargando notificaciones:',error);
      return;
    }
    const next={ranking:0,challenges:0,advantages:0,admin:0};
    (data||[]).forEach(row=>{next[row.section]=Number(row.unread_count)||0});
    setNotificationCounts(next);
  }

  async function markSectionRead(section){
    const{error}=await supabase.rpc('mark_tripquest_notifications_read',{
      p_game_id:g.id,
      p_section:section
    });
    if(!error)setNotificationCounts(current=>({...current,[section]:0}));
  }

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

  async function loadPointHistory(){
    setHistoryLoading(true);
    const{data,error}=await supabase.rpc('list_tripquest_point_history',{
      p_game_id:g.id,
      p_limit:30
    });
    if(error){
      console.error('Error cargando historial:',error);
      setPointHistory([]);
    }else{
      setPointHistory(data||[]);
    }
    setHistoryLoading(false);
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
      setPointsMessage('Los puntos deben ser un entero distinto de cero.');
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
      await loadPointHistory();
    }
    setPointsBusy(false);
  }

  async function loadDailyChallenges(){
    setDailyLoading(true);
    const{data,error}=await supabase.rpc('list_my_daily_challenges',{p_game_id:g.id});
    if(error){
      console.error('Error cargando retos diarios:',error);
      setDailyChallenges([]);
    }else{
      setDailyChallenges(data||[]);
    }
    setDailyLoading(false);
  }

  async function submitDaily(challengeId){
    setChallengeMessage('');
    const{error}=await supabase.rpc('submit_daily_challenge',{p_daily_challenge_id:challengeId});
    if(error)setChallengeMessage(error.message);
    else{
      setChallengeMessage('Reto enviado a revisión');
      await loadDailyChallenges();
      await loadNotificationCounts();
    }
  }

  async function loadMySpecialChallenges(){
    setSpecialLoading(true);
    const{data,error}=await supabase.rpc('list_my_tripquest_challenges',{p_game_id:g.id});
    if(error){
      console.error('Error cargando retos:',error);
      setSpecialChallenges([]);
    }else{
      setSpecialChallenges(data||[]);
    }
    setSpecialLoading(false);
  }

  async function submitSpecial(groupId){
    setChallengeMessage('');
    const{error}=await supabase.rpc('submit_tripquest_challenge_group',{p_group_id:groupId});
    if(error)setChallengeMessage(error.message);
    else{
      setChallengeMessage('Reto enviado a revisión');
      await loadMySpecialChallenges();
      await loadNotificationCounts();
    }
  }

  async function loadAdminChallenges(){
    const [libraryResult,dailyReviewResult,specialReviewResult]=await Promise.all([
      supabase.rpc('list_tripquest_daily_library',{p_game_id:g.id}),
      supabase.rpc('list_admin_daily_reviews',{p_game_id:g.id}),
      supabase.rpc('list_admin_special_reviews',{p_game_id:g.id})
    ]);
    if(!libraryResult.error)setLibrary(libraryResult.data||[]);
    if(!dailyReviewResult.error)setAdminDailyReviews(dailyReviewResult.data||[]);
    if(!specialReviewResult.error)setAdminSpecialReviews(specialReviewResult.data||[]);
  }

  async function toggleDaily(item){
    setChallengeBusy(true);
    setChallengeMessage('');
    const{error}=await supabase.rpc('set_tripquest_daily_challenge',{
      p_game_id:g.id,
      p_template_id:item.template_id,
      p_active:!item.is_active,
      p_points:item.points
    });
    if(error)setChallengeMessage(error.message);
    else{
      await loadAdminChallenges();
      await loadDailyChallenges();
    }
    setChallengeBusy(false);
  }

  function toggleRecipient(userId){
    setChallengeForm(form=>({
      ...form,
      recipient_ids:form.recipient_ids.includes(userId)
        ?form.recipient_ids.filter(id=>id!==userId)
        :[...form.recipient_ids,userId]
    }));
  }

  function chooseRandomRecipients(){
    const count=Math.max(1,Math.min(Number(challengeForm.random_count)||1,questers.length));
    const shuffled=[...questers].sort(()=>Math.random()-.5);
    setChallengeForm(form=>({...form,recipient_ids:shuffled.slice(0,count).map(q=>q.user_id)}));
  }

  async function createChallenge(e){
    e.preventDefault();
    setChallengeBusy(true);
    setChallengeMessage('');
    if(!challengeForm.title.trim()||!challengeForm.description.trim()){
      setChallengeMessage('Completa título y descripción.');
      setChallengeBusy(false);
      return;
    }
    if(!challengeForm.recipient_ids.length){
      setChallengeMessage('Selecciona al menos un Quester.');
      setChallengeBusy(false);
      return;
    }
    const points=Number(challengeForm.points);
    if(!Number.isInteger(points)||points<0){
      setChallengeMessage('Los puntos deben ser un entero positivo o cero.');
      setChallengeBusy(false);
      return;
    }
    const{error}=await supabase.rpc('create_tripquest_challenge',{
      p_game_id:g.id,
      p_kind:challengeForm.kind,
      p_title:challengeForm.title.trim(),
      p_description:challengeForm.description.trim(),
      p_points:points,
      p_recipient_ids:challengeForm.recipient_ids
    });
    if(error){
      setChallengeMessage(error.message);
    }else{
      setChallengeMessage('Reto enviado');
      setChallengeForm({
        kind:'secret_individual',
        title:'',
        description:'',
        points:'20',
        recipient_ids:[],
        random_count:'1'
      });
      await loadAdminChallenges();
      await loadNotificationCounts();
    }
    setChallengeBusy(false);
  }

  async function reviewDaily(progressId,approve){
    setChallengeBusy(true);
    const{error}=await supabase.rpc('review_daily_challenge',{
      p_progress_id:progressId,
      p_approve:approve
    });
    if(error)setChallengeMessage(error.message);
    else{
      setChallengeMessage(approve?'Reto aprobado':'Reto rechazado');
      await loadAdminChallenges();
      await loadRanking();
    }
    setChallengeBusy(false);
  }

  async function reviewSpecial(groupId,approve){
    setChallengeBusy(true);
    const{error}=await supabase.rpc('review_tripquest_challenge_group',{
      p_group_id:groupId,
      p_approve:approve
    });
    if(error)setChallengeMessage(error.message);
    else{
      setChallengeMessage(approve?'Reto aprobado':'Reto rechazado');
      await loadAdminChallenges();
      await loadRanking();
    }
    setChallengeBusy(false);
  }

  function openPage(nextPage){
    setPage(nextPage);
    if(nextPage==='questers')loadQuesters();
    if(nextPage==='ranking'){
      loadRanking();
      loadPointHistory();
      markSectionRead('ranking');
    }
    if(nextPage==='challenges'){
      loadMySpecialChallenges();
      markSectionRead('challenges');
    }
    if(nextPage==='advantages')markSectionRead('advantages');
    if(nextPage==='points'){
      loadQuesters();
      loadRanking();
      loadPointHistory();
    }
    if(nextPage==='adminChallenges'){
      loadQuesters();
      loadAdminChallenges();
    }
  }

  function changeMode(nextMode){
    setMode(nextMode);
    setPage('home');
    if(nextMode==='admin')markSectionRead('admin');
  }

  const adminSections=[
    {id:'adminChallenges',label:'🎯 Retos y sobres',detail:'Diarios, secretos y equipos'},
    {id:'points',label:'⭐ Puntos',detail:'Gestionar clasificación'},
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
    page==='adminChallenges'?'Retos y sobres':
    page==='advantages'?'Ventajas':
    g.name;

  const topThree=['🥇','🥈','🥉'];
  const statusLabel={
    pending:'Pendiente',
    submitted:'En revisión',
    approved:'Completado',
    rejected:'Rechazado'
  };
  const kindLabel={
    secret_individual:'🔒 Sobre secreto',
    secret_team:'🤝 Reto de equipo',
    manual:'✍️ Reto manual'
  };

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
      <button className={mode==='admin'?'active':''} onClick={()=>changeMode('admin')} style={{position:'relative'}}>
        <Settings size={18}/>Administrar
        {notificationCounts.admin>0&&<span style={{position:'absolute',right:'7px',top:'5px',width:'9px',height:'9px',borderRadius:'50%',background:'#e05b4f',border:'2px solid white'}}/>}
      </button>
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

      {mode==='player'?<>
        <button className="card" onClick={()=>openPage('questers')} style={{
          width:'100%',marginTop:'14px',padding:'18px',
          border:'1px solid rgba(23,63,53,.11)',color:'inherit',textAlign:'left'
        }}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'14px'}}>
            <div>
              <p className="eyebrow" style={{marginBottom:'5px'}}>QUESTERS</p>
              <strong style={{fontSize:'1.08rem'}}>{questers.length} {questers.length===1?'participante':'participantes'}</strong>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              {questers.slice(0,5).map((q,index)=><div key={q.user_id} style={{
                width:'42px',height:'42px',borderRadius:'14px',
                background:q.profile_color||'#e7eee9',display:'grid',
                placeItems:'center',fontSize:'1.35rem',
                marginLeft:index===0?0:'-8px',border:'3px solid #fffdf7'
              }}>{q.avatar_emoji||'🧭'}</div>)}
            </div>
          </div>
        </button>

        <section style={{marginTop:'20px'}}>
          <p className="eyebrow">RETOS DEL DÍA</p>
          <div style={{display:'grid',gap:'10px'}}>
            {dailyLoading&&<article className="card" style={{padding:'17px'}}>Cargando retos…</article>}
            {!dailyLoading&&dailyChallenges.map(item=><article className="card" key={item.daily_challenge_id} style={{padding:'18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'flex-start'}}>
                <div style={{flex:1}}>
                  <strong style={{fontSize:'1.05rem'}}>{item.title}</strong>
                  <p style={{color:'var(--muted)',margin:'7px 0 10px'}}>{item.description}</p>
                  <span style={{fontWeight:'900'}}>⭐ {item.points} pt</span>
                </div>
                <span style={{fontSize:'.75rem',fontWeight:'900',padding:'7px 10px',borderRadius:'999px',background:'#eef3ef'}}>
                  {statusLabel[item.progress_status]||'Pendiente'}
                </span>
              </div>
              {(item.progress_status==='pending'||item.progress_status==='rejected')&&
                <button className="primary wide" style={{marginTop:'13px'}} onClick={()=>submitDaily(item.daily_challenge_id)}>
                  <Check size={17}/>Marcar como completado
                </button>}
            </article>)}
            {!dailyLoading&&!dailyChallenges.length&&<article className="card" style={{padding:'18px'}}>El Admin todavía no ha activado retos para hoy.</article>}
          </div>
        </section>
      </>:<section className="grid">
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
          <article className="card" key={q.user_id} style={{padding:'16px',display:'flex',alignItems:'center',gap:'13px',border:index<3?'1px solid rgba(214,166,62,.45)':'1px solid rgba(23,63,53,.11)'}}>
            <div style={{width:'34px',fontSize:index<3?'1.5rem':'1rem',fontWeight:'950',textAlign:'center'}}>{topThree[index]||`${index+1}.`}</div>
            <div style={{width:'50px',height:'50px',borderRadius:'16px',background:q.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.65rem'}}>{q.avatar_emoji||'🧭'}</div>
            <div style={{flex:1}}><strong>{q.nickname}</strong><small style={{display:'block',color:'var(--muted)'}}>{q.member_role==='owner'?'Creador · Admin':'Quester'}</small></div>
            <strong style={{fontSize:'1.25rem'}}>{q.total_points} pt</strong>
          </article>
        )}
      </section>
      <section style={{marginTop:'22px'}}>
        <p className="eyebrow">ÚLTIMOS MOVIMIENTOS</p>
        <div style={{display:'grid',gap:'8px'}}>
          {historyLoading&&<article className="card" style={{padding:'16px'}}>Cargando historial…</article>}
          {!historyLoading&&pointHistory.map(move=><article className="card" key={move.movement_id} style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'42px',height:'42px',borderRadius:'14px',background:move.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.35rem'}}>{move.avatar_emoji||'🧭'}</div>
            <div style={{flex:1}}><strong>{move.nickname}</strong><small style={{display:'block',color:'var(--muted)'}}>{move.reason}</small></div>
            <strong style={{color:move.amount>0?'#24715a':'#a13f3f'}}>{move.amount>0?'+':''}{move.amount}</strong>
          </article>)}
          {!historyLoading&&!pointHistory.length&&<article className="card" style={{padding:'16px'}}>Todavía no hay movimientos.</article>}
        </div>
      </section>
    </>:page==='challenges'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">MISIONES ESPECIALES</p>
        <h2 style={{marginBottom:'7px'}}>Tus retos</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Aquí aparecen sobres secretos, retos de equipo y misiones manuales.</p>
      </section>
      <section style={{display:'grid',gap:'11px',marginTop:'14px'}}>
        {specialLoading&&<article className="card" style={{padding:'18px'}}>Cargando retos…</article>}
        {!specialLoading&&specialChallenges.map(item=><article className="card" key={item.group_id} style={{padding:'19px'}}>
          <div style={{display:'flex',justifyContent:'space-between',gap:'12px'}}>
            <div>
              <p className="eyebrow" style={{marginBottom:'5px'}}>{kindLabel[item.kind]}</p>
              <h2 style={{fontSize:'1.25rem',marginBottom:'8px'}}>{item.title}</h2>
            </div>
            <span style={{fontSize:'.75rem',fontWeight:'900',padding:'7px 10px',borderRadius:'999px',background:'#eef3ef',height:'fit-content'}}>
              {statusLabel[item.group_status]}
            </span>
          </div>
          <p style={{color:'var(--muted)'}}>{item.description}</p>
          {item.kind==='secret_team'&&<p style={{fontWeight:'800'}}>Equipo: {item.member_names}</p>}
          <strong>⭐ {item.points} pt por Quester</strong>
          {(item.group_status==='pending'||item.group_status==='rejected')&&
            <button className="primary wide" style={{marginTop:'14px'}} onClick={()=>submitSpecial(item.group_id)}>
              <Send size={17}/>Enviar a revisión
            </button>}
        </article>)}
        {!specialLoading&&!specialChallenges.length&&<article className="card" style={{padding:'18px'}}>No tienes misiones especiales pendientes.</article>}
      </section>
    </>:page==='adminChallenges'&&mode==='admin'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">RETOS DEL DÍA</p>
        <h2 style={{marginBottom:'7px'}}>Selecciona el checklist del grupo</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Activa o desactiva retos. Los cambios aparecen inmediatamente en el Inicio de todos.</p>
      </section>
      <section style={{display:'grid',gap:'8px',marginTop:'13px'}}>
        {library.map(item=><button key={item.template_id} className="card" disabled={challengeBusy} onClick={()=>toggleDaily(item)} style={{
          padding:'15px 17px',display:'flex',alignItems:'center',gap:'12px',
          textAlign:'left',color:'inherit',border:item.is_active?'2px solid #2f7563':'1px solid rgba(23,63,53,.11)'
        }}>
          <span style={{width:'28px',height:'28px',borderRadius:'9px',display:'grid',placeItems:'center',background:item.is_active?'#2f7563':'#eef3ef',color:item.is_active?'white':'#62736d'}}>
            {item.is_active?<Check size={17}/>:''}
          </span>
          <span style={{flex:1}}><strong>{item.title}</strong><small style={{display:'block',color:'var(--muted)'}}>{item.description}</small></span>
          <strong>{item.points} pt</strong>
        </button>)}
      </section>

      <form className="card" onSubmit={createChallenge} style={{padding:'22px',marginTop:'22px'}}>
        <p className="eyebrow">CREAR MISIÓN ESPECIAL</p>
        <h2 style={{marginBottom:'15px'}}>Envía un reto</h2>
        <label>Tipo
          <select value={challengeForm.kind} onChange={e=>setChallengeForm({...challengeForm,kind:e.target.value,recipient_ids:[]})}>
            <option value="secret_individual">Sobre secreto individual</option>
            <option value="secret_team">Sobre secreto de equipo</option>
            <option value="manual">Reto manual</option>
          </select>
        </label>
        <label>Título<input value={challengeForm.title} onChange={e=>setChallengeForm({...challengeForm,title:e.target.value})} placeholder="La misión imposible"/></label>
        <label>Descripción<textarea rows="4" value={challengeForm.description} onChange={e=>setChallengeForm({...challengeForm,description:e.target.value})} placeholder="Explica lo que deben conseguir…"/></label>
        <label>Puntos por Quester<input type="number" min="0" step="1" value={challengeForm.points} onChange={e=>setChallengeForm({...challengeForm,points:e.target.value})}/></label>

        <div style={{display:'flex',gap:'8px',alignItems:'end',marginBottom:'12px'}}>
          <label style={{flex:1,marginBottom:0}}>Número aleatorio
            <input type="number" min="1" max={questers.length||1} value={challengeForm.random_count} onChange={e=>setChallengeForm({...challengeForm,random_count:e.target.value})}/>
          </label>
          <button type="button" className="secondary" onClick={chooseRandomRecipients}><RotateCcw size={17}/>Elegir al azar</button>
        </div>

        <p className="eyebrow" style={{marginTop:'15px'}}>DESTINATARIOS</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:'8px',marginBottom:'16px'}}>
          {questers.map(q=><button type="button" key={q.user_id} onClick={()=>toggleRecipient(q.user_id)} style={{
            border:challengeForm.recipient_ids.includes(q.user_id)?'2px solid #2f7563':'1px solid #d8d3c6',
            borderRadius:'13px',padding:'10px',background:challengeForm.recipient_ids.includes(q.user_id)?'#eef6f2':'white',
            display:'flex',alignItems:'center',gap:'8px',fontWeight:'800',color:'inherit'
          }}>
            <span>{q.avatar_emoji||'🧭'}</span>{q.nickname}
          </button>)}
        </div>
        <button className="primary wide" disabled={challengeBusy}><Send size={18}/>{challengeBusy?'Enviando…':'Enviar reto'}</button>
        {challengeMessage&&<p className="msg">{challengeMessage}</p>}
      </form>

      <section style={{marginTop:'22px'}}>
        <p className="eyebrow">PENDIENTES DE VALIDAR</p>
        <div style={{display:'grid',gap:'10px'}}>
          {adminDailyReviews.map(item=><article className="card" key={item.progress_id} style={{padding:'17px'}}>
            <strong>{item.nickname} · {item.title}</strong>
            <small style={{display:'block',color:'var(--muted)',margin:'5px 0 12px'}}>Reto diario · {item.points} pt</small>
            <div className="actions">
              <button className="primary" disabled={challengeBusy} onClick={()=>reviewDaily(item.progress_id,true)}><Check size={17}/>Aprobar</button>
              <button className="secondary" disabled={challengeBusy} onClick={()=>reviewDaily(item.progress_id,false)}>Rechazar</button>
            </div>
          </article>)}
          {adminSpecialReviews.map(item=><article className="card" key={item.group_id} style={{padding:'17px'}}>
            <strong>{item.title}</strong>
            <small style={{display:'block',color:'var(--muted)',margin:'5px 0'}}>Integrantes: {item.member_names}</small>
            <small style={{display:'block',color:'var(--muted)',marginBottom:'12px'}}>{item.points} pt por integrante</small>
            <div className="actions">
              <button className="primary" disabled={challengeBusy} onClick={()=>reviewSpecial(item.group_id,true)}><Check size={17}/>Aprobar</button>
              <button className="secondary" disabled={challengeBusy} onClick={()=>reviewSpecial(item.group_id,false)}>Rechazar</button>
            </div>
          </article>)}
          {!adminDailyReviews.length&&!adminSpecialReviews.length&&<article className="card" style={{padding:'17px'}}>No hay retos esperando validación.</article>}
        </div>
      </section>
    </>:page==='points'&&mode==='admin'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">ADMINISTRAR PUNTOS</p>
        <h2 style={{marginBottom:'7px'}}>Actualiza la clasificación</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Usa cantidades positivas para sumar y negativas para restar.</p>
      </section>
      <form className="card" onSubmit={adjustPoints} style={{padding:'20px',marginTop:'14px'}}>
        <label>Quester<select value={pointsForm.user_id} onChange={e=>setPointsForm({...pointsForm,user_id:e.target.value})}><option value="">Selecciona un Quester</option>{questers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}</select></label>
        <label>Puntos<input type="number" step="1" value={pointsForm.amount} onChange={e=>setPointsForm({...pointsForm,amount:e.target.value})}/></label>
        <label>Motivo<input value={pointsForm.reason} onChange={e=>setPointsForm({...pointsForm,reason:e.target.value})} placeholder="Reto completado, penalización…"/></label>
        <button className="primary wide" disabled={pointsBusy}><Star size={18}/>{pointsBusy?'Guardando…':'Registrar puntos'}</button>
        {pointsMessage&&<p className="msg">{pointsMessage}</p>}
      </form>
    </>:page==='questers'?<>
      <section className="card" style={{padding:'22px'}}>
        <p className="eyebrow">{mode==='admin'?'GESTIÓN DE LA AVENTURA':'COMPAÑEROS DE VIAJE'}</p>
        <h2 style={{marginBottom:'8px'}}>{questers.length} {questers.length===1?'Quester':'Questers'}</h2>
      </section>
      <section style={{display:'grid',gap:'10px',marginTop:'14px'}}>
        {questersLoading&&<article className="card" style={{padding:'18px'}}>Cargando Questers…</article>}
        {questersError&&<article className="card" style={{padding:'18px',color:'#a13f3f'}}>{questersError}</article>}
        {!questersLoading&&!questersError&&questers.map(q=>
          <article className="card" key={q.user_id} style={{padding:'17px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'17px',background:q.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.7rem'}}>{q.avatar_emoji||'🧭'}</div>
            <div style={{flex:1}}><strong>{q.nickname}</strong><small style={{display:'block',color:'var(--muted)'}}>{q.member_role==='owner'?'Creador · Admin':'Quester'}</small></div>
          </article>
        )}
      </section>
    </>:<>
      <section className="card" style={{padding:'24px'}}>
        <p className="eyebrow">PRÓXIMO SPRINT</p>
        <h2>{page==='advantages'?'🎒 Ventajas':'Sección'}</h2>
        <p style={{color:'var(--muted)'}}>Esta sección se incorporará en los siguientes sprints.</p>
      </section>
    </>}

    {mode==='player'&&<nav style={{
      position:'fixed',left:'50%',transform:'translateX(-50%)',
      bottom:'max(10px, env(safe-area-inset-bottom))',
      width:'min(620px, calc(100% - 20px))',padding:'7px',
      borderRadius:'20px',background:'rgba(255,253,247,.96)',
      border:'1px solid rgba(23,63,53,.13)',
      boxShadow:'0 16px 38px rgba(23,63,53,.2)',
      display:'grid',gridTemplateColumns:'repeat(4,1fr)',
      gap:'5px',zIndex:10,backdropFilter:'blur(12px)'
    }}>
      {playerNav.map(item=>{
        const count=item.id==='ranking'?notificationCounts.ranking:item.id==='challenges'?notificationCounts.challenges:item.id==='advantages'?notificationCounts.advantages:0;
        return <button key={item.id} onClick={()=>openPage(item.id)} style={{
          border:0,borderRadius:'14px',padding:'9px 5px',
          display:'grid',justifyItems:'center',gap:'3px',
          background:page===item.id?'#173f35':'transparent',
          color:page===item.id?'white':'#62736d',
          fontWeight:'850',fontSize:'.72rem',position:'relative'
        }}>
          <span style={{position:'relative',display:'inline-flex'}}>
            {item.icon}
            {count>0&&<span style={{
              position:'absolute',right:'-12px',top:'-8px',
              minWidth:'19px',height:'19px',padding:'0 5px',
              borderRadius:'999px',background:'#e05b4f',color:'white',
              border:'2px solid #fffdf7',display:'grid',placeItems:'center',
              fontSize:'.65rem',fontWeight:'950'
            }}>{count>99?'99+':count}</span>}
          </span>
          <span>{item.label}</span>
        </button>
      })}
    </nav>}
  </main>
}
function Dashboard({session}){
  const[memberships,setMemberships]=useState([]);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(null);
  const[selected,setSelected]=useState(null);
  const[profileOpen,setProfileOpen]=useState(false);
  const[profile,setProfile]=useState({nickname:'',avatar_emoji:'🧭',profile_color:'#dfeee7'});
  const[profileSaving,setProfileSaving]=useState(false);
  const[profileMessage,setProfileMessage]=useState('');
  const[menuGameId,setMenuGameId]=useState(null);
  const[editingMembership,setEditingMembership]=useState(null);
  const[editGame,setEditGame]=useState(emptyGame);
  const[editBusy,setEditBusy]=useState(false);
  const[editMessage,setEditMessage]=useState('');
  const[deleteMembership,setDeleteMembership]=useState(null);
  const[deleteText,setDeleteText]=useState('');
  const[deleteBusy,setDeleteBusy]=useState(false);
  const[deleteMessage,setDeleteMessage]=useState('');

  async function load(){
    setLoading(true);
    const{data,error}=await supabase.rpc('list_my_tripquest_games_v2');
    if(error){
      console.error('Error cargando aventuras:',error);
      setMemberships([]);
      setLoading(false);
      return;
    }
    setMemberships((data||[]).map(row=>({
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
    })));
    setLoading(false);
  }

  useEffect(()=>{load();loadProfile()},[]);

  async function loadProfile(){
    const{data,error}=await supabase.from('profiles')
      .select('nickname,avatar_emoji,profile_color')
      .eq('id',session.user.id)
      .single();
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
  }

  function openEdit(membership){
    setMenuGameId(null);
    setEditingMembership(membership);
    setEditGame({
      name:membership.games.name,
      emoji:membership.games.emoji,
      start_date:membership.games.start_date,
      end_date:membership.games.end_date,
      description:membership.games.description||''
    });
    setEditMessage('');
  }

  async function saveAdventure(e){
    e.preventDefault();
    setEditBusy(true);
    setEditMessage('');
    const{error}=await supabase.rpc('update_tripquest_game',{
      p_game_id:editingMembership.games.id,
      p_name:editGame.name.trim(),
      p_emoji:editGame.emoji||'🧭',
      p_start_date:editGame.start_date,
      p_end_date:editGame.end_date,
      p_description:editGame.description.trim()||null
    });
    if(error){
      setEditMessage(error.message);
    }else{
      setEditingMembership(null);
      await load();
    }
    setEditBusy(false);
  }

  function openDelete(membership){
    setMenuGameId(null);
    setDeleteMembership(membership);
    setDeleteText('');
    setDeleteMessage('');
  }

  async function confirmDeleteOrLeave(){
    if(!deleteMembership)return;
    setDeleteBusy(true);
    setDeleteMessage('');
    const isOwner=deleteMembership.role==='owner';

    if(isOwner&&deleteText.trim()!==deleteMembership.games.name){
      setDeleteMessage('Escribe exactamente el nombre de la aventura.');
      setDeleteBusy(false);
      return;
    }

    const fn=isOwner?'delete_tripquest_game':'leave_tripquest_game';
    const{error}=await supabase.rpc(fn,{p_game_id:deleteMembership.games.id});
    if(error){
      setDeleteMessage(error.message);
    }else{
      setDeleteMembership(null);
      await load();
    }
    setDeleteBusy(false);
  }

  if(selected)return <Game membership={selected} onBack={()=>setSelected(null)}/>;

  const nick=profile.nickname||session.user.user_metadata?.nickname||session.user.email?.split('@')[0];

  return <main className="shell">
    <header className="top">
      <div>
        <p className="eyebrow">BIENVENIDO, QUESTER</p>
        <h1>Hola, {nick}</h1>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button className="secondary" style={{padding:'11px 13px'}} onClick={()=>setProfileOpen(true)}>
          <span style={{fontSize:'1.25rem'}}>{profile.avatar_emoji||'🧭'}</span>
          <span>Mi perfil</span>
        </button>
        <button className="icon" onClick={()=>supabase.auth.signOut()}><LogOut/></button>
      </div>
    </header>

    <section className="heading">
      <div><p className="eyebrow">MIS AVENTURAS</p><h2>Mis aventuras</h2></div>
      <div className="actions">
        <button className="primary" onClick={()=>setModal('create')}><Plus size={18}/>Crear</button>
        <button className="secondary" onClick={()=>setModal('join')}><KeyRound size={18}/>Unirme</button>
      </div>
    </section>

    {loading?<p>Cargando…</p>:memberships.length?<section className="games">
      {memberships.map(m=><article className="card" key={m.id} style={{position:'relative',padding:'0'}}>
        <button className="game" style={{width:'100%',boxShadow:'none',border:0,background:'transparent',paddingRight:'56px'}} onClick={()=>setSelected(m)}>
          <span className="emoji">{m.games.emoji}</span>
          <span><strong>{m.games.name}</strong><small>{tripStatus(m.games.start_date,m.games.end_date)}</small></span>
          <em style={{display:'grid',gap:'4px',justifyItems:'end'}}>
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}><Users size={16}/>{m.games.member_count}</span>
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}><CalendarDays size={16}/>{new Date(m.games.start_date+'T00:00:00').toLocaleDateString('es-ES')}</span>
          </em>
        </button>

        <button className="icon" onClick={e=>{e.stopPropagation();setMenuGameId(menuGameId===m.games.id?null:m.games.id)}} style={{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)'}}>
          <MoreVertical size={20}/>
        </button>

        {menuGameId===m.games.id&&<div className="card" style={{
          position:'absolute',
          right:'8px',
          top:'calc(50% + 28px)',
          zIndex:20,
          padding:'8px',
          minWidth:'175px',
          boxShadow:'0 18px 40px rgba(23,63,53,.22)'
        }}>
          {m.role==='owner'&&<button className="secondary wide" style={{justifyContent:'flex-start',marginBottom:'6px'}} onClick={()=>openEdit(m)}>
            <Pencil size={17}/>Editar aventura
          </button>}
          <button className="secondary wide" style={{justifyContent:'flex-start',color:m.role==='owner'?'#a13f3f':'inherit'}} onClick={()=>openDelete(m)}>
            {m.role==='owner'?<Trash2 size={17}/>:<DoorOpen size={17}/>}
            {m.role==='owner'?'Eliminar aventura':'Salir de la aventura'}
          </button>
        </div>}
      </article>)}
    </section>:<section className="card empty">
      <div>🌍</div>
      <p className="eyebrow">TU PRIMERA AVENTURA</p>
      <h2>El viaje puede empezar hoy.</h2>
      <p>Crea una aventura o únete con un código.</p>
    </section>}

    {modal&&<Modal type={modal} onClose={()=>setModal(null)} onDone={()=>{setModal(null);load()}}/>}

    {editingMembership&&<div className="backdrop">
      <form className="card modal" onSubmit={saveAdventure}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div><p className="eyebrow">EDITAR AVENTURA</p><h2 style={{marginBottom:0}}>{editingMembership.games.name}</h2></div>
          <button type="button" className="icon" onClick={()=>setEditingMembership(null)}><X/></button>
        </div>
        <label>Nombre<input required value={editGame.name} onChange={e=>setEditGame({...editGame,name:e.target.value})}/></label>
        <label>Emoji<input required maxLength="4" value={editGame.emoji} onChange={e=>setEditGame({...editGame,emoji:e.target.value})}/></label>
        <div className="cols">
          <label>Empieza<input required type="date" value={editGame.start_date} onChange={e=>setEditGame({...editGame,start_date:e.target.value})}/></label>
          <label>Termina<input required type="date" value={editGame.end_date} onChange={e=>setEditGame({...editGame,end_date:e.target.value})}/></label>
        </div>
        <label>Descripción<textarea rows="3" value={editGame.description} onChange={e=>setEditGame({...editGame,description:e.target.value})}/></label>
        <button className="primary wide" disabled={editBusy}>{editBusy?'Guardando…':'Guardar cambios'}</button>
        {editMessage&&<p className="msg">{editMessage}</p>}
      </form>
    </div>}

    {deleteMembership&&<div className="backdrop">
      <section className="card modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div>
            <p className="eyebrow">{deleteMembership.role==='owner'?'ELIMINAR AVENTURA':'SALIR DE LA AVENTURA'}</p>
            <h2 style={{marginBottom:0}}>{deleteMembership.games.name}</h2>
          </div>
          <button type="button" className="icon" onClick={()=>setDeleteMembership(null)}><X/></button>
        </div>

        {deleteMembership.role==='owner'?<>
          <p style={{color:'var(--muted)'}}>Se borrarán definitivamente Questers, puntos, retos, etapas, subastas y ventajas de esta aventura.</p>
          <label>Escribe el nombre exacto para confirmar
            <input value={deleteText} onChange={e=>setDeleteText(e.target.value)} placeholder={deleteMembership.games.name}/>
          </label>
          <button className="wide" onClick={confirmDeleteOrLeave} disabled={deleteBusy} style={{
            border:0,borderRadius:'13px',padding:'13px 16px',fontWeight:'900',background:'#a13f3f',color:'white'
          }}>{deleteBusy?'Eliminando…':'Eliminar definitivamente'}</button>
        </>:<>
          <p style={{color:'var(--muted)'}}>Dejarás de ver esta aventura y tus datos de participación se eliminarán de ella.</p>
          <button className="wide" onClick={confirmDeleteOrLeave} disabled={deleteBusy} style={{
            border:0,borderRadius:'13px',padding:'13px 16px',fontWeight:'900',background:'#a13f3f',color:'white'
          }}>{deleteBusy?'Saliendo…':'Salir de la aventura'}</button>
        </>}
        {deleteMessage&&<p className="msg">{deleteMessage}</p>}
      </section>
    </div>}

    {profileOpen&&<div className="backdrop">
      <form className="card modal" onSubmit={saveProfile}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div><p className="eyebrow">MI PERFIL</p><h2 style={{marginBottom:0}}>Personaliza tu Quester</h2></div>
          <button type="button" className="icon" onClick={()=>setProfileOpen(false)}><X/></button>
        </div>
        <div style={{width:'88px',height:'88px',borderRadius:'26px',background:profile.profile_color,display:'grid',placeItems:'center',fontSize:'3rem',margin:'8px auto 20px'}}>
          {profile.avatar_emoji||'🧭'}
        </div>
        <label>Nickname<input required maxLength="30" value={profile.nickname} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label>
        <label>Emoji<input required maxLength="4" value={profile.avatar_emoji} onChange={e=>setProfile({...profile,avatar_emoji:e.target.value})} placeholder="🧭"/></label>
        <label>Color<div style={{display:'grid',gridTemplateColumns:'70px 1fr',gap:'10px',alignItems:'center'}}>
          <input type="color" value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})} style={{height:'48px',padding:'5px'}}/>
          <input value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})}/>
        </div></label>
        <button className="primary wide" disabled={profileSaving}>{profileSaving?'Guardando…':'Guardar cambios'}</button>
        {profileMessage&&<p className="msg">{profileMessage}</p>}
      </form>
    </div>}
  </main>
}
function EmailConfirmed({session,onContinue}){
  return <main className="auth">
    <section className="brand">
      <div className="mark"><CheckCircle2 size={42}/></div>
      <p className="eyebrow">EMAIL CONFIRMADO</p>
      <h1>¡Ya eres Quester!</h1>
      <p className="lead">Tu correo se ha confirmado correctamente. Ya puedes acceder a TripQuest.</p>
    </section>
    <section className="card authCard" style={{textAlign:'center'}}>
      <div style={{fontSize:'4rem',marginBottom:'12px'}}>🎉</div>
      <h2>Cuenta activada</h2>
      <p style={{color:'var(--muted)'}}>{session?'Tu sesión ya está lista.':'Inicia sesión con tu email y contraseña.'}</p>
      <button className="primary wide" onClick={onContinue}>
        {session?'Entrar en TripQuest':'Ir al inicio de sesión'}
      </button>
    </section>
  </main>
}

export default function App(){
  const[session,setSession]=useState(null);
  const[ready,setReady]=useState(false);
  const[confirmed,setConfirmed]=useState(()=>new URLSearchParams(window.location.search).get('email_confirmed')==='1');

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});
    const{data}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);setReady(true)});
    return()=>data.subscription.unsubscribe()
  },[]);

  function continueAfterConfirmation(){
    window.history.replaceState({},'',window.location.pathname);
    setConfirmed(false)
  }

  if(!ready)return <div className="splash"><Compass size={48}/><strong>TripQuest</strong></div>;
  if(confirmed)return <EmailConfirmed session={session} onContinue={continueAfterConfirmation}/>;
  return session?<Dashboard session={session}/>:<Auth/>
}
