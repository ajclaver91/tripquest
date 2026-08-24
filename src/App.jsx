import React,{useEffect,useState} from 'react'
import {Compass,Plus,KeyRound,LogOut,ArrowLeft,Settings,UserRound,CalendarDays,Copy,Share2,Crown,Users,X,Home,Trophy,Target,Backpack,Star,CheckCircle2,MoreVertical,Pencil,Trash2,DoorOpen,Lock,Handshake,Send,Check,Clock3,Shuffle,PackageOpen,Map,Gift,ShieldCheck,Play,Archive,Undo2,Gavel,Dices,Save,LockKeyhole,Hotel,Navigation,Clock,ExternalLink,ChevronDown,ChevronUp,GripVertical,Power,RefreshCcw,Eraser,Database,UserPlus,UserMinus,Wallet,Receipt,ArrowRightLeft,Phone} from 'lucide-react'
import {supabase} from './supabase'

const APP_VERSION='1.0.0'
const LEGAL_OWNER='PENDIENTE: nombre completo o denominación del responsable'
const LEGAL_EMAIL='PENDIENTE: correo de contacto'
const LEGAL_COUNTRY='España'
const LEGAL_UPDATED='6 de agosto de 2026'


const emptyGame={name:'',emoji:'🧭',start_date:'',end_date:'',description:''}
const tripStatus=(s,e)=>{if(!s||!e)return'Fechas por definir';const t=new Date();t.setHours(0,0,0,0);const a=new Date(s+'T00:00:00'),b=new Date(e+'T00:00:00'),d=86400000;if(t<a){const n=Math.ceil((a-t)/d);return n===1?'Empieza mañana':`Empieza en ${n} días`}if(t>b)return'Aventura finalizada';return`Día ${Math.floor((t-a)/d)+1} de ${Math.floor((b-a)/d)+1}`}


const legalSections={
  privacy:{
    eyebrow:'PRIVACIDAD',
    title:'Política de privacidad',
    content:<>
      <h3>1. Responsable</h3>
      <p><strong>{LEGAL_OWNER}</strong>, con contacto en <strong>{LEGAL_EMAIL}</strong>, es responsable del tratamiento de los datos utilizados en Brinkkando.</p>

      <h3>2. Datos tratados</h3>
      <p>Brinkkando puede tratar el correo electrónico, nickname, emoji y color de perfil, participación en Brinkkandos, puntuaciones, retos, pujas, objetos y contenido que los propios usuarios introduzcan.</p>

      <h3>3. Finalidades y base jurídica</h3>
      <p>Los datos se utilizan para crear y mantener la cuenta, permitir el acceso a Brinkkandos, ejecutar sus funciones y atender solicitudes. La base principal es la ejecución del servicio solicitado por el usuario. Cuando una función requiera consentimiento, se solicitará de forma separada.</p>

      <h3>4. Proveedores</h3>
      <p>La autenticación y la base de datos se prestan mediante Supabase. El alojamiento y despliegue web se realizan mediante Netlify. Estos proveedores pueden tratar datos por cuenta del responsable conforme a sus condiciones y garantías aplicables.</p>

      <h3>5. Conservación</h3>
      <p>Los datos se conservarán mientras la cuenta o los Brinkkandos asociados permanezcan activos y, después, durante el tiempo estrictamente necesario para atender responsabilidades legales o técnicas.</p>

      <h3>6. Destinatarios y transferencias</h3>
      <p>Los datos no se venden. Pueden comunicarse a proveedores tecnológicos necesarios para prestar el servicio o cuando exista una obligación legal. Algunos proveedores pueden operar fuera del Espacio Económico Europeo y aplicar los mecanismos legales correspondientes.</p>

      <h3>7. Derechos</h3>
      <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad escribiendo a <strong>{LEGAL_EMAIL}</strong>. También puedes reclamar ante la Agencia Española de Protección de Datos.</p>

      <h3>8. Menores</h3>
      <p>Brinkkando no está dirigido a menores que no puedan consentir válidamente el tratamiento de sus datos. Si se detecta una cuenta creada sin la autorización necesaria, podrá eliminarse.</p>

      <h3>9. Seguridad y cambios</h3>
      <p>Se aplican medidas técnicas razonables, como autenticación y reglas de acceso en la base de datos. Ningún sistema es completamente infalible. Esta política podrá actualizarse cuando cambie el servicio o la normativa.</p>
    </>
  },
  terms:{
    eyebrow:'CONDICIONES',
    title:'Términos de uso',
    content:<>
      <h3>1. Objeto</h3>
      <p>Brinkkando permite organizar planes privados y añadir dinámicas de juego, puntos, retos, objetos, subastas y jornadas.</p>

      <h3>2. Cuenta y acceso</h3>
      <p>El usuario debe facilitar datos correctos, custodiar su contraseña y avisar de accesos no autorizados. Los códigos de unión deben compartirse únicamente con las personas que deban participar.</p>

      <h3>3. Responsabilidad del administrador</h3>
      <p>Quien crea un Brinkkando decide sus integrantes, contenidos, puntos, retos y reglas. Debe evitar pruebas peligrosas, ilegales, humillantes, discriminatorias o que afecten a terceros sin permiso.</p>

      <h3>4. Conducta</h3>
      <p>No se permite utilizar Brinkkando para acosar, amenazar, suplantar identidades, difundir contenido ilícito, vulnerar derechos, acceder a cuentas ajenas o interferir en la seguridad del servicio.</p>

      <h3>5. Actividades y desplazamientos</h3>
      <p>Brinkkando es una herramienta organizativa y lúdica. No verifica rutas, reservas, horarios, condiciones meteorológicas ni la seguridad de las actividades. Cada usuario debe comprobar la información y actuar con prudencia.</p>

      <h3>6. Disponibilidad</h3>
      <p>El servicio puede sufrir interrupciones, errores o pérdida de disponibilidad. Mientras se ofrece gratuitamente y en fase inicial, no se garantiza continuidad permanente ni ausencia total de fallos.</p>

      <h3>7. Propiedad intelectual</h3>
      <p>La marca, interfaz, textos propios y código de Brinkkando están protegidos por la normativa aplicable. El usuario conserva los derechos sobre el contenido que aporte y autoriza su tratamiento para prestar el servicio.</p>

      <h3>8. Suspensión y baja</h3>
      <p>Las cuentas o Brinkkandos que incumplan estas condiciones pueden suspenderse o eliminarse. El usuario puede solicitar la supresión de su cuenta mediante el canal indicado en la Política de privacidad.</p>

      <h3>9. Ley aplicable</h3>
      <p>Estas condiciones se interpretan conforme a la legislación española, sin perjuicio de los derechos imperativos que correspondan al consumidor.</p>
    </>
  },
  cookies:{
    eyebrow:'COOKIES',
    title:'Política de cookies y almacenamiento local',
    content:<>
      <h3>1. Situación actual</h3>
      <p>La versión actual de Brinkkando no incorpora publicidad ni herramientas propias de analítica o seguimiento comercial.</p>

      <h3>2. Tecnologías necesarias</h3>
      <p>Supabase Auth puede utilizar almacenamiento local del navegador y tecnologías equivalentes para mantener la sesión iniciada y proteger el acceso. Son necesarias para prestar el servicio solicitado.</p>

      <h3>3. Cookies no esenciales</h3>
      <p>Mientras Brinkkando no instale cookies analíticas, publicitarias o de personalización no solicitada, no se muestra un banner de aceptación. Si se incorporan estas tecnologías, esta política y el mecanismo de consentimiento deberán actualizarse antes de activarlas.</p>

      <h3>4. Control</h3>
      <p>Puedes borrar el almacenamiento y las cookies desde la configuración del navegador. Si eliminas los datos de sesión, tendrás que volver a iniciar sesión.</p>
    </>
  },
  legal:{
    eyebrow:'INFORMACIÓN LEGAL',
    title:'Aviso legal',
    content:<>
      <h3>1. Titular</h3>
      <p>Titular: <strong>{LEGAL_OWNER}</strong></p>
      <p>Correo de contacto: <strong>{LEGAL_EMAIL}</strong></p>
      <p>País de establecimiento: <strong>{LEGAL_COUNTRY}</strong></p>

      <h3>2. Servicio</h3>
      <p>Brinkkando es una aplicación web para organizar planes y dinámicas privadas entre grupos. En esta fase se ofrece gratuitamente y sin garantías comerciales adicionales.</p>

      <h3>3. Uso de la web</h3>
      <p>El acceso implica utilizar el servicio de forma lícita, respetar a otros usuarios y no intentar comprometer su funcionamiento, sus datos o sus sistemas.</p>

      <h3>4. Enlaces externos</h3>
      <p>Los usuarios pueden añadir enlaces a mapas, reservas o servicios de terceros. Brinkkando no controla ni responde del contenido, disponibilidad o condiciones de esas páginas.</p>

      <h3>5. Contacto</h3>
      <p>Para cuestiones legales, de privacidad o relacionadas con el servicio, utiliza <strong>{LEGAL_EMAIL}</strong>.</p>
    </>
  }
}

function LegalModal({section,onClose}){
  const legal=legalSections[section]
  if(!legal)return null
  return <div className="backdrop" style={{zIndex:50}}>
    <section className="card modal" style={{maxHeight:'88vh',overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'12px'}}>
        <div><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{legal.eyebrow}</p><h2 style={{marginBottom:0}}>{legal.title}</h2></div>
        <button type="button" className="icon" onClick={onClose}><X/></button>
      </div>
      <div style={{lineHeight:1.55}}>{legal.content}</div>
      <small style={{display:'block',color:'var(--muted)',marginTop:'18px'}}>Última actualización: {LEGAL_UPDATED}</small>
    </section>
  </div>
}

function LegalLinks({onOpen,compact=false}){
  return <footer style={{
    marginTop:compact?'14px':'28px',
    padding:'18px 8px',
    textAlign:'center',
    color:'var(--muted)',
    fontSize:'.78rem'
  }}>
    <div style={{display:'flex',justifyContent:'center',gap:'10px',flexWrap:'wrap'}}>
      <button type="button" onClick={()=>onOpen('legal')} style={{border:0,background:'transparent',color:'inherit',textDecoration:'underline'}}>Aviso legal</button>
      <button type="button" onClick={()=>onOpen('privacy')} style={{border:0,background:'transparent',color:'inherit',textDecoration:'underline'}}>Privacidad</button>
      <button type="button" onClick={()=>onOpen('cookies')} style={{border:0,background:'transparent',color:'inherit',textDecoration:'underline'}}>Cookies</button>
      <button type="button" onClick={()=>onOpen('terms')} style={{border:0,background:'transparent',color:'inherit',textDecoration:'underline'}}>Términos</button>
    </div>
    <div style={{marginTop:'8px'}}>© 2026 Brinkkando · v{APP_VERSION}</div>
  </footer>
}

function Auth(){
  const[register,setRegister]=useState(false)
  const[forgot,setForgot]=useState(false)
  const[f,setF]=useState({nickname:'',email:'',password:''})
  const[accepted,setAccepted]=useState(false)
  const[legalOpen,setLegalOpen]=useState(null)
  const[msg,setMsg]=useState('')
  const[busy,setBusy]=useState(false)

  async function submit(e){
    e.preventDefault()
    if(register&&!accepted){
      setMsg('Debes aceptar los Términos de uso y la Política de privacidad.')
      return
    }
    setBusy(true)
    setMsg('')

    if(forgot){
      const{error}=await supabase.auth.resetPasswordForEmail(
        f.email.trim(),
        {redirectTo:`${window.location.origin}/?password_recovery=1`}
      )
      setMsg(
        error
          ?error.message
          :'Te hemos enviado un enlace. Revisa también la carpeta de spam.'
      )
      setBusy(false)
      return
    }

    const r=register
      ?await supabase.auth.signUp({
        email:f.email.trim(),
        password:f.password,
        options:{
          data:{
            nickname:f.nickname.trim(),
            legal_version:APP_VERSION,
            legal_accepted_at:new Date().toISOString()
          },
          emailRedirectTo:`${window.location.origin}/?email_confirmed=1`
        }
      })
      :await supabase.auth.signInWithPassword({
        email:f.email.trim(),
        password:f.password
      })

    if(r.error)setMsg(r.error.message)
    else if(register)setMsg('Cuenta creada. Revisa el correo si se exige confirmación.')
    setBusy(false)
  }

  function showLogin(){
    setForgot(false)
    setRegister(false)
    setMsg('')
  }

  return <main className="auth">
    <section className="brand">
      <div className="mark"><Compass size={42}/></div>
      <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>BRINKKANDO</p>
      <h1>{forgot?'Recupera tu cuenta.':'Cada plan merece un Brinkkando.'}</h1>
      <p className="lead">
        {forgot
          ?'Te enviaremos un enlace seguro para que puedas elegir una contraseña nueva.'
          :'Crea un Brinkkando, invita a tus Brinkkers y convierte cualquier plan en un juego compartido.'}
      </p>
    </section>

    <form className="card authCard" onSubmit={submit}>
      {!forgot&&<div className="switch">
        <button type="button" className={!register?'active':''}
          onClick={()=>{setRegister(false);setMsg('')}}>
          Entrar
        </button>
        <button type="button" className={register?'active':''}
          onClick={()=>{setRegister(true);setMsg('')}}>
          Crear cuenta
        </button>
      </div>}

      {forgot&&<>
        <button type="button" className="secondary" style={{marginBottom:'14px'}}
          onClick={showLogin}>
          <ArrowLeft size={17}/>Volver
        </button>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>RECUPERAR CONTRASEÑA</p>
        <h2 style={{marginBottom:'12px'}}>¿Cuál es tu correo?</h2>
      </>}

      {register&&!forgot&&<label>¿Cómo te llamamos?
        <input required value={f.nickname}
          onChange={e=>setF({...f,nickname:e.target.value})}
          placeholder="Tu nick"/>
      </label>}

      <label>Email
        <input required type="email" value={f.email}
          onChange={e=>setF({...f,email:e.target.value})}/>
      </label>

      {!forgot&&<label>Contraseña
        <input required minLength="6" type="password" value={f.password}
          onChange={e=>setF({...f,password:e.target.value})}/>
      </label>}

      {register&&!forgot&&<label style={{
        display:'flex',
        alignItems:'flex-start',
        gap:'9px',
        fontWeight:'700',
        fontSize:'.82rem',
        lineHeight:1.4
      }}>
        <input type="checkbox" required checked={accepted}
          onChange={e=>setAccepted(e.target.checked)}
          style={{width:'18px',height:'18px',marginTop:'2px',flexShrink:0}}/>
        <span>
          Acepto los{' '}
          <button type="button" onClick={()=>setLegalOpen('terms')} style={{
            border:0,background:'transparent',padding:0,color:'inherit',
            textDecoration:'underline',fontWeight:'900'
          }}>Términos de uso</button>
          {' '}y he leído la{' '}
          <button type="button" onClick={()=>setLegalOpen('privacy')} style={{
            border:0,background:'transparent',padding:0,color:'inherit',
            textDecoration:'underline',fontWeight:'900'
          }}>Política de privacidad</button>.
        </span>
      </label>}

      <button className="primary wide" disabled={busy}>
        {busy
          ?'Un momento…'
          :forgot
            ?'Enviar enlace'
            :register
              ?'Crear mi cuenta'
              :'Entrar'}
      </button>

      {!register&&!forgot&&<button type="button"
        onClick={()=>{setForgot(true);setMsg('')}}
        style={{
          width:'100%',
          border:0,
          background:'transparent',
          color:'var(--muted)',
          textDecoration:'underline',
          fontWeight:'850',
          marginTop:'12px'
        }}>
        He olvidado mi contraseña
      </button>}

      {msg&&<p className="msg" style={{
      marginTop:'10px',padding:'10px 12px',borderRadius:'12px',
      background:'#f3f0e8',fontSize:'.84rem',lineHeight:1.4
    }}>{msg}</p>}
      <LegalLinks onOpen={setLegalOpen} compact/>
    </form>

    {legalOpen&&<LegalModal section={legalOpen} onClose={()=>setLegalOpen(null)}/>}
  </main>
}

function Modal({type,onClose,onDone}){const[game,setGame]=useState(emptyGame),[code,setCode]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);let r;if(type==='create')r=await supabase.rpc('create_tripquest_game',{p_name:game.name.trim(),p_emoji:game.emoji||'🧭',p_start_date:game.start_date,p_end_date:game.end_date,p_description:game.description.trim()||null});else r=await supabase.rpc('join_tripquest_game',{p_invite_code:code.trim().toUpperCase()});if(r.error)setMsg(r.error.message);else onDone();setBusy(false)}return <div className="backdrop"><form className="card modal" onSubmit={submit}><button type="button" className="icon" onClick={onClose}><ArrowLeft/></button>{type==='create'?<><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>NUEVO BRINKKANDO</p><h2>¿Cómo empieza vuestra historia?</h2><label>Nombre<input required value={game.name} onChange={e=>setGame({...game,name:e.target.value})} placeholder="Galicia 2026"/></label><label>Emoji<input required maxLength="4" value={game.emoji} onChange={e=>setGame({...game,emoji:e.target.value})}/></label><div className="cols"><label>Empieza<input required type="date" value={game.start_date} onChange={e=>setGame({...game,start_date:e.target.value})}/></label><label>Termina<input required type="date" value={game.end_date} onChange={e=>setGame({...game,end_date:e.target.value})}/></label></div><label>Descripción<textarea rows="3" value={game.description} onChange={e=>setGame({...game,description:e.target.value})}/></label></>:<><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>UNIRME</p><h2>Introduce el código</h2><input required className="code" maxLength="6" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="A7K2P9"/></>}<button className="primary wide" disabled={busy}>{busy?'Un momento…':type==='create'?'Crear Brinkkando':'Unirme'}</button>{msg&&<p className="msg" style={{
      marginTop:'10px',padding:'10px 12px',borderRadius:'12px',
      background:'#f3f0e8',fontSize:'.84rem',lineHeight:1.4
    }}>{msg}</p>}</form></div>}


class BrinkkandoErrorBoundary extends React.Component{
  constructor(props){
    super(props);
    this.state={hasError:false,error:null};
  }
  static getDerivedStateFromError(error){
    return {hasError:true,error};
  }
  componentDidCatch(error,info){
    console.error('Brinkkando render error:',error,info);
  }
  render(){
    if(this.state.hasError){
      return <main className="shell" style={{padding:'22px'}}>
        <section className="card" style={{padding:'20px'}}>
          <p className="eyebrow">BRINKKANDO</p>
          <h2 style={{marginBottom:'8px'}}>Ha ocurrido un error al abrir esta pantalla</h2>
          <p style={{color:'var(--muted)'}}>
            Tus datos siguen guardados. Recarga la página y, si vuelve a ocurrir,
            copia el mensaje inferior.
          </p>
          <code style={{
            display:'block',whiteSpace:'pre-wrap',overflowWrap:'anywhere',
            padding:'12px',borderRadius:'12px',background:'#f3f0e8',
            fontSize:'.8rem'
          }}>{String(this.state.error?.message||this.state.error||'Error desconocido')}</code>
          <button className="primary wide" style={{marginTop:'14px'}}
            onClick={()=>window.location.reload()}>
            Recargar Brinkkando
          </button>
        </section>
      </main>;
    }
    return this.props.children;
  }
}

