import './App.css'
import { useRef, useState } from 'react'
import CalendarConatiner from './components/CalendarComponent'
import InfoSessionPanel from './components/InfoSessionPanel'
import bcrypt from 'bcryptjs'
import RequestsManager from './utils/RequetsManager.js'

function App() {
  const [CalendarType, setCalendarType] = useState('month')
  const [SessionSelected, SetSessionSelected] = useState(undefined)
  const [Log, SetLog] = useState({state: false, Status: undefined, session: false})
  const [User,SetUser] = useState("No defined")

  const email = useRef(undefined)
  const password = useRef(undefined)
  const Name = useRef(undefined)
  const Type = useRef(undefined)

  const Asunto = useRef(undefined)
  const Responsable = useRef(undefined)
  const CorreoResp = useRef(undefined)
  const Hora_inicial = useRef(undefined)
  const Hora_final = useRef(undefined)
  const fecha_inicio = useRef(undefined)
  const Periodicidad = useRef(undefined)
  const Mesas = useRef(undefined)

  function handleChangeMonth(){
      setCalendarType('month')
  }
  function handleChangeWeek(){
      setCalendarType('week')
  }

  async function handleLog(e){
    e.preventDefault()
    if(User === "LogIn"){
      const HashedPassword = await bcrypt.hash(password.current.value,10)
      const URL = "LogIn"
      const METHOD = "POST"
      const BODY = {
        Correo: email.current.value,
        Password: HashedPassword
      }
      const result = await RequestsManager({URL,METHOD,BODY})
      SetLog(prev => {
        return {
          ...prev,
          Status: result?.result? undefined:"Error"
        }
      })
      if(result?.result) {
        alert(`Session inciada ${result.result}\nPuede crear session dando click en Nuevo evento o dando click en + en cada día`)
        SetUser({"User": result.result,"UserDetail": result.User})
        SetLog({state: false, Status: undefined, session:false})
      }
      else {
        alert(`${result.error}`)
        SetUser("LogIn")
      }
      
    }else{
      
      if(Name.current.value.split(" ").length < 2){
        alert(`Colocar el un nombre y un apellido separados por espacio`)
        SetLog(prev=> {
          return {
            ...prev,
            Status:'Error'
          }
        })
        Name.current.value = ""
        return 
      }
      const URL = "SignUp"
      const METHOD = "POST"
      const BODY = {
        Correo: email.current.value,
        Password: password.current.value,
        Nombre: Name.current.value.split(" ")[0],
        Apellido: Name.current.value.split(" ")[1],
        Tipo: Type.current.value

      }
      
      const result = await RequestsManager({URL,METHOD,BODY})
      SetLog(prev => {
        return {
          ...prev,
          Status: result?.result? undefined:"Error"
        }
      })
      if(result?.result) {
        alert(`Session inciada ${result.result}\nPuede crear session dando click en Nuevo evento o dando click en + en cada día`)
        SetUser({"User": result.result})
        SetLog({state: false, Status: undefined, session:false})
      }
      else {
        alert(`${result.error}`)
        SetUser("LogIn")
      }
    }
    
  }

  async function handleNewSession(e){
    e.preventDefault()
    const minInicial = Hora_inicial.current.value.split(':')[1]
    const minFinal = Hora_final.current.value.split(':')[1]
    if(!(minInicial === "15"|| minInicial === "30" || minInicial === "00" || minInicial === "45" ||
      minFinal === "15"|| minFinal === "30" || minFinal === "00" || minFinal === "45")){
      
        alert(`El intervalo del la hora inicial o final es de 15 minutos`)
        return  

    }

      const URL = "NewSession"
      const METHOD = "POST"
      const BODY = {
        Asunto: Asunto.current.value,
        Hora_inicial: Hora_inicial.current.value,
        Hora_final: Hora_final.current.value,
        Periodicidad: Periodicidad.current.value,
        Responsable: Responsable.current.value,
        Correo_responsable: CorreoResp.current.value,
        fecha_inicio: fecha_inicio.current.value,
        Mesas: Mesas.current.value
      }
      const result = await RequestsManager({URL,METHOD,BODY})
      if(result?.success) {
        alert(`Session creada`)
        SetLog({state: false, Status: undefined, session:false})
      }else {
        alert(`${result.error}`)
        SetLog({state: false, Status: undefined, session:false})
      }
    
  }
  return (
    <>
    <header>
      <small>Laboratorio de Instrumentación Industrial</small>
      <div id="option-container">
        <span onClick={(e)=> {
          e.preventDefault()
          if(User?.User) SetLog(prev => {
            return{
              ...prev,
              session: true
            }
          })
          else{
            SetLog(prev => {
            return{
              ...prev,
              state: true,
            }
          })
          SetUser("LogIn")
          }
        }}>
          <img src="../public/Add.svg" alt="Create" />
          <small>Nuevo evento</small>
        </span>
        <span className={CalendarType=== 'month'? 'selected':''} onClick={handleChangeMonth}>
          <img src="../public/month.svg" alt="" />
          <small>Mes</small>
        </span>
        <span className={CalendarType=== 'week'? 'selected':''} onClick={handleChangeWeek}>
          <img src="../public/week.svg" alt="" />
          <small>Semana Laboral</small>
        </span>
        <span onClick={()=>{
          SetLog(prev => {
            return{
              ...prev,
              state: true,
              session:true
            }
          })
          SetUser("LogIn")
          }}>
          <img src="../public/Log.svg" alt="" />
          <small>Incio/Registro</small>
        </span>
      </div>
      {Log.state &&
        <div className="LogConatiner">
          <span><img src={Log.Status === "Error"?"../public/error.gif":"../public/dog.gif"} alt="" /></span>
          <div className="LogPanel">
            <div className="inputContainer" style={{gridColumn:User==="LogIn"?"1/3":"1/2"}}>
              <label htmlFor="User">Correo electrónico</label>
              <input type="email" id = "User" ref={email} required/>
            </div>
            <div className="inputContainer" style={{gridColumn:User==="LogIn"?"1/3":"2/3"}}>
              <label htmlFor="Password">Password</label>
              <input type="password" id = "Password" ref={password} required/>
            </div>
            {User === "SignUp" &&
            <>
              <div className="inputContainer">
                <label htmlFor="Name">Nombre Completo</label>
                <input type="text" id = "Name" ref={Name} required/>
              </div>
              <div className="inputContainer">
                <label htmlFor="Type">Tipo de usuario</label>
                <input list='ListType' id = "Type" ref={Type} required/>
                <datalist id='ListType'>
                  <option value="Docente">Docente</option>
                  <option value="Técnico">Docente de Laboratorio</option>
                  <option value="Estudiante-Docente">Estudiante del Docente</option>
                  <option value="Estudiante-Técnico">Estudiante de Laboratorio</option>
                </datalist>
              </div>
            </>
            }
            <div className="buttonPanel" style={{gridColumn:User==="LogIn"?"1/3":"1/3"}}>
              <button onClick={handleLog}>Iniciar</button>
              {User === "LogIn"&&<button onClick={()=>{
                SetUser("SignUp")
                SetLog(prev=> {
                  return {
                    ...prev,
                    Status: undefined
                  }
                })
                email.current.value = ""
                password.current.value = "" 
                }}>Registrarse</button>}
              <button onClick={()=>{
                SetUser("No defined") 
                SetLog({state: false, Status: undefined, session:false})}}>Salir</button>
            </div>
          </div>
        </div>
      }

      {User?.User && (Log.session || Log?.session?.NewSessionInfo) &&
        <div className="SessionConatiner">
          <div className="SessionPanel">
            <div className="inputContainer">
              <label htmlFor="Asunto">Asunto</label>
              <input type="text" id = "Asunto" ref={Asunto} required defaultValue={"Reserva"}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="Responsable">Responsable</label>
              <input type="text" id = "Responsable" ref={Responsable} required defaultValue={`${Log.session.User.Nombre} ${Log.session.User.Apellido}`}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="CorreoRes">Correo del responsable</label>
              <input type="email" id = "CorreoRes" ref={CorreoResp} required defaultValue={Log.session.User.correo}/>
            </div>
            <div className="inputContainer">
              <label htmlFor="Periodicidad">Periodicidad</label>
                <input list='ListPeriodicidad' id = "Periodicidad" ref={Periodicidad} required defaultValue={"Ninguno"}/>
                <datalist id='ListPeriodicidad'>
                  <option value="Semanalmente">Semanalmente</option>
                  <option value="Mensualmente">Mensualmente</option>
                  <option value="Anualmente">Anualmente</option>
                  <option value="Ninguno">Ninguno</option>
                </datalist>
            </div>
           <div className="inputContainer">
              <label htmlFor="Hora_inicial">Hora Inicial</label>
              <input type="time" id = "Hora_inicial" ref={Hora_inicial} 
              required step={"900"} min={"07:00"} max={"21:45"}
              defaultValue={Log.session?.TimeSession[0]}/>
              
            </div>
           <div className="inputContainer">
              <label htmlFor="Hora_final">Hora Final</label>
              <input type="time" id = "Hora_final" ref={Hora_final} 
              required step={"900"} min={"07:00"} max={"21:45"}
              defaultValue={Log.session?.TimeSession[1]}/>
          </div>
           <div className="inputContainer">
              <label htmlFor="Fecha">Fecha</label>
              <input type="date" id = "Fecha" ref={fecha_inicio} required defaultValue={Log.session?.NewSessionInfo ? Log.session?.NewSessionInfo:""}/>
          </div>
           <div className="inputContainer">
              <label htmlFor="MesasInput">Numero de mesas</label>
              <input list='MesasList' id = "MesasInput" ref={Mesas} required
              defaultValue={"Mesa"}/>
              <datalist id='MesasList'>
                <option value="Mesa1">Mesa1</option>
                <option value="Mesa2">Mesa2</option>
                <option value="Mesa3">Mesa3</option>
                <option value="Mesa1,Mesa2">Mesa1,Mesa2</option>
                <option value="Mesa2,Mesa3">Mesa2,Mesa3</option>
                <option value="Mesa1,Mesa2,Mesa3">Mesa1,Mesa2,Mesa3</option>
              </datalist>
          </div>

            <div className="buttonPanel">
              <button onClick={handleNewSession}>Iniciar</button>
              <button onClick={()=>{
                SetLog(prev=>{
                  return{
                    ...prev,
                    session:false
                  }
                })
              }}>Cerrar</button>
            </div>
          </div>
        </div>
      }
    </header>
    <main>
      <CalendarConatiner
        CalendarType={CalendarType}
        SetSessionSelected = {SetSessionSelected}
        SetLog = {SetLog}
        SetUser = {SetUser}
        User = {User}
        Log = {Log}
      />
      <InfoSessionPanel
      SessionSelected={SessionSelected}
      />
    </main>
    <footer>
    <small>Laboratorio de redes Industriales</small>
    <small><strong>Coordinadora: </strong>Silvana del Pilar Gamboa</small>
    <small><strong>Contacto: </strong><a href="mailto://silvana.gamboa@epn.edu.ec">silvana.gamboa@epn.edu.ec</a></small>
    </footer>
      
    </>
  )
}

export default App