function Game({membership,onBack,session}){
  const[mode,setMode]=useState('player');
  const[page,setPage]=useState('home');
  const[copied,setCopied]=useState(false);
  const[brinkkers,setBrinkkers]=useState([]);
  const[brinkkersLoading,setBrinkkersLoading]=useState(false);
  const[brinkkersError,setBrinkkersError]=useState('');
  const[ranking,setRanking]=useState([]);
  const[rankingLoading,setRankingLoading]=useState(false);
  const[rankingError,setRankingError]=useState('');
  const[pointsForm,setPointsForm]=useState({user_id:'',amount:'10',reason:''});
  const[pointsBusy,setPointsBusy]=useState(false);
  const[pointsMessage,setPointsMessage]=useState('');
  const[pointHistory,setPointHistory]=useState([]);
  const[historyLoading,setHistoryLoading]=useState(false);
  const[historyOpen,setHistoryOpen]=useState(false);
  const[historyShowAll,setHistoryShowAll]=useState(false);
  const[notificationCounts,setNotificationCounts]=useState({ranking:0,challenges:0,advantages:0,admin:0});

  const[dailyChallenges,setDailyChallenges]=useState([]);
  const[dailyLoading,setDailyLoading]=useState(false);const[dailyError,setDailyError]=useState('');const[expandedDailyChallenge,setExpandedDailyChallenge]=useState(null);
  const[specialChallenges,setSpecialChallenges]=useState([]);
  const[specialLoading,setSpecialLoading]=useState(false);
  const[library,setLibrary]=useState([]);
  const[adminDailyReviews,setAdminDailyReviews]=useState([]);
  const[adminSpecialReviews,setAdminSpecialReviews]=useState([]);
  const[challengeBusy,setChallengeBusy]=useState(false);
  const[challengeMessage,setChallengeMessage]=useState('');
  const[challengeForm,setChallengeForm]=useState({
    title:'',
    description:'',
    points:'20',
    recipient_ids:[]
  });
  const[envelopeRounds,setEnvelopeRounds]=useState([]);
  const[roundBusy,setRoundBusy]=useState(false);
  const[packs,setPacks]=useState([]);
  const[packTemplates,setPackTemplates]=useState([]);
  const[selectedPackId,setSelectedPackId]=useState('');
  const[packBusy,setPackBusy]=useState(false);
  const[packMessage,setPackMessage]=useState('');
  const[newPack,setNewPack]=useState({name:'',emoji:'🎒',description:''});
  const[newTemplate,setNewTemplate]=useState({
    title:'',
    description:'',
    points:'20',
    audience:'individual'
  });

  const[myAdvantages,setMyAdvantages]=useState([]);
  const[advantageCatalog,setAdvantageCatalog]=useState([]);
  const[advantageAssignments,setAdvantageAssignments]=useState([]);
  const[advantageRequests,setAdvantageRequests]=useState([]);
  const[advantageHistory,setAdvantageHistory]=useState([]);
  const[advantageBusy,setAdvantageBusy]=useState(false);
  const[advantageMessage,setAdvantageMessage]=useState('');
  const[newAdvantage,setNewAdvantage]=useState({
    name:'',
    emoji:'🎁',
    description:''
  });
  const[assignAdvantage,setAssignAdvantage]=useState({
    advantage_id:'',
    user_id:''
  });
  const[auction,setAuction]=useState(null);
  const[auctionLots,setAuctionLots]=useState([]);
  const[auctionCatalog,setAuctionCatalog]=useState([]);
  const[auctionBusy,setAuctionBusy]=useState(false);
  const[auctionMessage,setAuctionMessage]=useState('');
  const[newLot,setNewLot]=useState({advantage_id:'',minimum_bid:'10'});
  const[myBids,setMyBids]=useState({});
  const[auctionWallet,setAuctionWallet]=useState({balance:100});
  const[auctionTick,setAuctionTick]=useState(Date.now());
  const[auctionWalletForm,setAuctionWalletForm]=useState({user_id:'',amount:'10',reason:'Premio'});
  const[expenses,setExpenses]=useState([]);
  const[expenseBalances,setExpenseBalances]=useState([]);
  const[expensesLoading,setExpensesLoading]=useState(false);
  const[expenseBusy,setExpenseBusy]=useState(false);
  const[expenseMessage,setExpenseMessage]=useState('');
  const[expensePhones,setExpensePhones]=useState({});
  const[copiedExpensePhone,setCopiedExpensePhone]=useState('');
  const[expenseSettlements,setExpenseSettlements]=useState([]);
  const[settlementBusy,setSettlementBusy]=useState(false);
  const[expenseFormOpen,setExpenseFormOpen]=useState(false);
  const[editingExpenseId,setEditingExpenseId]=useState(null);
  const[expenseForm,setExpenseForm]=useState({description:'',amount:'',payer_user_id:'',participant_ids:[],notes:''});
  const[stages,setStages]=useState([]);
  const[stagesLoading,setStagesLoading]=useState(false);
  const[stageBusy,setStageBusy]=useState(false);
  const[stageMessage,setStageMessage]=useState('');
  const[editingStageId,setEditingStageId]=useState(null);
  const[expandedStageId,setExpandedStageId]=useState(null);
  const[stageForm,setStageForm]=useState({
    stage_date:'',
    same_place:false,
    transport_mode:'bicycle',
    origin:'',
    destination:'',
    distance_km:'',
    elevation_m:'',
    duration_text:'',
    route_url:'',
    day_description:'',
    same_accommodation:false,
    accommodation_name:'',
    booking_url:'',
    booked_by_user_id:'',
    accommodation_price:''
  });
  const[settingsForm,setSettingsForm]=useState({
    name:membership.games?.name||'',
    emoji:membership.games?.emoji||'🧭',
    start_date:membership.games?.start_date||'',
    end_date:membership.games?.end_date||'',
    description:membership.games?.description||'',
    join_enabled:membership.games?.join_enabled!==false
  });
  const[settingsBusy,setSettingsBusy]=useState(false);
  const[settingsMessage,setSettingsMessage]=useState('');
  const[dangerConfirm,setDangerConfirm]=useState('');
  const[editingAdvantage,setEditingAdvantage]=useState(null);
  const[editAdvantageForm,setEditAdvantageForm]=useState({
    name:'',
    emoji:'🎁',
    description:''
  });




  const g=membership.games;
  const owner=membership.role==='owner';

  useEffect(()=>{
    loadBrinkkers();
    loadDailyChallenges();
    loadAuction();
    loadStages();
    loadExpenses();
    loadNotificationCounts();
  },[g.id]);

  useEffect(()=>{
    if(!auction||auction.status!=='open')return;

    const interval=setInterval(async()=>{
      setAuctionTick(Date.now());
      await supabase.rpc('tick_live_tripquest_auction',{p_game_id:g.id});
      await loadAuction();
    },1500);

    return()=>clearInterval(interval);
  },[auction?.auction_id,auction?.status,g.id]);

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

  async function loadBrinkkers(){
    setBrinkkersLoading(true);
    setBrinkkersError('');
    const{data,error}=await supabase.rpc('list_tripquest_game_members',{p_game_id:g.id});
    if(error){
      console.error('Error cargando Brinkkers:',error);
      setBrinkkers([]);
      setBrinkkersError(error.message);
    }else{
      setBrinkkers(data||[]);
      if(!pointsForm.user_id&&data?.length){
        setPointsForm(form=>({...form,user_id:data[0].user_id}));
      }
    }
    setBrinkkersLoading(false);
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
      setPointsMessage('Selecciona un Brinkker.');
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
    setDailyError('');
    const{data,error}=await supabase.rpc('list_my_daily_challenges',{p_game_id:g.id});
    if(error){
      console.error('Error cargando retos diarios:',error);
      setDailyChallenges([]);
      setDailyError(error.message||'No se pudieron cargar los retos diarios.');
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

  function blankExpenseForm(){
    return {description:'',amount:'',payer_user_id:'',participant_ids:[],notes:''};
  }

  async function loadExpenses(){
    setExpensesLoading(true);
    const [expenseResult,balanceResult,phoneResult,settlementResult]=await Promise.all([
      supabase.rpc('list_tripquest_expenses',{p_game_id:g.id}),
      supabase.rpc('list_tripquest_expense_balances',{p_game_id:g.id}),
      supabase.rpc('list_tripquest_bizum_phones',{p_game_id:g.id}),
      supabase.rpc('list_tripquest_expense_settlements',{p_game_id:g.id})
    ]);
    if(expenseResult.error){
      console.error('Error cargando gastos:',expenseResult.error);
      setExpenses([]);
      setExpenseMessage(expenseResult.error.message);
    }else setExpenses(expenseResult.data||[]);
    if(balanceResult.error){
      console.error('Error cargando balances:',balanceResult.error);
      setExpenseBalances([]);
    }else setExpenseBalances(balanceResult.data||[]);
    if(phoneResult.error){
      console.error('Error cargando teléfonos Bizum:',phoneResult.error);
      setExpensePhones({});
    }else{
      setExpensePhones(Object.fromEntries((phoneResult.data||[]).map(row=>[row.user_id,row.bizum_phone||''])));
    }

    if(settlementResult?.error){
      console.error('Error cargando liquidaciones:',settlementResult.error);
      setExpenseSettlements([]);
    }else{
      setExpenseSettlements(Array.isArray(settlementResult?.data)?settlementResult.data:[]);
    }

    setExpensesLoading(false);
  }

  function toggleExpenseParticipant(userId){
    setExpenseForm(form=>({
      ...form,
      participant_ids:form.participant_ids.includes(userId)
        ?form.participant_ids.filter(id=>id!==userId)
        :[...form.participant_ids,userId]
    }));
  }

  function toggleAllExpenseParticipants(){
    setExpenseForm(form=>({
      ...form,
      participant_ids:form.participant_ids.length===brinkkers.length?[]:brinkkers.map(q=>q.user_id)
    }));
  }

  async function saveExpense(e){
    e.preventDefault();
    setExpenseBusy(true);
    setExpenseMessage('');
    const amount=Number(expenseForm.amount);
    if(!expenseForm.description.trim()){
      setExpenseMessage('Escribe el concepto del gasto.');setExpenseBusy(false);return;
    }
    if(!Number.isFinite(amount)||amount<=0){
      setExpenseMessage('Escribe un importe válido.');setExpenseBusy(false);return;
    }
    if(!expenseForm.payer_user_id){
      setExpenseMessage('Selecciona quién pagó.');setExpenseBusy(false);return;
    }
    if(!expenseForm.participant_ids.length){
      setExpenseMessage('Selecciona al menos un Brinkker.');setExpenseBusy(false);return;
    }
    const{error}=await supabase.rpc('save_tripquest_expense',{
      p_expense_id:editingExpenseId,
      p_game_id:g.id,
      p_description:expenseForm.description.trim(),
      p_amount:amount,
      p_payer_user_id:expenseForm.payer_user_id,
      p_participant_ids:expenseForm.participant_ids,
      p_notes:expenseForm.notes.trim()||null
    });
    if(error)setExpenseMessage(error.message);
    else{
      setExpenseMessage(editingExpenseId?'Gasto actualizado':'Gasto añadido');
      setEditingExpenseId(null);
      setExpenseForm(blankExpenseForm());
      setExpenseFormOpen(false);
      await loadExpenses();
    }
    setExpenseBusy(false);
  }

  async function editExpense(item){
    setExpenseBusy(true);
    setExpenseMessage('');
    const{data,error}=await supabase.rpc('get_tripquest_expense_participants',{p_expense_id:item.expense_id});
    if(error){setExpenseMessage(error.message);setExpenseBusy(false);return;}
    setEditingExpenseId(item.expense_id);
    setExpenseForm({
      description:item.description||'',
      amount:String(item.amount??''),
      payer_user_id:item.payer_user_id||'',
      participant_ids:(data||[]).map(row=>row.user_id),
      notes:item.notes||''
    });
    setExpenseBusy(false);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  async function deleteExpense(expenseId){
    const confirmation=window.prompt('Para eliminar este gasto escribe BORRAR');
    if(confirmation!=='BORRAR')return;
    setExpenseBusy(true);
    const{error}=await supabase.rpc('delete_tripquest_expense',{p_expense_id:expenseId});
    setExpenseMessage(error?error.message:'Gasto eliminado');
    if(!error){
      if(editingExpenseId===expenseId){setEditingExpenseId(null);setExpenseForm(blankExpenseForm());}
      await loadExpenses();
    }
    setExpenseBusy(false);
  }

  function adjustedExpenseBalances(){
    const source=Array.isArray(expenseBalances)?expenseBalances:[];
    const settlements=Array.isArray(expenseSettlements)?expenseSettlements:[];

    const balances=new globalThis.Map(
      source.map(row=>[
        row.user_id,
        {...row,balance:Number(row.balance||0)}
      ])
    );

    settlements.forEach(payment=>{
      const amount=Number(payment?.amount||0);
      if(!Number.isFinite(amount)||amount<=0)return;

      const payer=balances.get(payment.payer_user_id);
      const receiver=balances.get(payment.receiver_user_id);

      if(payer)payer.balance=Number(payer.balance||0)+amount;
      if(receiver)receiver.balance=Number(receiver.balance||0)-amount;
    });

    return Array.from(balances.values());
  }

  function expenseTransfers(){
    const adjusted=adjustedExpenseBalances();
    const creditors=adjusted
      .filter(r=>Number(r.balance)>0.005)
      .map(r=>({user_id:r.user_id,nickname:r.nickname,amount:Number(r.balance)}))
      .sort((a,b)=>b.amount-a.amount);

    const debtors=adjusted
      .filter(r=>Number(r.balance)<-0.005)
      .map(r=>({user_id:r.user_id,nickname:r.nickname,amount:-Number(r.balance)}))
      .sort((a,b)=>b.amount-a.amount);

    const transfers=[];
    let i=0,j=0;

    while(i<debtors.length&&j<creditors.length){
      const amount=Math.min(debtors[i].amount,creditors[j].amount);
      if(amount>=0.005){
        transfers.push({
          from:debtors[i].nickname,
          from_user_id:debtors[i].user_id,
          to:creditors[j].nickname,
          to_user_id:creditors[j].user_id,
          amount:Math.round(amount*100)/100
        });
      }

      debtors[i].amount-=amount;
      creditors[j].amount-=amount;

      if(debtors[i].amount<0.005)i++;
      if(creditors[j].amount<0.005)j++;
    }

    return transfers;
  }

  async function markExpensePaid(transfer){
    const currentUserId=session?.user?.id;
    if(!currentUserId||transfer?.from_user_id!==currentUserId)return;

    const amount=Math.round(Number(transfer.amount||0)*100)/100;
    if(!Number.isFinite(amount)||amount<=0){
      setExpenseMessage('No se ha podido calcular correctamente el importe.');
      return;
    }

    const confirmed=window.confirm(
      `¿Confirmas que ya has pagado ${amount.toFixed(2)} € a ${transfer.to}?`
    );
    if(!confirmed)return;

    setSettlementBusy(true);
    setExpenseMessage('');

    try{
      const{error}=await supabase.rpc('settle_tripquest_expense',{
        p_game_id:g.id,
        p_receiver_user_id:transfer.to_user_id,
        p_amount:amount
      });

      if(error){
        setExpenseMessage(error.message);
      }else{
        setExpenseMessage(`✓ Pago de ${amount.toFixed(2)} € a ${transfer.to} registrado.`);
        await loadExpenses();
      }
    }catch(error){
      console.error(error);
      setExpenseMessage(error?.message||'No se ha podido registrar el pago.');
    }finally{
      setSettlementBusy(false);
    }
  }

  async function copyExpensePhone(userId,nickname){
    const phone=expensePhones[userId];
    if(!phone){
      setExpenseMessage(`📱 ${nickname} todavía no ha añadido su teléfono para Bizum.`);
      return;
    }
    try{
      await navigator.clipboard.writeText(phone);
      setCopiedExpensePhone(userId);
      setTimeout(()=>setCopiedExpensePhone(''),1800);
    }catch{
      window.prompt(`Copia el teléfono de ${nickname}:`,phone);
    }
  }

  function expenseBrinkkerName(userId){
    return brinkkers.find(q=>q.user_id===userId)?.nickname||'Brinkker';
  }

  function formatSettlementDate(value){
    if(!value)return '';
    try{
      return new Intl.DateTimeFormat('es-ES',{
        day:'2-digit',
        month:'short',
        hour:'2-digit',
        minute:'2-digit'
      }).format(new Date(value));
    }catch{
      return '';
    }
  }

  const totalExpenses=expenses.reduce((sum,item)=>sum+Number(item.amount||0),0);
  const myExpenseBalance=adjustedExpenseBalances().find(row=>row.user_id===session?.user?.id);

  async function loadAdminSettings(){
    const{data,error}=await supabase.rpc('get_tripquest_admin_settings',{
      p_game_id:g.id
    });
    if(error){
      setSettingsMessage(error.message);
      return;
    }
    if(data?.length){
      const row=data[0];
      setSettingsForm({
        name:row.game_name||g.name||'',
        emoji:row.game_emoji||g.emoji||'🧭',
        start_date:row.start_date||'',
        end_date:row.end_date||'',
        description:row.game_description||'',
        join_enabled:row.join_enabled!==false
      });
    }
  }

  async function saveAdminSettings(e){
    e.preventDefault();
    setSettingsBusy(true);
    setSettingsMessage('');
    const{error}=await supabase.rpc('update_tripquest_admin_settings',{
      p_game_id:g.id,
      p_name:settingsForm.name.trim(),
      p_emoji:settingsForm.emoji||'🧭',
      p_start_date:settingsForm.start_date,
      p_end_date:settingsForm.end_date,
      p_description:settingsForm.description.trim()||null,
      p_join_enabled:settingsForm.join_enabled
    });
    setSettingsMessage(error?error.message:'Ajustes guardados. Sal y vuelve a entrar para ver el nuevo nombre en toda la app.');
    setSettingsBusy(false);
  }

  async function runAdminAction(action,confirmation=''){
    if(confirmation&&dangerConfirm.trim()!==confirmation){
      setSettingsMessage(`Escribe exactamente ${confirmation}`);
      return;
    }
    setSettingsBusy(true);
    setSettingsMessage('');
    const{data,error}=await supabase.rpc('run_tripquest_admin_action',{
      p_game_id:g.id,
      p_action:action
    });
    setSettingsMessage(error?error.message:(data||'Acción completada'));
    if(!error){
      setDangerConfirm('');
      await Promise.all([
        loadBrinkkers(),
        loadDailyChallenges(),
        loadAuction(),
        loadStages(),
        loadAdminAdvantages(),
        loadAdminChallenges()
      ]);
    }
    setSettingsBusy(false);
  }

  function startEditAdvantage(item){
    setEditingAdvantage(item.advantage_id);
    setEditAdvantageForm({
      name:item.name,
      emoji:item.emoji||'🎁',
      description:item.description||''
    });
  }

  async function saveCustomAdvantage(e){
    e.preventDefault();
    setAdvantageBusy(true);
    setAdvantageMessage('');
    const{error}=await supabase.rpc('update_tripquest_custom_advantage',{
      p_game_id:g.id,
      p_advantage_id:editingAdvantage,
      p_name:editAdvantageForm.name.trim(),
      p_emoji:editAdvantageForm.emoji||'🎁',
      p_description:editAdvantageForm.description.trim()
    });
    if(error)setAdvantageMessage(error.message);
    else{
      setEditingAdvantage(null);
      setAdvantageMessage('Objeto actualizado');
      await loadAdminAdvantages();
    }
    setAdvantageBusy(false);
  }

  async function deleteCustomAdvantage(advantageId){
    if(!window.confirm('¿Borrar este objeto personalizado?'))return;
    setAdvantageBusy(true);
    const{error}=await supabase.rpc('delete_tripquest_custom_advantage',{
      p_game_id:g.id,
      p_advantage_id:advantageId
    });
    setAdvantageMessage(error?error.message:'Objeto eliminado');
    await loadAdminAdvantages();
    setAdvantageBusy(false);
  }

  async function removeAuctionLot(lotId){
    setAuctionBusy(true);
    const{error}=await supabase.rpc('remove_tripquest_auction_lot',{
      p_lot_id:lotId
    });
    setAuctionMessage(error?error.message:'Objeto retirado de la subasta');
    await loadAuction();
    setAuctionBusy(false);
  }

  function blankStageForm(){
    return {
      stage_date:'',
      same_place:false,
      transport_mode:'bicycle',
      origin:'',
      destination:'',
      distance_km:'',
      elevation_m:'',
      duration_text:'',
      route_url:'',
      day_description:'',
      same_accommodation:false,
      accommodation_name:'',
      booking_url:'',
      booked_by_user_id:'',
      accommodation_price:''
    };
  }

  async function loadStages(){
    setStagesLoading(true);
    const{data,error}=await supabase.rpc('list_brinkkando_stages',{p_game_id:g.id});
    if(error){
      console.error('Error cargando Plan:',error);
      setStages([]);
      setStageMessage(error.message);
    }else{
      setStages(data||[]);
    }
    setStagesLoading(false);
  }

  function editStage(stage){
    setEditingStageId(stage.stage_id);
    setStageForm({
      stage_date:stage.stage_date||'',
      same_place:stage.same_place,
      transport_mode:stage.transport_mode||'bicycle',
      origin:stage.origin||'',
      destination:stage.destination||'',
      distance_km:stage.distance_km??'',
      elevation_m:stage.elevation_m??'',
      duration_text:stage.duration_text||'',
      route_url:stage.route_url||'',
      day_description:stage.day_description||'',
      same_accommodation:stage.same_accommodation,
      accommodation_name:stage.accommodation_name||'',
      booking_url:stage.booking_url||'',
      booked_by_user_id:stage.booked_by_user_id||'',
      accommodation_price:stage.accommodation_price??''
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  async function saveStage(e){
    e.preventDefault();
    setStageBusy(true);
    setStageMessage('');

    const distance=stageForm.same_place||stageForm.distance_km===''?null:Number(stageForm.distance_km);
    const elevation=stageForm.same_place||stageForm.elevation_m===''?null:Number(stageForm.elevation_m);
    const price=stageForm.accommodation_price===''?null:Number(stageForm.accommodation_price);

    const{error}=await supabase.rpc('save_brinkkando_stage',{
      p_stage_id:editingStageId,
      p_game_id:g.id,
      p_stage_date:stageForm.stage_date||null,
      p_same_place:stageForm.same_place,
      p_transport_mode:stageForm.same_place?null:stageForm.transport_mode,
      p_origin:stageForm.origin.trim(),
      p_destination:stageForm.same_place?stageForm.origin.trim():stageForm.destination.trim(),
      p_distance_km:Number.isFinite(distance)?distance:null,
      p_elevation_m:Number.isFinite(elevation)?elevation:null,
      p_duration_text:stageForm.same_place?null:(stageForm.duration_text.trim()||null),
      p_route_url:stageForm.same_place?null:(stageForm.route_url.trim()||null),
      p_day_description:stageForm.day_description.trim()||null,
      p_same_accommodation:stageForm.same_accommodation,
      p_accommodation_name:stageForm.same_accommodation?null:(stageForm.accommodation_name.trim()||null),
      p_booking_url:stageForm.same_accommodation?null:(stageForm.booking_url.trim()||null),
      p_booked_by_user_id:stageForm.same_accommodation?null:(stageForm.booked_by_user_id||null),
      p_accommodation_price:Number.isFinite(price)?price:null
    });

    if(error){
      setStageMessage(error.message);
    }else{
      setStageMessage(editingStageId?'Jornada actualizada':'Jornada creada');
      setEditingStageId(null);
      setStageForm(blankStageForm());
      await loadStages();
    }
    setStageBusy(false);
  }

  async function deleteStage(stageId){
    if(!window.confirm('¿Borrar esta jornada del Plan?'))return;
    setStageBusy(true);
    const{error}=await supabase.rpc('delete_tripquest_stage',{p_stage_id:stageId});
    setStageMessage(error?error.message:'Jornada eliminada');
    await loadStages();
    setStageBusy(false);
  }

  async function moveStage(stageId,direction){
    setStageBusy(true);
    const{error}=await supabase.rpc('move_tripquest_stage',{
      p_stage_id:stageId,
      p_direction:direction
    });
    if(error)setStageMessage(error.message);
    await loadStages();
    setStageBusy(false);
  }

  const transportLabels={
    bicycle:'🚴 Bici',
    walking:'🥾 A pie',
    car:'🚗 Coche',
    motorcycle:'🏍️ Moto',
    train:'🚆 Tren',
    bus:'🚌 Autobús',
    boat:'⛴️ Barco',
    plane:'✈️ Avión',
    other:'🧭 Otro'
  };

  async function loadAuction(){
    const walletResult=await supabase.rpc('get_my_live_auction_wallet',{p_game_id:g.id});
    if(walletResult.error){
      console.error('Error cargando monedas:',walletResult.error);
      setAuctionWallet({balance:100});
    }else{
      setAuctionWallet(walletResult.data?.[0]||{balance:100});
    }

    const{data,error}=await supabase.rpc('get_current_live_tripquest_auction',{p_game_id:g.id});

    if(error||!data?.length){
      setAuction(null);
      setAuctionLots([]);
      return;
    }

    const current=data[0];
    setAuction(current);

    const{data:lots,error:lotsError}=await supabase.rpc('list_live_tripquest_auction_lots',{
      p_auction_id:current.auction_id
    });

    if(lotsError){
      console.error('Error cargando lotes:',lotsError);
      setAuctionLots([]);
    }else{
      setAuctionLots(lots||[]);
    }
  }

  async function loadAuctionCatalog(){
    const{data}=await supabase.rpc('list_tripquest_advantage_catalog',{p_game_id:g.id});
    setAuctionCatalog(data||[]);
    if(data?.length&&!newLot.advantage_id){
      setNewLot(f=>({...f,advantage_id:data[0].advantage_id}));
    }
  }

  async function createAuction(){
    setAuctionBusy(true);
    setAuctionMessage('');

    const{error}=await supabase.rpc('create_live_tripquest_auction',{
      p_game_id:g.id
    });

    setAuctionMessage(error?error.message:'Subasta creada');
    await loadAuction();
    await loadAuctionCatalog();
    setAuctionBusy(false);
  }

  async function addAuctionLot(random=false){
    setAuctionBusy(true);
    setAuctionMessage('');

    const min=Math.max(0,Number(newLot.minimum_bid)||0);

    const result=random
      ?await supabase.rpc('add_random_live_tripquest_auction_lot',{
          p_auction_id:auction.auction_id,
          p_minimum_bid:min
        })
      :await supabase.rpc('add_live_tripquest_auction_lot',{
          p_auction_id:auction.auction_id,
          p_advantage_id:newLot.advantage_id,
          p_minimum_bid:min
        });

    setAuctionMessage(
      result.error
        ?result.error.message
        :(random?'Objeto aleatorio añadido':'Objeto añadido')
    );

    await loadAuction();
    setAuctionBusy(false);
  }

  async function removeAuctionLot(lotId){
    setAuctionBusy(true);

    const{error}=await supabase.rpc('remove_live_tripquest_auction_lot',{
      p_lot_id:lotId
    });

    setAuctionMessage(error?error.message:'Objeto retirado');
    await loadAuction();
    setAuctionBusy(false);
  }

  async function openAuction(){
    setAuctionBusy(true);
    setAuctionMessage('');

    const{error}=await supabase.rpc('open_live_tripquest_auction',{
      p_auction_id:auction.auction_id
    });

    setAuctionMessage(error?error.message:'🔥 ¡Empieza la subasta!');
    await loadAuction();
    setAuctionBusy(false);
  }

  async function forceFinishLiveLot(){
    setAuctionBusy(true);
    setAuctionMessage('');

    const{data,error}=await supabase.rpc('finish_live_tripquest_lot',{
      p_game_id:g.id,
      p_force:true
    });

    setAuctionMessage(error?error.message:(data||'Lote cerrado'));
    await loadAuction();
    setAuctionBusy(false);
  }

  async function grantAuctionCoins(e){
    e.preventDefault();

    const amount=Math.round(Number(auctionWalletForm.amount));

    if(!auctionWalletForm.user_id||!Number.isFinite(amount)||amount<=0){
      setAuctionMessage('Selecciona un Brinkker y una cantidad válida.');
      return;
    }

    setAuctionBusy(true);

    const{error}=await supabase.rpc('grant_live_tripquest_auction_coins',{
      p_game_id:g.id,
      p_user_id:auctionWalletForm.user_id,
      p_amount:amount,
      p_reason:auctionWalletForm.reason.trim()||'Premio'
    });

    setAuctionMessage(
      error
        ?error.message
        :`🪙 ${amount} monedas entregadas.`
    );

    if(!error)setAuctionWalletForm(form=>({...form,amount:'10'}));

    await loadAuction();
    setAuctionBusy(false);
  }

  function activeAuctionLot(){
    return auctionLots.find(lot=>lot.live_status==='live')||null;
  }

  function auctionSecondsLeft(lot){
    if(!lot?.ends_at)return 0;
    return Math.max(
      0,
      Math.ceil((new Date(lot.ends_at).getTime()-auctionTick)/1000)
    );
  }

  async function placeLiveBid(lot,increment,allIn=false){
    if(!lot||lot.live_status!=='live'||auctionBusy)return;

    const current=Number(lot.current_bid||0);
    const minimum=Number(lot.minimum_bid||0);
    const balance=Number(auctionWallet.balance||0);

    let amount;

    if(allIn){
      if(!window.confirm(`¿ALL IN con tus ${balance} monedas?`))return;
      amount=balance;
    }else{
      amount=current>0
        ?current+increment
        :Math.max(minimum,increment);
    }

    if(amount>balance){
      setAuctionMessage(`No tienes suficientes monedas. Tienes ${balance} 🪙.`);
      return;
    }

    setAuctionBusy(true);
    setAuctionMessage('');

    const{error}=await supabase.rpc('place_live_tripquest_bid',{
      p_lot_id:lot.lot_id,
      p_amount:amount
    });

    if(error){
      setAuctionMessage(error.message);
    }

    await loadAuction();
    setAuctionBusy(false);
  }


  async function loadMyAdvantages(){
    const{data,error}=await supabase.rpc('list_my_tripquest_advantages',{
      p_game_id:g.id
    });

    if(error){
      console.error('Error cargando objetos:',error);
      setMyAdvantages([]);
      setAdvantageMessage(error.message);
    }else{
      setMyAdvantages(data||[]);
    }
  }

  async function loadAdminAdvantages(){
    const [catalogResult,assignmentsResult,requestsResult]=await Promise.all([
      supabase.rpc('list_tripquest_advantage_catalog',{p_game_id:g.id}),
      supabase.rpc('list_admin_tripquest_advantage_assignments',{p_game_id:g.id}),
      supabase.rpc('list_admin_tripquest_advantage_requests',{p_game_id:g.id})
    ]);

    if(catalogResult.error){
      console.error('Error cargando catálogo:',catalogResult.error);
      setAdvantageCatalog([]);
    }else{
      setAdvantageCatalog(catalogResult.data||[]);
      if(!assignAdvantage.advantage_id&&catalogResult.data?.length){
        setAssignAdvantage(form=>({...form,advantage_id:catalogResult.data[0].advantage_id}));
      }
    }

    if(assignmentsResult.error){
      console.error('Error cargando asignaciones:',assignmentsResult.error);
      setAdvantageAssignments([]);
    }else{
      setAdvantageAssignments(assignmentsResult.data||[]);
    }

    if(requestsResult.error){
      console.error('Error cargando solicitudes:',requestsResult.error);
      setAdvantageRequests([]);
    }else{
      setAdvantageRequests(requestsResult.data||[]);
    }
  }

  async function createAdvantage(e){
    e.preventDefault();
    setAdvantageBusy(true);
    setAdvantageMessage('');

    const{error}=await supabase.rpc('create_tripquest_advantage',{
      p_game_id:g.id,
      p_name:newAdvantage.name.trim(),
      p_emoji:newAdvantage.emoji||'🎁',
      p_description:newAdvantage.description.trim()
    });

    if(error){
      setAdvantageMessage(error.message);
    }else{
      setAdvantageMessage('Objeto creado');
      setNewAdvantage({name:'',emoji:'🎁',description:''});
      await loadAdminAdvantages();
    }
    setAdvantageBusy(false);
  }

  async function assignAdvantageToUser(e){
    e.preventDefault();
    setAdvantageBusy(true);
    setAdvantageMessage('');

    if(!assignAdvantage.advantage_id||!assignAdvantage.user_id){
      setAdvantageMessage('Selecciona un objeto y un Brinkker.');
      setAdvantageBusy(false);
      return;
    }

    const{error}=await supabase.rpc('assign_tripquest_advantage',{
      p_game_id:g.id,
      p_advantage_id:assignAdvantage.advantage_id,
      p_user_id:assignAdvantage.user_id
    });

    if(error){
      setAdvantageMessage(error.message);
    }else{
      setAdvantageMessage('Objeto asignado');
      await loadAdminAdvantages();
    }
    setAdvantageBusy(false);
  }

  async function requestAdvantageUse(assignmentId){
    setAdvantageBusy(true);
    setAdvantageMessage('');
    const{error}=await supabase.rpc('request_tripquest_advantage_use',{
      p_assignment_id:assignmentId
    });
    if(error){
      setAdvantageMessage(error.message);
    }else{
      setAdvantageMessage('Solicitud enviada al Admin');
      await loadMyAdvantages();
      await loadNotificationCounts();
    }
    setAdvantageBusy(false);
  }

  async function reviewAdvantageRequest(requestId,approve){
    setAdvantageBusy(true);
    setAdvantageMessage('');
    const{error}=await supabase.rpc('review_tripquest_advantage_request',{
      p_request_id:requestId,
      p_approve:approve
    });
    if(error){
      setAdvantageMessage(error.message);
    }else{
      setAdvantageMessage(approve?'Uso confirmado':'Solicitud rechazada');
      await loadAdminAdvantages();
    }
    setAdvantageBusy(false);
  }

  async function removeAdvantageAssignment(assignmentId){
    setAdvantageBusy(true);
    setAdvantageMessage('');
    const{error}=await supabase.rpc('remove_tripquest_advantage_assignment',{
      p_assignment_id:assignmentId
    });
    if(error){
      setAdvantageMessage(error.message);
    }else{
      setAdvantageMessage('Objeto retirado');
      await loadAdminAdvantages();
    }
    setAdvantageBusy(false);
  }

  async function loadPacks(){
    const{data,error}=await supabase.rpc('list_tripquest_packs',{p_game_id:g.id});
    if(error){
      console.error('Error cargando packs:',error);
      setPacks([]);
      return;
    }
    setPacks(data||[]);
    const currentExists=(data||[]).some(pack=>pack.pack_id===selectedPackId);
    const nextId=currentExists?selectedPackId:(data?.[0]?.pack_id||'');
    setSelectedPackId(nextId);
    if(nextId)await loadPackTemplates(nextId);
    else setPackTemplates([]);
  }

  async function loadPackTemplates(packId){
    const{data,error}=await supabase.rpc('list_tripquest_pack_templates',{
      p_game_id:g.id,
      p_pack_id:packId
    });
    if(error){
      console.error('Error cargando pruebas del pack:',error);
      setPackTemplates([]);
    }else{
      setPackTemplates(data||[]);
    }
  }

  async function togglePack(pack){
    setPackBusy(true);
    setPackMessage('');
    const{error}=await supabase.rpc('set_tripquest_pack_enabled',{
      p_game_id:g.id,
      p_pack_id:pack.pack_id,
      p_enabled:!pack.is_enabled
    });
    if(error)setPackMessage(error.message);
    else{
      setPackMessage(pack.is_enabled?'Pack desactivado':'Pack activado');
      await loadPacks();
    }
    setPackBusy(false);
  }

  async function togglePackTemplate(template){
    setPackBusy(true);
    setPackMessage('');
    const{error}=await supabase.rpc('set_tripquest_template_enabled',{
      p_game_id:g.id,
      p_template_id:template.template_id,
      p_enabled:!template.is_enabled
    });
    if(error)setPackMessage(error.message);
    else{
      await loadPackTemplates(selectedPackId);
      await loadPacks();
    }
    setPackBusy(false);
  }

  async function createCustomPack(e){
    e.preventDefault();
    setPackBusy(true);
    setPackMessage('');
    const{data,error}=await supabase.rpc('create_tripquest_pack',{
      p_game_id:g.id,
      p_name:newPack.name.trim(),
      p_emoji:newPack.emoji||'🎒',
      p_description:newPack.description.trim()||null
    });
    if(error){
      setPackMessage(error.message);
    }else{
      setNewPack({name:'',emoji:'🎒',description:''});
      setPackMessage('Pack creado');
      await loadPacks();
      if(data){
        setSelectedPackId(data);
        await loadPackTemplates(data);
      }
    }
    setPackBusy(false);
  }

  async function createPackTemplate(e){
    e.preventDefault();
    setPackBusy(true);
    setPackMessage('');
    if(!selectedPackId){
      setPackMessage('Selecciona un pack.');
      setPackBusy(false);
      return;
    }
    const points=Number(newTemplate.points);
    const{error}=await supabase.rpc('create_tripquest_pack_template',{
      p_game_id:g.id,
      p_pack_id:selectedPackId,
      p_title:newTemplate.title.trim(),
      p_description:newTemplate.description.trim(),
      p_points:Number.isInteger(points)?points:20,
      p_audience:newTemplate.audience
    });
    if(error){
      setPackMessage(error.message);
    }else{
      setNewTemplate({title:'',description:'',points:'20',audience:'individual'});
      setPackMessage('Prueba añadida');
      await loadPackTemplates(selectedPackId);
      await loadPacks();
    }
    setPackBusy(false);
  }

  async function loadAdminChallenges(){
    const [libraryResult,dailyReviewResult,specialReviewResult,roundResult]=await Promise.all([
      supabase.rpc('list_tripquest_daily_library',{p_game_id:g.id}),
      supabase.rpc('list_admin_daily_reviews',{p_game_id:g.id}),
      supabase.rpc('list_admin_special_reviews',{p_game_id:g.id}),
      supabase.rpc('list_blind_envelope_rounds',{p_game_id:g.id})
    ]);
    if(!libraryResult.error)setLibrary(libraryResult.data||[]);
    if(!dailyReviewResult.error)setAdminDailyReviews(dailyReviewResult.data||[]);
    if(!specialReviewResult.error)setAdminSpecialReviews(specialReviewResult.data||[]);
    if(!roundResult.error)setEnvelopeRounds(roundResult.data||[]);
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

  async function distributeBlindEnvelopes(roundType){
    setRoundBusy(true);
    setChallengeMessage('');
    const fn=roundType==='individual'
      ?'distribute_blind_individual_envelopes'
      :'distribute_blind_team_envelopes';
    const{data,error}=await supabase.rpc(fn,{p_game_id:g.id});
    if(error){
      setChallengeMessage(error.message);
    }else{
      setChallengeMessage(
        roundType==='individual'
          ?`Ronda enviada: ${data} sobres individuales`
          :`Ronda enviada: ${data} equipos`
      );
      await loadAdminChallenges();
      await loadNotificationCounts();
    }
    setRoundBusy(false);
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
      setChallengeMessage('Selecciona al menos un Brinkker.');
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
      p_kind:'custom',
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
        title:'',
        description:'',
        points:'20',
        recipient_ids:[]
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
    if(nextPage==='home'){
      loadDailyChallenges();
      loadBrinkkers();
    }
    if(nextPage==='brinkkers')loadBrinkkers();
    if(nextPage==='ranking'){
      loadRanking();
      loadPointHistory();
      markSectionRead('ranking');
    }
    if(nextPage==='challenges'){
      loadMySpecialChallenges();
      markSectionRead('challenges');
    }
    if(nextPage==='advantages'){
      loadMyAdvantages();
      markSectionRead('advantages');
    }
    if(nextPage==='adminAdvantages'){
      loadBrinkkers();
      loadAdminAdvantages();
    }
    if(nextPage==='auction'){loadAuction();loadAuctionCatalog();}
    if(nextPage==='stages'){loadStages();loadBrinkkers();}
    if(nextPage==='settings'){loadAdminSettings();}
    if(nextPage==='points'){
      loadBrinkkers();
      loadRanking();
      loadPointHistory();
    }
    if(nextPage==='adminChallenges'){
      loadBrinkkers();
      loadAdminChallenges();
    }
    if(nextPage==='packs'){
      loadPacks();
    }
  }

  function changeMode(nextMode){
    setMode(nextMode);
    setPage('home');
    if(nextMode==='admin'){
      markSectionRead('admin');
    }else if(nextMode==='expenses'){
      loadBrinkkers();
      loadExpenses();
      setExpenseForm(form=>({
        ...form,
        payer_user_id:form.payer_user_id||session?.user?.id||'',
        participant_ids:form.participant_ids.length?form.participant_ids:brinkkers.map(q=>q.user_id)
      }));
    }else{
      loadDailyChallenges();
      loadBrinkkers();
    }
  }

  const adminSections=[
    {id:'packs',label:'🎒 Packs',detail:'Biblioteca y pruebas'},
    {id:'adminChallenges',label:'🎯 Retos y sobres',detail:'Diarios, secretos y equipos'},
    {id:'points',label:'⭐ Puntos',detail:'Gestionar clasificación'},
    {id:'auction',label:'🔨 Subasta',detail:'Objetos y pujas'},
    {id:'adminAdvantages',label:'🎒 Ventajas',detail:'Objetos e inventario'},
    {id:'stages',label:'📅 Plan',detail:'Trayectos y alojamientos'},
    {id:'brinkkers',label:'👥 Brinkkers',detail:'Ver participantes'},
    {id:'settings',label:'⚙️ Ajustes',detail:'Configuración y reinicio'}
  ];

  const playerNav=[
    {id:'home',label:'Inicio',icon:<Home size={20}/>},
    {id:'ranking',label:'Ranking',icon:<Trophy size={20}/>},
    {id:'challenges',label:'Retos',icon:<Target size={20}/>},
    {id:'stages',label:'Plan',icon:<Map size={20}/>},
    {id:'advantages',label:'Objetos',icon:<Backpack size={20}/>}
  ];

  const title=
    page==='ranking'?'Ranking':
    page==='brinkkers'?'Brinkkers':
    page==='points'?'Puntos':
    page==='challenges'?'Retos':
    page==='adminChallenges'?'Retos y sobres':
    page==='packs'?'Packs':
    page==='stages'?'Plan':
    page==='auction'?'Subasta':
    page==='settings'?'Ajustes':
    page==='adminAdvantages'?'Objetos':
    page==='advantages'?'Objetos':
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
    manual:'✍️ Reto manual',
    random_individual:'🔒 Sobre aleatorio',
    random_team:'🤝 Sobre aleatorio de equipo',
    custom:'✍️ Sobre personalizado'
  };

  return <main className="shell" style={{
    paddingBottom:mode==='player'?'105px':undefined,
    overflowX:'hidden',
    maxWidth:'100%',
    fontSize:'.92rem'
  }}>
    <header className="top" style={{gap:'10px',marginBottom:'10px'}}>
      <button className="icon" onClick={page==='home'?onBack:()=>setPage('home')}><ArrowLeft/></button>
      <div style={{minWidth:0}}>
        <p className="eyebrow" style={{marginBottom:'2px',fontSize:'.67rem',letterSpacing:'.08em'}}>{g.emoji} BRINKKANDO</p>
        <h1 style={{fontSize:'1.04rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{title}</h1>
      </div>
    </header>

    <div className="mode" style={{gridTemplateColumns:owner?'repeat(3,minmax(0,1fr))':'repeat(2,minmax(0,1fr))'}}>
      <button className={mode==='player'?'active':''} onClick={()=>changeMode('player')}
        style={{fontSize:'.76rem',padding:'9px 5px',gap:'5px'}}>
        <UserRound size={16}/>Mi Brinkkando
      </button>
      <button className={mode==='expenses'?'active':''} onClick={()=>changeMode('expenses')}
        style={{fontSize:'.76rem',padding:'9px 5px',gap:'5px'}}>
        <Wallet size={16}/>Gastos
      </button>
      {owner&&<button className={mode==='admin'?'active':''} onClick={()=>changeMode('admin')}
        style={{position:'relative',fontSize:'.76rem',padding:'9px 5px',gap:'5px'}}>
        <Settings size={16}/>Administrar
        {notificationCounts.admin>0&&<span style={{position:'absolute',right:'7px',top:'5px',width:'9px',height:'9px',borderRadius:'50%',background:'#e05b4f',border:'2px solid white'}}/>}
      </button>}
    </div>

    {page==='home'?<>
      <section className="card hero" style={{
        padding:'16px',
        border:'1px solid rgba(23,63,53,.09)',
        boxShadow:'0 8px 22px rgba(23,63,53,.06)'
      }}>
        <div style={{display:'grid',gridTemplateColumns:'46px minmax(0,1fr)',alignItems:'center',gap:'11px'}}>
          <div style={{
            width:'46px',height:'46px',borderRadius:'15px',
            background:'#eef3ef',display:'grid',placeItems:'center',
            fontSize:'1.55rem'
          }}>{g.emoji}</div>
          <div style={{minWidth:0}}>
            <p className="eyebrow" style={{marginBottom:'2px',fontSize:'.67rem',letterSpacing:'.08em'}}>
              {mode==='admin'?'MODO ADMIN':mode==='expenses'?'GASTOS':'BRINKKANDO'}
            </p>
            <h2 style={{margin:'0 0 2px',fontSize:'1.28rem'}}>
              {tripStatus(g.start_date,g.end_date)}
            </h2>
            <p style={{
              margin:0,color:'var(--muted)',fontSize:'.82rem',
              lineHeight:1.35
            }}>
              {g.description||'Haz que este Brinkkando sea inolvidable.'}
            </p>
          </div>
        </div>

        {mode==='player'&&<button type="button" onClick={()=>openPage('brinkkers')} style={{
          width:'100%',
          marginTop:'12px',
          padding:'9px 0 0',
          border:0,
          borderTop:'1px solid rgba(23,63,53,.08)',
          background:'transparent',
          color:'inherit',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          gap:'10px',
          textAlign:'left'
        }}>
          <span>
            <strong style={{fontSize:'.82rem'}}>{brinkkers.length} {brinkkers.length===1?'Brinkker':'Brinkkers'}</strong>
          </span>
          <span style={{display:'flex',alignItems:'center'}}>
            {brinkkers.slice(0,5).map((q,index)=><span key={q.user_id} style={{
              width:'30px',height:'30px',borderRadius:'10px',
              background:q.profile_color||'#e7eee9',
              display:'grid',placeItems:'center',
              fontSize:'1rem',
              marginLeft:index===0?0:'-6px',
              border:'2px solid #fffdf7'
            }}>{q.avatar_emoji||'🧭'}</span>)}
            {brinkkers.length>5&&<small style={{marginLeft:'7px',fontWeight:'900',color:'var(--muted)'}}>
              +{brinkkers.length-5}
            </small>}
          </span>
        </button>}
      </section>

      {mode==='admin'&&<section className="card" style={{marginTop:'14px',padding:'16px 18px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div>
            <p className="eyebrow" style={{marginBottom:'4px',fontSize:'.67rem',letterSpacing:'.08em'}}>CÓDIGO DE INVITACIÓN</p>
            <strong style={{fontSize:'1.03rem',letterSpacing:'.12em'}}>{g.invite_code}</strong>
          </div>
          <button className="secondary" onClick={copyCode}><Copy size={17}/>{copied?'Copiado':'Copiar'}</button>
        </div>
      </section>}

      {mode==='expenses'?<>
        <section className="card" style={{
          marginTop:'12px',padding:'16px',
          border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'
        }}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>RESUMEN</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'9px'}}>
            <div style={{padding:'13px',borderRadius:'14px',background:'#f3f0e8'}}>
              <small style={{display:'block',color:'var(--muted)',fontWeight:'850'}}>TOTAL DEL GRUPO</small>
              <strong style={{fontSize:'1.18rem'}}>{totalExpenses.toFixed(2)} €</strong>
            </div>
            <div style={{padding:'13px',borderRadius:'14px',background:'#f3f0e8'}}>
              <small style={{display:'block',color:'var(--muted)',fontWeight:'850'}}>TU BALANCE</small>
              <strong style={{fontSize:'1.18rem',color:Number(myExpenseBalance?.balance||0)>=0?'#24715a':'#a13f3f'}}>
                {Number(myExpenseBalance?.balance||0)>0?'+':''}{Number(myExpenseBalance?.balance||0).toFixed(2)} €
              </strong>
            </div>
          </div>
          <small style={{display:'block',color:'var(--muted)',marginTop:'9px'}}>Si tu balance es positivo, el grupo te debe dinero.</small>
        </section>

        <div style={{
          display:'flex',justifyContent:'space-between',alignItems:'center',
          gap:'12px',marginTop:'14px'
        }}>
          <div>
            <p className="eyebrow" style={{marginBottom:'2px',fontSize:'.67rem',letterSpacing:'.08em'}}>MOVIMIENTOS</p>
            <strong style={{fontSize:'1.03rem'}}>Gastos del grupo</strong>
          </div>
          <button type="button" className="primary"
            onClick={()=>{
              if(expenseFormOpen){
                setEditingExpenseId(null);
                setExpenseForm(blankExpenseForm());
                setExpenseFormOpen(false);
              }else{
                setExpenseFormOpen(true);
              }
            }}
            style={{padding:'9px 11px'}}>
            <Plus size={16}/>{expenseFormOpen?'Cerrar':'Añadir'}
          </button>
        </div>

        {expenseFormOpen&&<form className="card" onSubmit={saveExpense} style={{
          padding:'17px',marginTop:'10px',
          border:'1px solid rgba(23,63,53,.10)',
          boxShadow:'0 10px 24px rgba(23,63,53,.06)'
        }}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{editingExpenseId?'EDITAR GASTO':'NUEVO GASTO'}</p>

          <label>Concepto
            <input required value={expenseForm.description}
              onChange={e=>setExpenseForm({...expenseForm,description:e.target.value})}
              placeholder="Cena, hotel, gasolina…"/>
          </label>

          <label>Importe total (€)
            <input required type="number" min="0.01" step="0.01"
              value={expenseForm.amount}
              onChange={e=>setExpenseForm({...expenseForm,amount:e.target.value})}
              placeholder="84.00"/>
          </label>

          <label>¿Quién pagó?
            <select value={expenseForm.payer_user_id}
              onChange={e=>setExpenseForm({...expenseForm,payer_user_id:e.target.value})}>
              <option value="">Selecciona un Brinkker</option>
              {brinkkers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}
            </select>
          </label>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',margin:'14px 0 8px'}}>
            <p className="eyebrow" style={{margin:0,fontSize:'.67rem',letterSpacing:'.08em'}}>¿QUIÉNES PARTICIPAN?</p>
            <button type="button" className="secondary" onClick={toggleAllExpenseParticipants}>
              {expenseForm.participant_ids.length===brinkkers.length?'Quitar todos':'Todos'}
            </button>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'7px'}}>
            {brinkkers.map(q=>{
              const selected=expenseForm.participant_ids.includes(q.user_id);
              return <button type="button" key={q.user_id}
                onClick={()=>toggleExpenseParticipant(q.user_id)}
                style={{
                  border:selected?'2px solid #2f7563':'1px solid #d8d3c6',
                  borderRadius:'12px',
                  padding:'9px',
                  background:selected?'#eef6f2':'white',
                  display:'flex',
                  alignItems:'center',
                  gap:'7px',
                  color:'inherit',
                  textAlign:'left',
                  minWidth:0
                }}>
                <span style={{
                  width:'25px',height:'25px',borderRadius:'8px',
                  display:'grid',placeItems:'center',
                  background:selected?'#2f7563':'#eef3ef',
                  color:selected?'white':'#62736d',
                  flexShrink:0
                }}>{selected?<Check size={15}/>:''}</span>
                <span style={{
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                  fontWeight:'850',fontSize:'.84rem'
                }}>{q.nickname}</span>
              </button>
            })}
          </div>

          {expenseForm.participant_ids.length>0&&Number(expenseForm.amount)>0&&
            <small style={{display:'block',marginTop:'9px',color:'var(--muted)',fontWeight:'800'}}>
              ≈ {(Number(expenseForm.amount)/expenseForm.participant_ids.length).toFixed(2)} € por Brinkker
            </small>}

          <label style={{marginTop:'12px'}}>Nota
            <input value={expenseForm.notes}
              onChange={e=>setExpenseForm({...expenseForm,notes:e.target.value})}
              placeholder="Opcional"/>
          </label>

          <div className="actions" style={{gap:'8px'}}>
            <button className="primary" disabled={expenseBusy}>
              <Receipt size={17}/>{expenseBusy?'Guardando…':editingExpenseId?'Guardar cambios':'Añadir gasto'}
            </button>
            <button type="button" className="secondary" onClick={()=>{
              setEditingExpenseId(null);
              setExpenseForm(blankExpenseForm());
              setExpenseFormOpen(false);
            }}>Cancelar</button>
          </div>

          {expenseMessage&&<p className="msg">{expenseMessage}</p>}
        </form>}


        <section className="card" style={{padding:'15px',marginTop:'20px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>BALANCE</p>
          <div style={{display:'grid',gap:'7px'}}>
            {adjustedExpenseBalances().map(row=><div key={row.user_id} style={{display:'flex',alignItems:'center',gap:'9px',padding:'9px 0',borderBottom:'1px solid #e5e0d5'}}>
              <span style={{fontSize:'1.01rem'}}>{row.avatar_emoji||'🧭'}</span><strong style={{flex:1}}>{row.nickname}</strong>
              <strong style={{color:Number(row.balance)>=0?'#24715a':'#a13f3f'}}>{Number(row.balance)>0?'+':''}{Number(row.balance).toFixed(2)} €</strong>
            </div>)}
          </div>
        </section>

        <section className="card" style={{padding:'15px',marginTop:'14px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>SALDAR CUENTAS</p>
          <h2 style={{marginBottom:'12px'}}>Quién paga a quién</h2>
          <div style={{display:'grid',gap:'8px'}}>
            {expenseTransfers().map((t,index)=><div key={`${t.from}-${t.to}-${index}`} style={{padding:'11px',borderRadius:'13px',background:'#f3f0e8'}}>
              <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto minmax(0,1fr)',gap:'8px',alignItems:'center'}}>
                <strong>{t.from}</strong><span style={{display:'grid',justifyItems:'center'}}><small style={{fontWeight:'950'}}>{t.amount.toFixed(2)} €</small><ArrowRightLeft size={16}/></span><strong style={{textAlign:'right'}}>{t.to}</strong>
              </div>
              <div style={{
                display:'flex',justifyContent:'flex-end',
                gap:'7px',marginTop:'8px',flexWrap:'wrap'
              }}>
                <button type="button" className="secondary"
                  onClick={()=>copyExpensePhone(t.to_user_id,t.to)}
                  style={{padding:'7px 9px'}}>
                  <Phone size={14}/>
                  {copiedExpensePhone===t.to_user_id?'Teléfono copiado':'Copiar teléfono'}
                </button>

                {t.from_user_id===session?.user?.id&&
                  <button type="button" className="primary"
                    disabled={settlementBusy}
                    onClick={()=>markExpensePaid(t)}
                    style={{padding:'7px 9px'}}>
                    <CheckCircle2 size={14}/>
                    {settlementBusy?'Guardando…':'Ya he pagado'}
                  </button>}
              </div>
            </div>)}
            {!expenseTransfers().length&&<p style={{margin:0,color:'var(--muted)'}}>Las cuentas están saldadas. 🎉</p>}
          </div>
        </section>

        <section style={{marginTop:'20px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>HISTORIAL</p>
          <div style={{display:'grid',gap:'9px'}}>
            {expensesLoading&&<article className="card" style={{padding:'16px'}}>Cargando gastos…</article>}
            {!expensesLoading&&expenses.map(item=><article className="card" key={item.expense_id} style={{
              padding:'13px 14px',
              border:'1px solid rgba(23,63,53,.09)',
              boxShadow:'none'
            }}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'11px'}}>
                <span style={{fontSize:'1.22rem'}}>💶</span>
                <div style={{flex:1,minWidth:0}}>
                  <strong>{item.description}</strong>
                  <small style={{display:'block',color:'var(--muted)'}}>Pagó {item.payer_nickname} · {item.participant_count} {item.participant_count===1?'Brinkker':'Brinkkers'}</small>
                  <small style={{display:'block',color:'var(--muted)'}}>{item.participant_names}</small>
                  {item.notes&&<small style={{display:'block',marginTop:'4px'}}>{item.notes}</small>}
                </div>
                <strong style={{whiteSpace:'nowrap'}}>{Number(item.amount).toFixed(2)} €</strong>
              </div>
              {item.can_edit&&<div className="actions" style={{marginTop:'9px'}}>
                <button className="secondary" disabled={expenseBusy} onClick={()=>editExpense(item)}><Pencil size={15}/>Editar</button>
                <button className="secondary" disabled={expenseBusy} onClick={()=>deleteExpense(item.expense_id)}><Trash2 size={15}/>Borrar</button>
              </div>}
            </article>)}
            {!expensesLoading&&!expenses.length&&<article className="card" style={{padding:'16px'}}>💶 Todavía no hay gastos.</article>}
          </div>

          {expenseSettlements.length>0&&<>
            <p className="eyebrow" style={{marginTop:'16px',marginBottom:'7px',fontSize:'.67rem',letterSpacing:'.08em'}}>
              PAGOS SALDADOS
            </p>
            <div style={{display:'grid',gap:'7px'}}>
              {[...expenseSettlements].reverse().map(payment=>{
                const payer=expenseBrinkkerName(payment.payer_user_id);
                const receiver=expenseBrinkkerName(payment.receiver_user_id);
                return <article className="card" key={payment.id} style={{
                  padding:'10px 12px',
                  border:'1px solid rgba(23,63,53,.08)',
                  boxShadow:'none'
                }}>
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'30px minmax(0,1fr) auto',
                    gap:'9px',
                    alignItems:'center'
                  }}>
                    <span style={{
                      width:'30px',height:'30px',borderRadius:'10px',
                      display:'grid',placeItems:'center',
                      background:'#eef6f2',fontSize:'1rem'
                    }}>✓</span>
                    <div style={{minWidth:0}}>
                      <strong style={{display:'block',fontSize:'.84rem'}}>
                        {payer} pagó a {receiver}
                      </strong>
                      <small style={{display:'block',color:'var(--muted)',marginTop:'1px'}}>
                        {formatSettlementDate(payment.created_at)}
                      </small>
                    </div>
                    <strong style={{whiteSpace:'nowrap',color:'#24715a',fontSize:'.86rem'}}>
                      {Number(payment.amount||0).toFixed(2)} €
                    </strong>
                  </div>
                </article>
              })}
            </div>
          </>}
        </section>

      </>:mode==='player'?<>
        {stages.length>0&&(()=>{
          const today=new Date().toISOString().slice(0,10);
          const current=stages.find(s=>s.stage_date===today)
            ||stages.find(s=>s.stage_date&&s.stage_date>today)
            ||stages[stages.length-1];
          if(!current)return null;
          return <button className="card" onClick={()=>openPage('stages')} style={{
            width:'100%',marginTop:'10px',padding:'13px 15px',
            color:'inherit',textAlign:'left',
            border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'
          }}>
            <p className="eyebrow" style={{marginBottom:'4px',fontSize:'.67rem',letterSpacing:'.08em'}}>PLAN DE HOY</p>
            <strong style={{fontSize:'1.01rem'}}>
              {current.same_place?'🏡 Día en el mismo lugar':`${current.origin} → ${current.destination}`}
            </strong>
            <small style={{display:'block',color:'var(--muted)',marginTop:'5px'}}>
              {current.same_place
                ?current.origin
                :`${transportLabels[current.transport_mode]||'🧭 Trayecto'}${current.distance_km!=null?` · ${current.distance_km} km`:''}`}
            </small>
            {current.resolved_accommodation_name&&<small style={{display:'block',marginTop:'6px'}}>
              🏨 {current.resolved_accommodation_name}
            </small>}
          </button>
        })()}

        {auction&&auction.status==='open'&&(()=>{
          const lot=activeAuctionLot();
          if(!lot)return null;
          const seconds=auctionSecondsLeft(lot);
          const iLead=lot.current_bidder_user_id===session?.user?.id;

          return <section style={{marginTop:'16px'}}>
            <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>
              🔨 SUBASTA EN DIRECTO
            </p>

            <article className="card" style={{
              padding:'14px',
              border:'1px solid rgba(214,166,62,.38)',
              boxShadow:'0 8px 22px rgba(23,63,53,.06)'
            }}>
              <div style={{
                display:'flex',justifyContent:'space-between',
                alignItems:'center',gap:'10px'
              }}>
                <small style={{fontWeight:'900',color:'var(--muted)'}}>
                  LOTE {lot.lot_order} DE {auction.total_lots}
                </small>

                <span style={{
                  padding:'6px 9px',borderRadius:'999px',
                  background:seconds<=10?'#fff0e8':'#f3f0e8',
                  fontWeight:'950',fontSize:'.78rem',
                  color:seconds<=10?'#a34b25':'inherit'
                }}>
                  ⏱ {seconds}s
                </span>
              </div>

              <div style={{
                display:'grid',
                gridTemplateColumns:'48px minmax(0,1fr)',
                gap:'11px',alignItems:'center',marginTop:'10px'
              }}>
                <div style={{
                  width:'48px',height:'48px',borderRadius:'15px',
                  display:'grid',placeItems:'center',
                  background:'#eef3ef',fontSize:'1.5rem'
                }}>{lot.emoji}</div>

                <div style={{minWidth:0}}>
                  <strong style={{display:'block',fontSize:'1.03rem'}}>
                    {lot.advantage_name}
                  </strong>
                  <small style={{
                    display:'block',color:'var(--muted)',
                    lineHeight:1.35,marginTop:'2px'
                  }}>{lot.description}</small>
                </div>
              </div>

              <div style={{
                textAlign:'center',
                padding:'13px 10px',
                marginTop:'11px',
                borderRadius:'14px',
                background:'#f3f0e8'
              }}>
                <small style={{
                  display:'block',
                  color:'var(--muted)',
                  fontWeight:'850'
                }}>PUJA ACTUAL</small>

                <strong style={{fontSize:'1.65rem'}}>
                  {Number(lot.current_bid||0)} 🪙
                </strong>

                <small style={{
                  display:'block',
                  marginTop:'2px',
                  fontWeight:'850',
                  color:iLead?'#24715a':'var(--muted)'
                }}>
                  {lot.current_bidder_nickname
                    ?(iLead?'🔥 Vas ganando':`Lidera ${lot.current_bidder_nickname}`)
                    :'Todavía no hay pujas'}
                </small>
              </div>

              <div style={{
                display:'flex',
                justifyContent:'space-between',
                gap:'8px',
                marginTop:'10px',
                color:'var(--muted)',
                fontSize:'.78rem'
              }}>
                <span>Tu saldo</span>
                <strong style={{color:'inherit'}}>
                  🪙 {Number(auctionWallet.balance||0)}
                </strong>
              </div>

              {!iLead&&seconds>0&&<div style={{
                display:'grid',
                gridTemplateColumns:'repeat(4,minmax(0,1fr))',
                gap:'6px',marginTop:'11px'
              }}>
                {[5,10,20].map(value=>
                  <button key={value}
                    type="button"
                    className="secondary"
                    disabled={auctionBusy}
                    onClick={()=>placeLiveBid(lot,value,false)}
                    style={{padding:'10px 4px',fontSize:'.78rem'}}>
                    +{value}
                  </button>
                )}

                <button type="button"
                  className="primary"
                  disabled={auctionBusy||Number(auctionWallet.balance||0)<=Number(lot.current_bid||0)}
                  onClick={()=>placeLiveBid(lot,0,true)}
                  style={{padding:'10px 4px',fontSize:'.72rem'}}>
                  🔥 ALL IN
                </button>
              </div>}

              {iLead&&<p style={{
                textAlign:'center',margin:'10px 0 0',
                color:'#24715a',fontWeight:'900',fontSize:'.8rem'
              }}>
                Ahora solo queda aguantar 😈
              </p>}

              {auctionMessage&&<p className="msg" style={{marginTop:'9px'}}>
                {auctionMessage}
              </p>}
            </article>
          </section>
        })()}

        <section style={{marginTop:'20px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>RETOS DEL DÍA</p>
          <div style={{display:'grid',gap:'7px'}}>
            {dailyLoading&&<article className="card" style={{padding:'13px 15px'}}>Cargando retos…</article>}
            {!dailyLoading&&dailyError&&<article className="card" style={{padding:'13px 15px',color:'#a13f3f'}}>
              {dailyError}
            </article>}
            {!dailyLoading&&!dailyError&&dailyChallenges.map((item,index)=>{
              const isExpanded=expandedDailyChallenge===item.daily_challenge_id;
              return <button
                type="button"
                className="card"
                key={item.daily_challenge_id}
                onClick={()=>setExpandedDailyChallenge(
                  isExpanded?null:item.daily_challenge_id
                )}
                aria-expanded={isExpanded}
                style={{
                  width:'100%',
                  padding:'11px 12px',
                  display:'grid',
                  gridTemplateColumns:'25px minmax(0,1fr) auto',
                  alignItems:'center',
                  gap:'9px',
                  minWidth:0,
                  maxWidth:'100%',
                  overflow:'hidden',
                  border:'1px solid rgba(23,63,53,.09)',
                  color:'inherit',
                  textAlign:'left'
                }}
              >
                <span style={{
                  width:'25px',
                  height:'25px',
                  borderRadius:'8px',
                  background:isExpanded?'#2f7563':'#eef3ef',
                  color:isExpanded?'white':'inherit',
                  display:'grid',
                  placeItems:'center',
                  fontSize:'.74rem',
                  fontWeight:'950'
                }}>{index+1}</span>

                <strong style={{
                  display:'block',
                  minWidth:0,
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:'nowrap',
                  fontSize:'.94rem'
                }}>{item.title}</strong>

                <strong style={{
                  fontSize:'.76rem',
                  whiteSpace:'nowrap'
                }}>⭐ {item.points}</strong>

                {isExpanded&&<p style={{
                  gridColumn:'2 / 4',
                  margin:'2px 0 2px',
                  color:'var(--muted)',
                  lineHeight:1.45,
                  fontSize:'.82rem',
                  whiteSpace:'normal',
                  overflowWrap:'anywhere'
                }}>{item.description}</p>}
              </button>
            })}
            {!dailyLoading&&!dailyError&&!dailyChallenges.length&&<article className="card" style={{padding:'13px 15px'}}>
              ✨ No hay retos disponibles para hoy.
            </article>}
          </div>
        </section>
      </>:<section style={{display:'grid',gap:'8px',marginTop:'14px'}}>
        {adminSections.map(section=>
          <button className="card" key={section.id} onClick={()=>openPage(section.id)} style={{
            width:'100%',
            padding:'13px 14px',
            display:'grid',
            gridTemplateColumns:'minmax(0,1fr) auto',
            alignItems:'center',
            gap:'10px',
            textAlign:'left',
            color:'inherit',
            border:'1px solid rgba(23,63,53,.09)',
            boxShadow:'none'
          }}>
            <span style={{minWidth:0}}>
              <strong style={{display:'block',fontSize:'.95rem'}}>{section.label}</strong>
              <small style={{display:'block',color:'var(--muted)',marginTop:'2px'}}>
                {section.detail}
              </small>
            </span>
            <span style={{fontSize:'1.04rem',color:'var(--muted)',lineHeight:1}}>›</span>
          </button>
        )}
      </section>}
    </>:page==='ranking'?<>
      <section className="card" style={{
        padding:'14px 15px',
        border:'1px solid rgba(23,63,53,.09)',
        boxShadow:'none'
      }}>
        <p className="eyebrow" style={{marginBottom:'2px',fontSize:'.67rem',letterSpacing:'.08em'}}>CLASIFICACIÓN</p>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:'10px'}}>
          <h2 style={{margin:0,fontSize:'1.04rem'}}>Así va el Brinkkando</h2>
          <small style={{color:'var(--muted)',fontWeight:'800'}}>{ranking.length} Brinkkers</small>
        </div>
      </section>
      <section style={{display:'grid',gap:'5px',marginTop:'8px'}}>
        {rankingLoading&&<article className="card" style={{padding:'15px'}}>Cargando clasificación…</article>}
        {rankingError&&<article className="card" style={{padding:'15px',color:'#a13f3f'}}>{rankingError}</article>}
        {!rankingLoading&&!rankingError&&ranking.map((q,index)=>
          <article className="card" key={q.user_id} style={{
            padding:'8px 11px',
            display:'grid',
            gridTemplateColumns:'26px 34px minmax(0,1fr) auto',
            alignItems:'center',
            gap:'8px',
            minHeight:'50px',
            border:index<3?'1px solid rgba(214,166,62,.28)':'1px solid rgba(23,63,53,.07)',
            boxShadow:'none'
          }}>
            <div style={{
              width:'26px',
              fontSize:index<3?'1.15rem':'.8rem',
              fontWeight:'950',
              textAlign:'center'
            }}>{topThree[index]||`${index+1}.`}</div>
            <div style={{
              width:'34px',height:'34px',borderRadius:'10px',
              background:q.profile_color||'#e7eee9',
              display:'grid',placeItems:'center',fontSize:'1.04rem'
            }}>{q.avatar_emoji||'🧭'}</div>
            <strong style={{
              minWidth:0,overflow:'hidden',textOverflow:'ellipsis',
              whiteSpace:'nowrap',fontSize:'.82rem'
            }}>{q.nickname}</strong>
            <strong style={{fontSize:'.95rem',whiteSpace:'nowrap'}}>
              {q.total_points} <small style={{fontSize:'.68rem',color:'var(--muted)'}}>pt</small>
            </strong>
          </article>
        )}
      </section>
      <section className="card" style={{
        marginTop:'10px',
        padding:'0',
        overflow:'hidden',
        border:'1px solid rgba(23,63,53,.08)',
        boxShadow:'none'
      }}>
        <button type="button" onClick={()=>setHistoryOpen(!historyOpen)} style={{
          width:'100%',
          border:0,
          background:'transparent',
          color:'inherit',
          padding:'12px 14px',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          gap:'10px',
          textAlign:'left'
        }}>
          <span>
            <strong style={{display:'block',fontSize:'.82rem'}}>Últimos movimientos</strong>
            <small style={{color:'var(--muted)'}}>{pointHistory.length} movimientos</small>
          </span>
          <ChevronDown size={18} style={{
            transform:historyOpen?'rotate(180deg)':'rotate(0deg)',
            transition:'transform .18s ease'
          }}/>
        </button>

        {historyOpen&&<div style={{
          borderTop:'1px solid rgba(23,63,53,.07)',
          padding:'4px 12px 10px'
        }}>
          {historyLoading&&<p style={{margin:'9px 0',color:'var(--muted)',fontSize:'.82rem'}}>
            Cargando historial…
          </p>}

          {!historyLoading&&pointHistory.slice(0,historyShowAll?pointHistory.length:10).map(move=>
            <div key={move.movement_id} style={{
              display:'grid',
              gridTemplateColumns:'minmax(0,1fr) auto',
              gap:'9px',
              padding:'7px 2px',
              borderBottom:'1px solid rgba(23,63,53,.055)',
              alignItems:'baseline'
            }}>
              <span style={{
                minWidth:0,fontSize:'.8rem',
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'
              }}>
                <strong>{move.nickname}</strong>
                <span style={{color:'var(--muted)'}}> · {move.reason}</span>
              </span>
              <strong style={{
                fontSize:'.8rem',
                color:move.amount>0?'#24715a':'#a13f3f',
                whiteSpace:'nowrap'
              }}>{move.amount>0?'+':''}{move.amount}</strong>
            </div>
          )}

          {!historyLoading&&!pointHistory.length&&<p style={{
            margin:'9px 2px',color:'var(--muted)',fontSize:'.82rem'
          }}>Todavía no hay movimientos.</p>}

          {!historyLoading&&pointHistory.length>10&&<button type="button"
            onClick={()=>setHistoryShowAll(!historyShowAll)}
            style={{
              width:'100%',border:0,background:'transparent',
              color:'#2f7563',fontWeight:'900',fontSize:'.78rem',
              padding:'10px 4px 2px'
            }}>
            {historyShowAll?'Ver menos':`Ver todos (${pointHistory.length})`}
          </button>}
        </div>}
      </section>
    </>:page==='challenges'?<>
      <section className="card" style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>MISIONES ESPECIALES</p>
        <h2 style={{margin:'0 0 3px',fontSize:'1.08rem'}}>Tus retos</h2>
        <p style={{color:'var(--muted)',margin:0,fontSize:'.80rem',lineHeight:1.35}}>Aquí aparecen sobres secretos, retos de equipo y misiones manuales.</p>
      </section>
      <section style={{display:'grid',gap:'11px',marginTop:'14px'}}>
        {specialLoading&&<article className="card" style={{padding:'15px'}}>Cargando retos…</article>}
        {!specialLoading&&specialChallenges.map(item=><article className="card" key={item.group_id} style={{padding:'15px'}}>
          <div style={{display:'flex',justifyContent:'space-between',gap:'12px'}}>
            <div>
              <p className="eyebrow" style={{marginBottom:'5px',fontSize:'.67rem',letterSpacing:'.08em'}}>{kindLabel[item.kind]}</p>
              <h2 style={{fontSize:'1.04rem',marginBottom:'5px'}}>{item.title}</h2>
            </div>
            <span style={{fontSize:'.75rem',fontWeight:'900',padding:'6px 8px',borderRadius:'999px',background:'#eef3ef',height:'fit-content'}}>
              {statusLabel[item.group_status]}
            </span>
          </div>
          <p style={{color:'var(--muted)'}}>{item.description}</p>
          {(item.kind==='secret_team'||item.kind==='random_team')&&<p style={{fontWeight:'800'}}>Equipo: {item.member_names}</p>}
          <strong>⭐ {item.points} pt por Brinkker</strong>
          {(item.group_status==='pending'||item.group_status==='rejected')&&
            <button className="primary wide" style={{marginTop:'14px'}} onClick={()=>submitSpecial(item.group_id)}>
              <Send size={17}/>Enviar a revisión
            </button>}
        </article>)}
        {!specialLoading&&!specialChallenges.length&&<article className="card" style={{padding:'15px'}}>No tienes misiones especiales pendientes.</article>}
      </section>
    </>:page==='packs'&&mode==='admin'?<>
      <section className="card" style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>BIBLIOTECA DE PACKS</p>
        <h2 style={{marginBottom:'4px'}}>Elige qué tipo de viaje quieres jugar</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>
          Solo se usarán en las rondas aleatorias los packs y pruebas que estén activos.
        </p>
      </section>

      <section style={{display:'grid',gap:'8px',marginTop:'12px'}}>
        {packs.map(pack=><article className="card" key={pack.pack_id} style={{
          padding:'16px',
          border:pack.is_enabled?'2px solid #2f7563':'1px solid rgba(23,63,53,.11)'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',minWidth:0}}>
            <div style={{width:'46px',height:'46px',borderRadius:'15px',background:'#eef3ef',display:'grid',placeItems:'center',fontSize:'1.45rem'}}>
              {pack.emoji||'🎒'}
            </div>
            <div style={{flex:1}}>
              <strong>{pack.name}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>
                {pack.enabled_templates}/{pack.total_templates} pruebas activas
              </small>
            </div>
            <button className={pack.is_enabled?'primary':'secondary'} disabled={packBusy}
              onClick={()=>togglePack(pack)}>
              {pack.is_enabled?'Activo':'Activar'}
            </button>
          </div>
          {pack.description&&<p style={{color:'var(--muted)',margin:'12px 0 0'}}>{pack.description}</p>}
          <button className="secondary wide" style={{marginTop:'12px'}} onClick={async()=>{
            setSelectedPackId(pack.pack_id);
            await loadPackTemplates(pack.pack_id);
          }}>
            <PackageOpen size={17}/>Gestionar pruebas
          </button>
        </article>)}
      </section>

      {selectedPackId&&<section className="card" style={{padding:'17px',marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>PRUEBAS DEL PACK</p>
        <h2 style={{marginBottom:'14px'}}>
          {packs.find(pack=>pack.pack_id===selectedPackId)?.name||'Pack'}
        </h2>

        <div style={{display:'grid',gap:'8px'}}>
          {packTemplates.map(template=><button key={template.template_id} disabled={packBusy}
            onClick={()=>togglePackTemplate(template)} style={{
              border:template.is_enabled?'2px solid #2f7563':'1px solid #d8d3c6',
              borderRadius:'14px',
              padding:'14px',
              background:template.is_enabled?'#eef6f2':'white',
              display:'flex',
              alignItems:'center',
              gap:'12px',
              color:'inherit',
              textAlign:'left'
            }}>
            <span style={{width:'28px',height:'28px',borderRadius:'9px',display:'grid',placeItems:'center',
              background:template.is_enabled?'#2f7563':'#eef3ef',color:template.is_enabled?'white':'#62736d'}}>
              {template.is_enabled?<Check size={17}/>:''}
            </span>
            <span style={{flex:1}}>
              <strong>{template.title}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>{template.description}</small>
            </span>
            <small style={{fontWeight:'900'}}>{template.audience==='team'?'Equipo':template.audience==='both'?'Ambos':'Individual'} · {template.points} pt</small>
          </button>)}
          {!packTemplates.length&&<article style={{padding:'14px',color:'var(--muted)'}}>Este pack todavía no tiene pruebas.</article>}
        </div>

        <form onSubmit={createPackTemplate} style={{marginTop:'20px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>AÑADIR PRUEBA</p>
          <label>Título<input value={newTemplate.title} onChange={e=>setNewTemplate({...newTemplate,title:e.target.value})}/></label>
          <label>Descripción<textarea rows="3" value={newTemplate.description} onChange={e=>setNewTemplate({...newTemplate,description:e.target.value})}/></label>
          <div className="cols">
            <label>Tipo<select value={newTemplate.audience} onChange={e=>setNewTemplate({...newTemplate,audience:e.target.value})}>
              <option value="individual">Individual</option>
              <option value="team">Equipo</option>
              <option value="both">Ambos</option>
            </select></label>
            <label>Puntos<input type="number" min="0" step="1" value={newTemplate.points} onChange={e=>setNewTemplate({...newTemplate,points:e.target.value})}/></label>
          </div>
          <button className="primary wide" disabled={packBusy}><Plus size={18}/>Añadir prueba</button>
        </form>
      </section>}

      <form className="card" onSubmit={createCustomPack} style={{padding:'17px',marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>CREAR PACK PROPIO</p>
        <h2 style={{marginBottom:'14px'}}>Tu propia colección</h2>
        <div className="cols">
          <label>Nombre<input value={newPack.name} onChange={e=>setNewPack({...newPack,name:e.target.value})} placeholder="Galicia salvaje"/></label>
          <label>Emoji<input maxLength="4" value={newPack.emoji} onChange={e=>setNewPack({...newPack,emoji:e.target.value})}/></label>
        </div>
        <label>Descripción<textarea rows="3" value={newPack.description} onChange={e=>setNewPack({...newPack,description:e.target.value})}/></label>
        <button className="primary wide" disabled={packBusy}><Plus size={18}/>Crear pack</button>
        {packMessage&&<p className="msg">{packMessage}</p>}
      </form>
    </>:page==='adminChallenges'&&mode==='admin'?<>
      <section className="card" style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>RETOS DEL DÍA</p>
        <h2 style={{marginBottom:'4px'}}>Cinco retos automáticos cada día</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>
          Brinkkando selecciona los mismos cinco retos para todo el grupo y los renueva
          automáticamente cada madrugada. No requieren validación: cuando alguien los
          complete, asigna los puntos manualmente desde Puntos.
        </p>
      </section>

      <section className="card" style={{padding:'17px',marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>SOBRES ALEATORIOS</p>
        <h2 style={{marginBottom:'5px'}}>Reparto completamente ciego</h2>
        <p style={{color:'var(--muted)'}}>
          Brinkkando elige y reparte las pruebas dentro de Supabase. Como Admin solo verás
          cuántos sobres o equipos se han creado, nunca las asignaciones.
        </p>

        <div style={{display:'grid',gap:'10px',marginTop:'16px'}}>
          <button className="primary wide" disabled={roundBusy||brinkkers.length<1}
            onClick={()=>distributeBlindEnvelopes('individual')}>
            <Lock size={18}/>{roundBusy?'Repartiendo…':'Enviar un sobre diferente a todos'}
          </button>

          <button className="secondary wide" disabled={roundBusy||brinkkers.length<2}
            onClick={()=>distributeBlindEnvelopes('team')}>
            <Handshake size={18}/>{roundBusy?'Formando equipos…':'Crear equipos y repartir sobres'}
          </button>
        </div>

        <small style={{display:'block',color:'var(--muted)',marginTop:'12px'}}>
          Los equipos se equilibran automáticamente. Nadie queda fuera; con tres Brinkkers,
          uno puede recibir una misión individual dentro de la ronda de equipos.
        </small>
      </section>

      <section style={{marginTop:'18px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>ÚLTIMAS RONDAS CIEGAS</p>
        <div style={{display:'grid',gap:'8px'}}>
          {envelopeRounds.map(round=><article className="card" key={round.round_id}
            style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'1.4rem'}}>{round.round_type==='individual'?'🔒':'🤝'}</span>
            <div style={{flex:1}}>
              <strong>{round.round_type==='individual'?'Sobres individuales':'Sobres por equipos'}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>
                {round.assignment_count} {round.round_type==='individual'?'sobres enviados':'equipos creados'}
              </small>
            </div>
            <small style={{color:'var(--muted)'}}>
              {new Date(round.created_at).toLocaleDateString('es-ES')}
            </small>
          </article>)}
          {!envelopeRounds.length&&<article className="card" style={{padding:'16px'}}>
            Todavía no se han enviado rondas aleatorias.
          </article>}
        </div>
      </section>

      <form className="card" onSubmit={createChallenge} style={{padding:'17px',marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>SOBRE PERSONALIZADO</p>
        <h2 style={{marginBottom:'5px'}}>Escribe una prueba puntual</h2>
        <p style={{color:'var(--muted)'}}>
          Selecciona manualmente una persona, varias o todo el grupo. Aquí sí conoces
          la prueba porque la estás creando tú.
        </p>

        <label>Título
          <input value={challengeForm.title}
            onChange={e=>setChallengeForm({...challengeForm,title:e.target.value})}
            placeholder="La misión imposible"/>
        </label>
        <label>Descripción
          <textarea rows="4" value={challengeForm.description}
            onChange={e=>setChallengeForm({...challengeForm,description:e.target.value})}
            placeholder="Explica lo que deben conseguir…"/>
        </label>
        <label>Puntos por Brinkker
          <input type="number" min="0" step="1" value={challengeForm.points}
            onChange={e=>setChallengeForm({...challengeForm,points:e.target.value})}/>
        </label>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'10px',marginTop:'15px'}}>
          <p className="eyebrow" style={{margin:0,fontSize:'.67rem',letterSpacing:'.08em'}}>DESTINATARIOS</p>
          <button type="button" className="secondary"
            onClick={()=>setChallengeForm(form=>({
              ...form,
              recipient_ids:form.recipient_ids.length===brinkkers.length
                ?[]
                :brinkkers.map(q=>q.user_id)
            }))}>
            {challengeForm.recipient_ids.length===brinkkers.length?'Quitar todos':'Seleccionar todos'}
          </button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:'8px',margin:'12px 0 16px'}}>
          {brinkkers.map(q=><button type="button" key={q.user_id}
            onClick={()=>toggleRecipient(q.user_id)} style={{
              border:challengeForm.recipient_ids.includes(q.user_id)
                ?'2px solid #2f7563'
                :'1px solid #d8d3c6',
              borderRadius:'13px',
              padding:'10px',
              background:challengeForm.recipient_ids.includes(q.user_id)
                ?'#eef6f2'
                :'white',
              display:'flex',
              alignItems:'center',
              gap:'8px',
              fontWeight:'800',
              color:'inherit'
            }}>
            <span>{q.avatar_emoji||'🧭'}</span>{q.nickname}
          </button>)}
        </div>

        <button className="primary wide" disabled={challengeBusy}>
          <Send size={18}/>{challengeBusy?'Enviando…':'Enviar sobre personalizado'}
        </button>
        {challengeMessage&&<p className="msg">{challengeMessage}</p>}
      </form>

      <section style={{marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>SOBRES PENDIENTES DE VALIDAR</p>
        <div style={{display:'grid',gap:'10px'}}>
          {adminSpecialReviews.map(item=><article className="card" key={item.group_id} style={{padding:'17px'}}>
            <strong>{item.is_blind
              ?(item.kind==='random_team'?'Reto aleatorio de equipo':'Sobre aleatorio individual')
              :item.title}</strong>
            <small style={{display:'block',color:'var(--muted)',margin:'5px 0'}}>
              {item.is_blind
                ?'Asignación oculta para el Admin'
                :`Integrantes: ${item.member_names}`}
            </small>
            <small style={{display:'block',color:'var(--muted)',marginBottom:'12px'}}>{item.points} pt por integrante</small>
            <div className="actions" style={{gap:'8px'}}>
              <button className="primary" disabled={challengeBusy} onClick={()=>reviewSpecial(item.group_id,true)}><Check size={17}/>Aprobar</button>
              <button className="secondary" disabled={challengeBusy} onClick={()=>reviewSpecial(item.group_id,false)}>Rechazar</button>
            </div>
          </article>)}
          {!adminSpecialReviews.length&&<article className="card" style={{padding:'17px'}}>No hay retos esperando validación.</article>}
        </div>
      </section>
    </>:page==='points'&&mode==='admin'?<>
      <section className="card" style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>ADMINISTRAR PUNTOS</p>
        <h2 style={{marginBottom:'4px'}}>Actualiza la clasificación</h2>
        <p style={{color:'var(--muted)',marginBottom:0}}>Usa cantidades positivas para sumar y negativas para restar.</p>
      </section>
      <form className="card" onSubmit={adjustPoints} style={{padding:'16px',marginTop:'14px'}}>
        <label>Brinkker<select value={pointsForm.user_id} onChange={e=>setPointsForm({...pointsForm,user_id:e.target.value})}><option value="">Selecciona un Brinkker</option>{brinkkers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}</select></label>
        <label>Puntos<input type="number" step="1" value={pointsForm.amount} onChange={e=>setPointsForm({...pointsForm,amount:e.target.value})}/></label>
        <label>Motivo<input value={pointsForm.reason} onChange={e=>setPointsForm({...pointsForm,reason:e.target.value})} placeholder="Reto completado, penalización…"/></label>
        <button className="primary wide" disabled={pointsBusy}><Star size={18}/>{pointsBusy?'Guardando…':'Registrar puntos'}</button>
        {pointsMessage&&<p className="msg">{pointsMessage}</p>}
      </form>
    </>:page==='brinkkers'?<>
      <section className="card" style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{mode==='admin'?'GESTIÓN DE LA AVENTURA':'COMPAÑEROS DE VIAJE'}</p>
        <h2 style={{marginBottom:'5px'}}>{brinkkers.length} {brinkkers.length===1?'Brinkker':'Brinkkers'}</h2>
      </section>
      <section style={{display:'grid',gap:'8px',marginTop:'12px'}}>
        {brinkkersLoading&&<article className="card" style={{padding:'15px'}}>Cargando Brinkkers…</article>}
        {brinkkersError&&<article className="card" style={{padding:'15px',color:'#a13f3f'}}>{brinkkersError}</article>}
        {!brinkkersLoading&&!brinkkersError&&brinkkers.map(q=>
          <article className="card" key={q.user_id} style={{padding:'17px',display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'17px',background:q.profile_color||'#e7eee9',display:'grid',placeItems:'center',fontSize:'1.7rem'}}>{q.avatar_emoji||'🧭'}</div>
            <div style={{flex:1}}><strong>{q.nickname}</strong><small style={{display:'block',color:'var(--muted)'}}>{q.member_role==='owner'?'Creador · Admin':'Brinkker'}</small></div>
          </article>
        )}
      </section>
    </>:page==='auction'&&mode==='admin'?<>
      <section className="card" style={{
        padding:'15px',
        border:'1px solid rgba(23,63,53,.09)',
        boxShadow:'none'
      }}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>
          🔨 SUBASTA EN DIRECTO
        </p>
        <h2 style={{marginBottom:'4px'}}>Que empiece la guerra 😈</h2>
        <p style={{color:'var(--muted)',marginBottom:0,fontSize:'.84rem'}}>
          Los lotes salen uno a uno. Cada puja es pública y el saldo de cada Brinkker es privado.
        </p>
      </section>

      {!auction&&<button className="primary wide"
        style={{marginTop:'12px'}}
        onClick={createAuction}
        disabled={auctionBusy}>
        <Gavel size={18}/>Crear subasta
      </button>}

      {auction&&auction.status==='draft'&&<>
        <section className="card" style={{padding:'14px',marginTop:'12px'}}>
          <p className="eyebrow" style={{marginBottom:'5px',fontSize:'.67rem',letterSpacing:'.08em'}}>
            PREPARAR LOTES
          </p>

          <label>Objeto
            <select value={newLot.advantage_id}
              onChange={e=>setNewLot({...newLot,advantage_id:e.target.value})}>
              {auctionCatalog.map(a=>
                <option key={a.advantage_id} value={a.advantage_id}>
                  {a.emoji} {a.name}
                </option>
              )}
            </select>
          </label>

          <label>Puja inicial
            <input type="number" min="0" step="5"
              value={newLot.minimum_bid}
              onChange={e=>setNewLot({...newLot,minimum_bid:e.target.value})}/>
          </label>

          <div className="actions" style={{gap:'8px'}}>
            <button className="primary"
              onClick={()=>addAuctionLot(false)}
              disabled={auctionBusy}>
              <Plus size={17}/>Añadir
            </button>

            <button className="secondary"
              onClick={()=>addAuctionLot(true)}
              disabled={auctionBusy}>
              <Dices size={17}/>Aleatorio
            </button>
          </div>
        </section>

        <section style={{display:'grid',gap:'7px',marginTop:'10px'}}>
          {auctionLots.map(lot=>
            <article className="card" key={lot.lot_id} style={{
              padding:'11px 12px',
              display:'grid',
              gridTemplateColumns:'34px minmax(0,1fr) auto',
              gap:'9px',alignItems:'center',
              border:'1px solid rgba(23,63,53,.08)',
              boxShadow:'none'
            }}>
              <span style={{
                width:'34px',height:'34px',borderRadius:'11px',
                background:'#eef3ef',display:'grid',
                placeItems:'center',fontSize:'1.1rem'
              }}>{lot.emoji}</span>

              <div style={{minWidth:0}}>
                <strong style={{
                  display:'block',fontSize:'.86rem',
                  overflow:'hidden',textOverflow:'ellipsis',
                  whiteSpace:'nowrap'
                }}>
                  {lot.lot_order}. {lot.advantage_name}
                </strong>
                <small style={{color:'var(--muted)'}}>
                  Empieza en {lot.minimum_bid} 🪙
                </small>
              </div>

              <button className="secondary"
                disabled={auctionBusy}
                onClick={()=>removeAuctionLot(lot.lot_id)}
                style={{padding:'7px'}}>
                <Trash2 size={14}/>
              </button>
            </article>
          )}

          {!auctionLots.length&&<article className="card" style={{padding:'12px'}}>
            Añade al menos un objeto.
          </article>}
        </section>

        <button className="primary wide"
          style={{marginTop:'11px'}}
          onClick={openAuction}
          disabled={auctionBusy||!auctionLots.length}>
          <Play size={17}/>🔥 Empezar subasta en directo
        </button>
      </>}

      {auction&&auction.status==='open'&&(()=>{
        const lot=activeAuctionLot();
        const seconds=auctionSecondsLeft(lot);

        return <>
          {lot&&<section className="card" style={{
            padding:'15px',
            marginTop:'12px',
            border:'1px solid rgba(214,166,62,.38)'
          }}>
            <div style={{
              display:'flex',justifyContent:'space-between',
              gap:'10px',alignItems:'center'
            }}>
              <small style={{fontWeight:'900',color:'var(--muted)'}}>
                LOTE {lot.lot_order} DE {auction.total_lots}
              </small>
              <strong style={{
                color:seconds<=10?'#a34b25':'inherit'
              }}>⏱ {seconds}s</strong>
            </div>

            <div style={{textAlign:'center',padding:'13px 0 6px'}}>
              <div style={{fontSize:'2rem'}}>{lot.emoji}</div>
              <h2 style={{margin:'4px 0'}}>
                {lot.advantage_name}
              </h2>
              <strong style={{fontSize:'1.7rem'}}>
                {Number(lot.current_bid||0)} 🪙
              </strong>
              <small style={{
                display:'block',color:'var(--muted)',
                marginTop:'3px'
              }}>
                {lot.current_bidder_nickname
                  ?`Lidera ${lot.current_bidder_nickname}`
                  :'Esperando la primera puja…'}
              </small>
            </div>

            <button className="secondary wide"
              onClick={forceFinishLiveLot}
              disabled={auctionBusy}
              style={{marginTop:'8px'}}>
              <LockKeyhole size={16}/>Cerrar este lote ahora
            </button>
          </section>}

          <section style={{display:'grid',gap:'6px',marginTop:'10px'}}>
            {auctionLots.map(lot=>
              <div key={lot.lot_id} style={{
                padding:'9px 11px',borderRadius:'12px',
                border:'1px solid rgba(23,63,53,.07)',
                display:'grid',
                gridTemplateColumns:'26px minmax(0,1fr) auto',
                gap:'8px',alignItems:'center',
                background:lot.live_status==='live'?'#fff8e7':'#fffdf7'
              }}>
                <span>{lot.emoji}</span>
                <span style={{fontSize:'.8rem',fontWeight:'850'}}>
                  {lot.advantage_name}
                </span>
                <small style={{fontWeight:'900',color:'var(--muted)'}}>
                  {lot.live_status==='live'?'🔥 EN JUEGO':
                   lot.live_status==='won'?`🏆 ${lot.winner_nickname}`:
                   lot.live_status==='unsold'?'Sin pujas':
                   'Pendiente'}
                </small>
              </div>
            )}
          </section>
        </>;
      })()}

      {auction&&auction.status==='closed'&&<>
        <section className="card" style={{padding:'14px',marginTop:'12px'}}>
          <strong>🏁 Subasta terminada</strong>
          <small style={{display:'block',color:'var(--muted)',marginTop:'3px'}}>
            Todos los lotes han terminado.
          </small>
        </section>

        <button className="primary wide"
          style={{marginTop:'10px'}}
          onClick={createAuction}
          disabled={auctionBusy}>
          <Gavel size={17}/>Nueva subasta
        </button>
      </>}

      <form className="card" onSubmit={grantAuctionCoins}
        style={{padding:'14px',marginTop:'14px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>
          🪙 RECOMPENSAS
        </p>
        <strong style={{display:'block',marginBottom:'5px'}}>
          Dar monedas extra
        </strong>
        <small style={{
          display:'block',color:'var(--muted)',
          marginBottom:'9px'
        }}>
          Todos empiezan con 100 🪙. El Admin puede dar premios, pero no ve los saldos privados.
        </small>

        <label>Brinkker
          <select value={auctionWalletForm.user_id}
            onChange={e=>setAuctionWalletForm({...auctionWalletForm,user_id:e.target.value})}>
            <option value="">Selecciona un Brinkker</option>
            {brinkkers.map(q=>
              <option key={q.user_id} value={q.user_id}>
                {q.nickname}
              </option>
            )}
          </select>
        </label>

        <div className="cols">
          <label>Monedas
            <input type="number" min="1" step="5"
              value={auctionWalletForm.amount}
              onChange={e=>setAuctionWalletForm({...auctionWalletForm,amount:e.target.value})}/>
          </label>

          <label>Motivo
            <input value={auctionWalletForm.reason}
              onChange={e=>setAuctionWalletForm({...auctionWalletForm,reason:e.target.value})}
              placeholder="Sobre, prueba…"/>
          </label>
        </div>

        <button className="secondary wide" disabled={auctionBusy}>
          <Gift size={16}/>Entregar monedas
        </button>
      </form>

      {auctionMessage&&<p className="msg" style={{marginTop:'9px'}}>
        {auctionMessage}
      </p>}
    </>:page==='adminAdvantages'&&mode==='admin'?<>
      <section className="card" style={{
        padding:'15px',
        border:'1px solid rgba(23,63,53,.09)',
        boxShadow:'none'
      }}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>OBJETOS</p>
        <h2 style={{marginBottom:'4px'}}>Gestiona los objetos</h2>
        <p style={{color:'var(--muted)',marginBottom:0,fontSize:'.84rem'}}>
          Asigna objetos oficiales o crea objetos personalizados para este Brinkkando.
        </p>
      </section>

      <section className="card" style={{padding:'17px',marginTop:'14px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>ASIGNAR OBJETO</p>
        <form onSubmit={assignAdvantageToUser}>
          <label>Objeto
            <select value={assignAdvantage.advantage_id}
              onChange={e=>setAssignAdvantage({...assignAdvantage,advantage_id:e.target.value})}>
              <option value="">Selecciona un objeto</option>
              {advantageCatalog.map(item=><option key={item.advantage_id} value={item.advantage_id}>
                {item.emoji} {item.name}
              </option>)}
            </select>
          </label>
          <label>Brinkker
            <select value={assignAdvantage.user_id}
              onChange={e=>setAssignAdvantage({...assignAdvantage,user_id:e.target.value})}>
              <option value="">Selecciona un Brinkker</option>
              {brinkkers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}
            </select>
          </label>
          <button className="primary wide" disabled={advantageBusy}>
            <Gift size={18}/>{advantageBusy?'Asignando…':'Asignar objeto'}
          </button>
        </form>
      </section>

      <section style={{marginTop:'20px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>SOLICITUDES DE USO</p>
        <div style={{display:'grid',gap:'9px'}}>
          {advantageRequests.map(request=><article className="card" key={request.request_id}
            style={{padding:'17px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'1.7rem'}}>{request.emoji}</span>
              <div style={{flex:1}}>
                <strong>{request.nickname} quiere usar {request.advantage_name}</strong>
                <small style={{display:'block',color:'var(--muted)'}}>{request.description}</small>
              </div>
            </div>
            <div className="actions" style={{marginTop:'12px'}}>
              <button className="primary" disabled={advantageBusy}
                onClick={()=>reviewAdvantageRequest(request.request_id,true)}>
                <ShieldCheck size={17}/>Confirmar uso
              </button>
              <button className="secondary" disabled={advantageBusy}
                onClick={()=>reviewAdvantageRequest(request.request_id,false)}>
                Rechazar
              </button>
            </div>
          </article>)}
          {!advantageRequests.length&&<article className="card" style={{padding:'16px'}}>
            No hay solicitudes pendientes.
          </article>}
        </div>
      </section>

      <section style={{marginTop:'20px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>INVENTARIO ACTUAL</p>
        <div style={{display:'grid',gap:'9px'}}>
          {advantageAssignments.map(item=><article className="card" key={item.assignment_id}
            style={{padding:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'1.7rem'}}>{item.emoji}</span>
            <div style={{flex:1}}>
              <strong>{item.advantage_name}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>
                {item.nickname} · {item.assignment_status==='available'?'Disponible':'Uso solicitado'}
              </small>
            </div>
            <button className="secondary" disabled={advantageBusy}
              onClick={()=>removeAdvantageAssignment(item.assignment_id)}>
              <Archive size={17}/>Quitar
            </button>
          </article>)}
          {!advantageAssignments.length&&<article className="card" style={{padding:'16px'}}>
            Todavía no hay objetos asignados.
          </article>}
        </div>
      </section>

      <form className="card" onSubmit={createAdvantage} style={{padding:'17px',marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>OBJETO PERSONALIZADO</p>
        <h2 style={{marginBottom:'14px'}}>Crea una ventaja nueva</h2>
        <div className="cols">
          <label>Nombre
            <input value={newAdvantage.name}
              onChange={e=>setNewAdvantage({...newAdvantage,name:e.target.value})}
              placeholder="El salvoconducto"/>
          </label>
          <label>Emoji
            <input maxLength="4" value={newAdvantage.emoji}
              onChange={e=>setNewAdvantage({...newAdvantage,emoji:e.target.value})}/>
          </label>
        </div>
        <label>Descripción
          <textarea rows="3" value={newAdvantage.description}
            onChange={e=>setNewAdvantage({...newAdvantage,description:e.target.value})}
            placeholder="Explica qué permite hacer y cómo se usa."/>
        </label>
        <button className="primary wide" disabled={advantageBusy}>
          <Plus size={18}/>Crear objeto
        </button>
        {advantageMessage&&<p className="msg">{advantageMessage}</p>}
      </form>

      <section style={{marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>CATÁLOGO DE OBJETOS</p>
        <div style={{display:'grid',gap:'9px'}}>
          {advantageCatalog.map(item=><article className="card" key={item.advantage_id}
            style={{padding:'16px',display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'1.7rem'}}>{item.emoji}</span>
            <div style={{flex:1}}>
              <strong>{item.name}</strong>
              <small style={{display:'block',color:'var(--muted)'}}>{item.description}</small>
            </div>
            {item.is_standard
              ?<small style={{fontWeight:'900'}}>Oficial</small>
              :<div style={{display:'flex',gap:'6px',flexShrink:0}}>
                <button className="secondary" disabled={advantageBusy}
                  onClick={()=>startEditAdvantage(item)}><Pencil size={15}/></button>
                <button className="secondary" disabled={advantageBusy}
                  onClick={()=>deleteCustomAdvantage(item.advantage_id)}><Trash2 size={15}/></button>
              </div>}
          </article>)}
        </div>

        {editingAdvantage&&<form className="card" onSubmit={saveCustomAdvantage}
          style={{padding:'15px',marginTop:'12px'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>EDITAR OBJETO PERSONALIZADO</p>
          <div className="cols">
            <label>Nombre<input value={editAdvantageForm.name}
              onChange={e=>setEditAdvantageForm({...editAdvantageForm,name:e.target.value})}/></label>
            <label>Emoji<input maxLength="4" value={editAdvantageForm.emoji}
              onChange={e=>setEditAdvantageForm({...editAdvantageForm,emoji:e.target.value})}/></label>
          </div>
          <label>Descripción<textarea rows="3" value={editAdvantageForm.description}
            onChange={e=>setEditAdvantageForm({...editAdvantageForm,description:e.target.value})}/></label>
          <div className="actions" style={{gap:'8px'}}>
            <button className="primary" disabled={advantageBusy}><Save size={16}/>Guardar</button>
            <button type="button" className="secondary" onClick={()=>setEditingAdvantage(null)}>Cancelar</button>
          </div>
        </form>}
      </section>
    </>:page==='settings'&&mode==='admin'?<>
      <form className="card" onSubmit={saveAdminSettings} style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>AJUSTES BÁSICOS</p>
        <h2 style={{marginBottom:'14px'}}>Configura el Brinkkando</h2>

        <div className="cols">
          <label>Nombre
            <input required value={settingsForm.name}
              onChange={e=>setSettingsForm({...settingsForm,name:e.target.value})}/>
          </label>
          <label>Emoji
            <input required maxLength="4" value={settingsForm.emoji}
              onChange={e=>setSettingsForm({...settingsForm,emoji:e.target.value})}/>
          </label>
        </div>

        <div className="cols">
          <label>Empieza
            <input required type="date" value={settingsForm.start_date}
              onChange={e=>setSettingsForm({...settingsForm,start_date:e.target.value})}/>
          </label>
          <label>Termina
            <input required type="date" value={settingsForm.end_date}
              onChange={e=>setSettingsForm({...settingsForm,end_date:e.target.value})}/>
          </label>
        </div>

        <label>Descripción
          <textarea rows="3" value={settingsForm.description}
            onChange={e=>setSettingsForm({...settingsForm,description:e.target.value})}/>
        </label>

        <label style={{display:'flex',alignItems:'center',gap:'10px',fontWeight:'850'}}>
          <input type="checkbox" checked={settingsForm.join_enabled}
            onChange={e=>setSettingsForm({...settingsForm,join_enabled:e.target.checked})}
            style={{width:'20px',height:'20px'}}/>
          {settingsForm.join_enabled?'🔓 Permitir nuevos Brinkkers':'🔒 Incorporaciones cerradas'}
        </label>

        <button className="primary wide" disabled={settingsBusy}>
          <Save size={17}/>{settingsBusy?'Guardando…':'Guardar ajustes'}
        </button>
      </form>

      <section className="card" style={{padding:'16px',marginTop:'14px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>CÓDIGO DEL BRINKKANDO</p>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <strong style={{fontSize:'1.04rem',letterSpacing:'.14em',flex:1}}>{g.invite_code}</strong>
          <button className="secondary" onClick={copyCode}><Copy size={16}/>{copied?'Copiado':'Copiar'}</button>
        </div>
      </section>

      <section style={{marginTop:'22px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>MANTENIMIENTO</p>
        <div style={{display:'grid',gap:'9px'}}>
          <button className="card" disabled={settingsBusy}
            onClick={()=>runAdminAction('clear_pending_challenges')}
            style={{padding:'16px',border:'1px solid rgba(23,63,53,.09)',color:'inherit',textAlign:'left'}}>
            <strong>🧹 Borrar sobres pendientes</strong>
            <small style={{display:'block',color:'var(--muted)'}}>Elimina misiones aún no completadas ni aprobadas.</small>
          </button>

          <button className="card" disabled={settingsBusy}
            onClick={()=>runAdminAction('clear_objects')}
            style={{padding:'16px',border:'1px solid rgba(23,63,53,.09)',color:'inherit',textAlign:'left'}}>
            <strong>🎒 Vaciar inventarios</strong>
            <small style={{display:'block',color:'var(--muted)'}}>Retira todos los objetos disponibles y solicitados.</small>
          </button>

          <button className="card" disabled={settingsBusy}
            onClick={()=>runAdminAction('force_close_auction')}
            style={{padding:'16px',border:'1px solid rgba(23,63,53,.09)',color:'inherit',textAlign:'left'}}>
            <strong>🔨 Cerrar subasta bloqueada</strong>
            <small style={{display:'block',color:'var(--muted)'}}>Cierra la subasta activa sin adjudicar los lotes pendientes.</small>
          </button>
        </div>
      </section>

      <section className="card" style={{padding:'16px',marginTop:'22px',border:'1px solid #d7a1a1'}}>
        <p className="eyebrow" style={{color:'#a13f3f',fontSize:'.67rem',letterSpacing:'.08em'}}>ZONA PELIGROSA</p>
        <p style={{color:'var(--muted)'}}>Estas acciones son irreversibles. Escribe la palabra solicitada antes de ejecutarlas.</p>

        <label>Confirmación
          <input value={dangerConfirm} onChange={e=>setDangerConfirm(e.target.value)}
            placeholder="Escribe REINICIAR o PUNTOS"/>
        </label>

        <div style={{display:'grid',gap:'9px'}}>
          <button type="button" disabled={settingsBusy}
            onClick={()=>runAdminAction('reset_points','PUNTOS')}
            style={{border:0,borderRadius:'13px',padding:'13px',fontWeight:'900',background:'#f1dfdf',color:'#8d3030'}}>
            Reiniciar todos los puntos
          </button>

          <button type="button" disabled={settingsBusy}
            onClick={()=>runAdminAction('reset_game','REINICIAR')}
            style={{border:0,borderRadius:'13px',padding:'13px',fontWeight:'900',background:'#a13f3f',color:'white'}}>
            Reiniciar completamente el Brinkkando
          </button>
        </div>
      </section>

      <section className="card" style={{padding:'16px',marginTop:'14px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>ELIMINAR BRINKKANDO</p>
        <p style={{color:'var(--muted)',marginBottom:0}}>
          La eliminación definitiva sigue disponible desde el menú ⋮ de el Brinkkando en «Mis Brinkkandos», donde exige escribir su nombre exacto.
        </p>
      </section>

      {settingsMessage&&<p className="msg">{settingsMessage}</p>}
    </>:page==='stages'?<>
      {mode==='admin'&&<form className="card" onSubmit={saveStage} style={{padding:'15px',border:'1px solid rgba(23,63,53,.09)',boxShadow:'none'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{editingStageId?'EDITAR JORNADA':'NUEVA JORNADA'}</p>
        <h2 style={{marginBottom:'14px'}}>Plan del Brinkkando</h2>

        <label>Fecha
          <input type="date" value={stageForm.stage_date}
            onChange={e=>setStageForm({...stageForm,stage_date:e.target.value})}/>
        </label>

        <label style={{display:'flex',alignItems:'center',gap:'10px',fontWeight:'850'}}>
          <input type="checkbox" checked={stageForm.same_place}
            onChange={e=>setStageForm({...stageForm,same_place:e.target.checked})}
            style={{width:'20px',height:'20px'}}/>
          🏡 Día en el mismo lugar
        </label>

        <label>{stageForm.same_place?'Lugar':'Origen'}
          <input value={stageForm.origin}
            onChange={e=>setStageForm({...stageForm,origin:e.target.value})}
            placeholder="Santiago de Compostela"/>
        </label>

        {!stageForm.same_place&&<>
          <label>Destino
            <input value={stageForm.destination}
              onChange={e=>setStageForm({...stageForm,destination:e.target.value})}
              placeholder="Pontevedra"/>
          </label>

          <label>Medio de transporte
            <select value={stageForm.transport_mode}
              onChange={e=>setStageForm({...stageForm,transport_mode:e.target.value})}>
              {Object.entries(transportLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <div className="cols">
            <label>Distancia (km)
              <input type="number" min="0" step="0.1" value={stageForm.distance_km}
                onChange={e=>setStageForm({...stageForm,distance_km:e.target.value})}/>
            </label>
            <label>Desnivel (m)
              <input type="number" min="0" step="1" value={stageForm.elevation_m}
                onChange={e=>setStageForm({...stageForm,elevation_m:e.target.value})}/>
            </label>
          </div>

          <label>Duración estimada
            <input value={stageForm.duration_text}
              onChange={e=>setStageForm({...stageForm,duration_text:e.target.value})}
              placeholder="3 h 30 min"/>
          </label>

          <label>Enlace de la ruta
            <input type="url" value={stageForm.route_url}
              onChange={e=>setStageForm({...stageForm,route_url:e.target.value})}
              placeholder="Maps, Komoot, Wikiloc, billete…"/>
          </label>
        </>}

        <p className="eyebrow" style={{marginTop:'20px',fontSize:'.67rem',letterSpacing:'.08em'}}>PLAN DEL DÍA</p>
        <label>¿Qué hacemos hoy?
          <textarea rows="5" value={stageForm.day_description}
            onChange={e=>setStageForm({...stageForm,day_description:e.target.value})}
            placeholder="Visitas, comida, playa, festival, horarios, cosas a tener en cuenta…"/>
        </label>

        <p className="eyebrow" style={{marginTop:'20px',fontSize:'.67rem',letterSpacing:'.08em'}}>ALOJAMIENTO</p>
        <label style={{display:'flex',alignItems:'center',gap:'10px',fontWeight:'850'}}>
          <input type="checkbox" checked={stageForm.same_accommodation}
            onChange={e=>setStageForm({...stageForm,same_accommodation:e.target.checked})}
            style={{width:'20px',height:'20px'}}/>
          🏨 Mismo alojamiento que la noche anterior
        </label>

        {!stageForm.same_accommodation&&<>
          <label>Nombre del alojamiento
            <input value={stageForm.accommodation_name}
              onChange={e=>setStageForm({...stageForm,accommodation_name:e.target.value})}
              placeholder="Hotel, albergue, apartamento…"/>
          </label>

          <label>Reservado por
            <select value={stageForm.booked_by_user_id}
              onChange={e=>setStageForm({...stageForm,booked_by_user_id:e.target.value})}>
              <option value="">Sin asignar</option>
              {brinkkers.map(q=><option key={q.user_id} value={q.user_id}>{q.nickname}</option>)}
            </select>
          </label>

          <label>Enlace de la reserva
            <input type="url" value={stageForm.booking_url}
              onChange={e=>setStageForm({...stageForm,booking_url:e.target.value})}
              placeholder="Booking, Airbnb, web del alojamiento…"/>
          </label>
        </>}

        <label>Precio del alojamiento
          <div style={{position:'relative'}}>
            <input type="number" min="0" step="0.01" value={stageForm.accommodation_price}
              onChange={e=>setStageForm({...stageForm,accommodation_price:e.target.value})}
              placeholder="0.00"
              style={{paddingRight:'42px'}}/>
            <span style={{position:'absolute',right:'15px',top:'50%',transform:'translateY(-50%)',fontWeight:'900'}}>€</span>
          </div>
        </label>

        <div className="actions" style={{gap:'8px'}}>
          <button className="primary" disabled={stageBusy}>
            <Save size={17}/>{editingStageId?'Guardar cambios':'Crear jornada'}
          </button>
          {editingStageId&&<button type="button" className="secondary" onClick={()=>{
            setEditingStageId(null);setStageForm(blankStageForm());
          }}>Cancelar</button>}
        </div>

        {stageMessage&&<p className="msg">{stageMessage}</p>}
      </form>}
      <section style={{marginTop:mode==='admin'?'22px':0}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{mode==='admin'?'JORNADAS CREADAS':'PLAN DEL VIAJE'}</p>
        <div style={{display:'grid',gap:'11px'}}>
          {stagesLoading&&<article className="card" style={{padding:'17px'}}>Cargando Plan…</article>}
          {!stagesLoading&&stages.map(stage=>{
            const isExpanded=expandedStageId===stage.stage_id;
            const today=new Date().toISOString().slice(0,10);
            const state=stage.stage_date===today?'today':stage.stage_date&&stage.stage_date<today?'past':'future';
            return <article className="card" key={stage.stage_id} style={{
              padding:'17px',
              border:state==='today'?'2px solid #2f7563':'1px solid rgba(23,63,53,.11)',
              opacity:state==='past'?.72:1
            }}>
              <button type="button" onClick={()=>setExpandedStageId(isExpanded?null:stage.stage_id)}
                style={{width:'100%',border:0,background:'transparent',padding:0,color:'inherit',textAlign:'left'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'11px'}}>
                  <span style={{fontSize:'1.5rem'}}>{stage.same_place?'🏡':transportLabels[stage.transport_mode]?.split(' ')[0]||'🧭'}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <small style={{display:'block',fontWeight:'900',color:'var(--muted)'}}>
                      {stage.stage_date?new Date(`${stage.stage_date}T12:00:00`).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'}):`Jornada ${stage.stage_position}`}
                      {state==='today'?' · HOY':''}
                    </small>
                    <strong style={{display:'block',fontSize:'1.01rem',marginTop:'3px'}}>
                      {stage.same_place?'Día en el mismo lugar':`${stage.origin} → ${stage.destination}`}
                    </strong>
                    {stage.same_place&&<small style={{display:'block',color:'var(--muted)'}}>{stage.origin}</small>}
                    {!stage.same_place&&<small style={{display:'block',color:'var(--muted)'}}>
                      {transportLabels[stage.transport_mode]}
                      {stage.distance_km!=null?` · ${stage.distance_km} km`:''}
                      {stage.elevation_m!=null?` · +${stage.elevation_m} m`:''}
                      {stage.duration_text?` · ${stage.duration_text}`:''}
                    </small>}
                  </div>
                  {isExpanded?<ChevronUp size={19}/>:<ChevronDown size={19}/>}
                </div>
              </button>

              {isExpanded&&<div style={{marginTop:'14px',paddingTop:'13px',borderTop:'1px solid #e3ded2'}}>
                {stage.day_description&&<p style={{marginTop:0}}>{stage.day_description}</p>}

                {!stage.same_place&&stage.route_url&&<a className="primary wide" href={stage.route_url} target="_blank" rel="noreferrer"
                  style={{textDecoration:'none',marginTop:'10px'}}>
                  <Navigation size={17}/>Abrir ruta<ExternalLink size={15}/>
                </a>}

                {(stage.resolved_accommodation_name||stage.same_accommodation)&&<div style={{
                  marginTop:'14px',padding:'13px',borderRadius:'13px',background:'#f3f0e8'
                }}>
                  <strong>🏨 Noche</strong>
                  <p style={{margin:'6px 0 0'}}>
                    {stage.resolved_accommodation_name||'Mismo alojamiento que la noche anterior'}
                  </p>
                  {stage.booked_by_nickname&&<small style={{display:'block',marginTop:'5px'}}>👤 Reservado por {stage.booked_by_nickname}</small>}
                  {stage.accommodation_price!=null&&<small style={{display:'block',marginTop:'4px',fontWeight:'900'}}>
                    💶 {Number(stage.accommodation_price).toFixed(2)} €
                  </small>}
                  {stage.resolved_booking_url&&<a className="secondary wide" href={stage.resolved_booking_url} target="_blank" rel="noreferrer"
                    style={{textDecoration:'none',marginTop:'9px'}}>
                    <Hotel size={17}/>Ver reserva<ExternalLink size={15}/>
                  </a>}
                </div>}

                {mode==='admin'&&<div className="actions" style={{marginTop:'13px'}}>
                  <button className="secondary" onClick={()=>editStage(stage)}><Pencil size={16}/>Editar</button>
                  <button className="secondary" disabled={stageBusy} onClick={()=>moveStage(stage.stage_id,'up')}>↑ Subir</button>
                  <button className="secondary" disabled={stageBusy} onClick={()=>moveStage(stage.stage_id,'down')}>↓ Bajar</button>
                  <button className="secondary" disabled={stageBusy} onClick={()=>deleteStage(stage.stage_id)}><Trash2 size={16}/>Borrar</button>
                </div>}
              </div>}
            </article>
          })}
          {!stagesLoading&&!stages.length&&<article className="card" style={{padding:'15px'}}>
            {mode==='admin'?'Todavía no has creado ninguna jornada.':'El Admin todavía no ha preparado el Plan.'}
          </article>}
        </div>
      </section>
    </>:page==='advantages'?<>
      <section className="card" style={{
        padding:'15px',
        border:'1px solid rgba(23,63,53,.09)',
        boxShadow:'none'
      }}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>TU INVENTARIO</p>
        <h2 style={{marginBottom:'4px'}}>Tus objetos</h2>
        <p style={{color:'var(--muted)',marginBottom:0,fontSize:'.84rem'}}>
          Solicita usar un objeto y el Admin confirmará cuándo se consume.
        </p>
      </section>

      <section style={{display:'grid',gap:'8px',marginTop:'12px'}}>
        {myAdvantages.map(item=><article className="card" key={item.assignment_id}
          style={{
            padding:'14px',
            border:'1px solid rgba(23,63,53,.09)',
            boxShadow:'none'
          }}>
          <div style={{display:'grid',gridTemplateColumns:'44px minmax(0,1fr) auto',alignItems:'start',gap:'11px'}}>
            <div style={{
              width:'44px',height:'44px',borderRadius:'14px',
              background:'#eef3ef',display:'grid',placeItems:'center',
              fontSize:'1.45rem'
            }}>{item.emoji}</div>
            <div style={{minWidth:0}}>
              <strong style={{fontSize:'.98rem',display:'block'}}>{item.advantage_name}</strong>
              <small style={{
                display:'block',color:'var(--muted)',
                marginTop:'3px',lineHeight:1.35
              }}>{item.description}</small>
            </div>
            <span style={{
              fontSize:'.72rem',fontWeight:'900',
              padding:'6px 8px',borderRadius:'999px',
              background:item.assignment_status==='available'?'#eef6f2':'#f3f0e8',
              color:item.assignment_status==='available'?'#24715a':'var(--muted)',
              whiteSpace:'nowrap'
            }}>
              {item.assignment_status==='available'
                ?'Disponible'
                :item.assignment_status==='requested'
                  ?'Solicitada'
                  :'Usada'}
            </span>
          </div>
          {item.assignment_status==='available'&&
            <button className="primary" style={{marginTop:'11px',width:'100%',padding:'9px 12px'}}
              disabled={advantageBusy}
              onClick={()=>requestAdvantageUse(item.assignment_id)}>
              <Play size={16}/>Solicitar uso
            </button>}
        </article>)}
        {!myAdvantages.length&&<article className="card" style={{padding:'15px'}}>
          Aún no tienes ningún objeto.
        </article>}
      </section>

      {advantageMessage&&<p className="msg">{advantageMessage}</p>}
    </>:<>
      <section className="card" style={{padding:'24px'}}>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>PRÓXIMO SPRINT</p>
        <h2>Sección</h2>
        <p style={{color:'var(--muted)'}}>Esta sección se incorporará en los siguientes sprints.</p>
      </section>
    </>}

    {mode==='player'&&<nav style={{
      position:'fixed',left:'50%',transform:'translateX(-50%)',
      bottom:'max(10px, env(safe-area-inset-bottom))',
      width:'calc(100vw - 16px)',
      maxWidth:'620px',
      boxSizing:'border-box',
      padding:'6px',
      borderRadius:'20px',background:'rgba(255,253,247,.96)',
      border:'1px solid rgba(23,63,53,.13)',
      boxShadow:'0 16px 38px rgba(23,63,53,.2)',
      display:'grid',
      gridTemplateColumns:'repeat(5,minmax(0,1fr))',
      gap:'5px',zIndex:10,backdropFilter:'blur(12px)'
    }}>
      {playerNav.map(item=>{
        const count=item.id==='ranking'?notificationCounts.ranking:item.id==='challenges'?notificationCounts.challenges:item.id==='advantages'?notificationCounts.advantages:0;
        return <button key={item.id} onClick={()=>openPage(item.id)} style={{
          border:0,
          borderRadius:'14px',
          padding:'8px 1px',
          minWidth:0,
          overflow:'hidden',
          display:'grid',justifyItems:'center',gap:'3px',
          background:page===item.id?'#173f35':'transparent',
          color:page===item.id?'white':'#62736d',
          fontWeight:'850',fontSize:'.66rem',position:'relative'
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
          <span style={{
            display:'block',
            width:'100%',
            overflow:'hidden',
            textOverflow:'ellipsis',
            whiteSpace:'nowrap',
            textAlign:'center'
          }}>{item.label}</span>
        </button>
      })}
    </nav>}
  </main>
}
function Dashboard({session}){
  const[legalOpen,setLegalOpen]=useState(null);
  const[memberships,setMemberships]=useState([]);
  const[loading,setLoading]=useState(true);
  const[modal,setModal]=useState(null);
  const[selected,setSelected]=useState(null);
  const[profileOpen,setProfileOpen]=useState(false);
  const[profile,setProfile]=useState({nickname:'',avatar_emoji:'🧭',profile_color:'#dfeee7',bizum_phone:''});
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
      .select('nickname,avatar_emoji,profile_color,bizum_phone')
      .eq('id',session.user.id)
      .single();
    if(!error&&data)setProfile({
      nickname:data.nickname||'',
      avatar_emoji:data.avatar_emoji||'🧭',
      profile_color:data.profile_color||'#dfeee7',
      bizum_phone:data.bizum_phone||''
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
      profile_color:profile.profile_color||'#dfeee7',
      bizum_phone:profile.bizum_phone.trim()||null
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
      setDeleteMessage('Escribe exactamente el nombre de el Brinkkando.');
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

  if(selected)return <Game membership={selected} session={session} onBack={()=>setSelected(null)}/>;

  const nick=profile.nickname||session.user.user_metadata?.nickname||session.user.email?.split('@')[0];

  return <main className="shell">
    <header className="top">
      <div>
        <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>BIENVENIDO, QUESTER</p>
        <h1>Hola, {nick}</h1>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button className="secondary" style={{padding:'11px 13px'}} onClick={()=>setProfileOpen(true)}>
          <span style={{fontSize:'1.04rem'}}>{profile.avatar_emoji||'🧭'}</span>
          <span>Mi perfil</span>
        </button>
        <button className="icon" onClick={()=>supabase.auth.signOut()}><LogOut/></button>
      </div>
    </header>

    <section className="heading">
      <div><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>MIS BRINKKANDOS</p><h2>Mis Brinkkandos</h2></div>
      <div className="actions" style={{gap:'8px'}}>
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
          {m.role==='owner'&&<button className="secondary wide" style={{justifyContent:'flex-start',marginBottom:'4px'}} onClick={()=>openEdit(m)}>
            <Pencil size={17}/>Editar Brinkkando
          </button>}
          <button className="secondary wide" style={{justifyContent:'flex-start',color:m.role==='owner'?'#a13f3f':'inherit'}} onClick={()=>openDelete(m)}>
            {m.role==='owner'?<Trash2 size={17}/>:<DoorOpen size={17}/>}
            {m.role==='owner'?'Eliminar Brinkkando':'Salir de el Brinkkando'}
          </button>
        </div>}
      </article>)}
    </section>:<section className="card empty">
      <div>🌍</div>
      <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>TU PRIMERA AVENTURA</p>
      <h2>El viaje puede empezar hoy.</h2>
      <p>Crea un Brinkkando o únete con un código.</p>
    </section>}

    {modal&&<Modal type={modal} onClose={()=>setModal(null)} onDone={()=>{setModal(null);load()}}/>}

    {editingMembership&&<div className="backdrop">
      <form className="card modal" onSubmit={saveAdventure}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>EDITAR AVENTURA</p><h2 style={{marginBottom:0}}>{editingMembership.games.name}</h2></div>
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
            <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>{deleteMembership.role==='owner'?'ELIMINAR BRINKKANDO':'SALIR DE LA AVENTURA'}</p>
            <h2 style={{marginBottom:0}}>{deleteMembership.games.name}</h2>
          </div>
          <button type="button" className="icon" onClick={()=>setDeleteMembership(null)}><X/></button>
        </div>

        {deleteMembership.role==='owner'?<>
          <p style={{color:'var(--muted)'}}>Se borrarán definitivamente Brinkkers, puntos, retos, etapas, subastas y ventajas de este Brinkkando.</p>
          <label>Escribe el nombre exacto para confirmar
            <input value={deleteText} onChange={e=>setDeleteText(e.target.value)} placeholder={deleteMembership.games.name}/>
          </label>
          <button className="wide" onClick={confirmDeleteOrLeave} disabled={deleteBusy} style={{
            border:0,borderRadius:'13px',padding:'13px 16px',fontWeight:'900',background:'#a13f3f',color:'white'
          }}>{deleteBusy?'Eliminando…':'Eliminar definitivamente'}</button>
        </>:<>
          <p style={{color:'var(--muted)'}}>Dejarás de ver este Brinkkando y tus datos de participación se eliminarán de ella.</p>
          <button className="wide" onClick={confirmDeleteOrLeave} disabled={deleteBusy} style={{
            border:0,borderRadius:'13px',padding:'13px 16px',fontWeight:'900',background:'#a13f3f',color:'white'
          }}>{deleteBusy?'Saliendo…':'Salir de el Brinkkando'}</button>
        </>}
        {deleteMessage&&<p className="msg">{deleteMessage}</p>}
      </section>
    </div>}

    {profileOpen&&<div className="backdrop">
      <form className="card modal" onSubmit={saveProfile}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div><p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>MI PERFIL</p><h2 style={{marginBottom:0}}>Personaliza tu Brinkker</h2></div>
          <button type="button" className="icon" onClick={()=>setProfileOpen(false)}><X/></button>
        </div>
        <div style={{width:'88px',height:'88px',borderRadius:'26px',background:profile.profile_color,display:'grid',placeItems:'center',fontSize:'3rem',margin:'8px auto 20px'}}>
          {profile.avatar_emoji||'🧭'}
        </div>
        <label>Nickname<input required maxLength="30" value={profile.nickname} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label>
        <label>Teléfono para Bizum
          <input type="tel" inputMode="tel" maxLength="20" value={profile.bizum_phone}
            onChange={e=>setProfile({...profile,bizum_phone:e.target.value})}
            placeholder="Opcional · 600 000 000"/>
          <small style={{display:'block',marginTop:'5px',color:'var(--muted)'}}>Solo se mostrará a los Brinkkers con los que compartas un Brinkkando para facilitar saldar cuentas.</small>
        </label>
        <label>Emoji<input required maxLength="4" value={profile.avatar_emoji} onChange={e=>setProfile({...profile,avatar_emoji:e.target.value})} placeholder="🧭"/></label>
        <label>Color<div style={{display:'grid',gridTemplateColumns:'70px 1fr',gap:'10px',alignItems:'center'}}>
          <input type="color" value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})} style={{height:'48px',padding:'5px'}}/>
          <input value={profile.profile_color} onChange={e=>setProfile({...profile,profile_color:e.target.value})}/>
        </div></label>
        <button className="primary wide" disabled={profileSaving}>{profileSaving?'Guardando…':'Guardar cambios'}</button>
        {profileMessage&&<p className="msg" style={{
      marginTop:'10px',padding:'10px 12px',borderRadius:'12px',
      background:'#f3f0e8',fontSize:'.84rem'
    }}>{profileMessage}</p>}

        <section style={{marginTop:'20px',paddingTop:'16px',borderTop:'1px solid #e1ddd2'}}>
          <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>CUENTA Y DATOS</p>
          <p style={{color:'var(--muted)',fontSize:'.85rem'}}>
            Para solicitar la eliminación de tu cuenta y datos, escribe al correo indicado en Privacidad desde el email de tu cuenta.
          </p>
          <button type="button" className="secondary wide" onClick={()=>setLegalOpen('privacy')}>
            Ver privacidad y contacto
          </button>
        </section>
      </form>
    </div>}

    <LegalLinks onOpen={setLegalOpen}/>
    {legalOpen&&<LegalModal section={legalOpen} onClose={()=>setLegalOpen(null)}/>}
  </main>
}
function ResetPassword({onDone}){
  const[password,setPassword]=useState('')
  const[repeat,setRepeat]=useState('')
  const[msg,setMsg]=useState('')
  const[busy,setBusy]=useState(false)

  async function submit(e){
    e.preventDefault()
    setMsg('')

    if(password.length<6){
      setMsg('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if(password!==repeat){
      setMsg('Las contraseñas no coinciden.')
      return
    }

    setBusy(true)
    const{error}=await supabase.auth.updateUser({password})

    if(error){
      setMsg(error.message)
      setBusy(false)
      return
    }

    await supabase.auth.signOut()
    window.history.replaceState({},'',window.location.pathname)
    setBusy(false)
    onDone()
  }

  return <main className="auth">
    <section className="brand">
      <div className="mark"><KeyRound size={42}/></div>
      <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>NUEVA CONTRASEÑA</p>
      <h1>Vuelve a Brinkkando.</h1>
      <p className="lead">Elige una contraseña nueva para recuperar tu cuenta.</p>
    </section>

    <form className="card authCard" onSubmit={submit}>
      <label>Nueva contraseña
        <input required minLength="6" type="password" value={password}
          onChange={e=>setPassword(e.target.value)}
          autoComplete="new-password"/>
      </label>

      <label>Repite la contraseña
        <input required minLength="6" type="password" value={repeat}
          onChange={e=>setRepeat(e.target.value)}
          autoComplete="new-password"/>
      </label>

      <button className="primary wide" disabled={busy}>
        {busy?'Guardando…':'Guardar contraseña'}
      </button>

      {msg&&<p className="msg" style={{
      marginTop:'10px',padding:'10px 12px',borderRadius:'12px',
      background:'#f3f0e8',fontSize:'.84rem',lineHeight:1.4
    }}>{msg}</p>}
    </form>
  </main>
}

function EmailConfirmed({session,onContinue}){
  const[legalOpen,setLegalOpen]=useState(null)
  return <main className="auth">
    <section className="brand">
      <div className="mark"><CheckCircle2 size={42}/></div>
      <p className="eyebrow" style={{marginBottom:'3px',fontSize:'.67rem',letterSpacing:'.08em'}}>EMAIL CONFIRMADO</p>
      <h1>¡Ya eres Brinkker!</h1>
      <p className="lead">Tu correo se ha confirmado correctamente. Ya puedes acceder a Brinkkando.</p>
    </section>
    <section className="card authCard" style={{textAlign:'center'}}>
      <div style={{fontSize:'4rem',marginBottom:'12px'}}>🎉</div>
      <h2>Cuenta activada</h2>
      <p style={{color:'var(--muted)'}}>{session?'Tu sesión ya está lista.':'Inicia sesión con tu email y contraseña.'}</p>
      <button className="primary wide" onClick={onContinue}>
        {session?'Entrar en Brinkkando':'Ir al inicio de sesión'}
      </button>
      <LegalLinks onOpen={setLegalOpen} compact/>
    </section>
    {legalOpen&&<LegalModal section={legalOpen} onClose={()=>setLegalOpen(null)}/>}
  </main>
}

export default function App(){
  const[session,setSession]=useState(null)
  const[ready,setReady]=useState(false)
  const[recovering,setRecovering]=useState(
    ()=>new URLSearchParams(window.location.search).get('password_recovery')==='1'
  )
  const[confirmed,setConfirmed]=useState(
    ()=>new URLSearchParams(window.location.search).get('email_confirmed')==='1'
  )

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setSession(data.session)
      setReady(true)
    })

    const{data}=supabase.auth.onAuthStateChange((event,nextSession)=>{
      setSession(nextSession)
      if(event==='PASSWORD_RECOVERY')setRecovering(true)
      setReady(true)
    })

    return()=>data.subscription.unsubscribe()
  },[])

  function continueAfterConfirmation(){
    window.history.replaceState({},'',window.location.pathname)
    setConfirmed(false)
  }

  function finishPasswordRecovery(){
    setRecovering(false)
    setSession(null)
  }

  if(!ready)return <div className="splash">
    <Compass size={44}/>
    <span>
      <strong>Brinkkando</strong>
      <small style={{display:'block',color:'var(--muted)',fontSize:'.65rem'}}>
        v{APP_VERSION}
      </small>
    </span>
  </div>

  if(recovering)return <ResetPassword onDone={finishPasswordRecovery}/>
  if(confirmed)return <EmailConfirmed session={session} onContinue={continueAfterConfirmation}/>
  return session?<BrinkkandoErrorBoundary><Dashboard session={session}/></BrinkkandoErrorBoundary>:<Auth/>
}
