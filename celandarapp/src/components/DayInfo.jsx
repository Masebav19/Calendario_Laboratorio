import { CLASSHOURS } from '../utils/constants.js'
import './DayInfo.css'
import { nanoid } from 'nanoid'

export default function DayInfo({dayInfo, CalendarType, SetSessionSelected,SetLog, User, SetUser}){

    async function handleNewSession(e){
        e.preventDefault()
        if(!User?.User) {
            SetLog(prev => {
            return{
              ...prev,
              state: true,
              session:true
            }
          })
          SetUser("LogIn")
        }

        SetLog(prev=>{
            return{
                ...prev,
                session: {NewSessionInfo:`${dayInfo.Year}-${String(dayInfo.Month+1).padStart(2, "0")}-${String(dayInfo.Date).padStart(2, "0")}`}
            }
        })
    }
return(
    <>
        <div className={`dayInfoContainer ${CalendarType}`}>
            {CalendarType === "month" && 
                <div className="DayHeader">
                    <span>{dayInfo.Date}</span>
                    {User?.User && <img src="../public/Add.svg" alt="Crear Sessión" onClick={handleNewSession}/>}
                </div>
            }
            {dayInfo?.sessions && CalendarType === "month" &&
                <div className="sessionInfo" onClick={()=>{SetSessionSelected(dayInfo.sessions)}}>
                    <small title={dayInfo.sessions[0].Asunto}>
                        {dayInfo.sessions.length > 1 ? `+${dayInfo.sessions.length}`:`${dayInfo.sessions[0].Asunto}`}
                    </small>
                </div>
            }

            {CalendarType === "week" &&
                Array.from({length: CLASSHOURS.length},(v,i) => i).map(i=>{
                    const Session = dayInfo?.sessions?.find(session => session.Hora_inicial === CLASSHOURS[i].split('-')[0] ) 
                    
                    return(
                        <>
                            {Session?.Asunto ?
                                    <div className="session"
                                    key={nanoid(4)} 
                                    
                                    style={{padding:"0px"}}>
                                    <div className={Session.Mesas.split(',')[0] === "Mesa1"?"sessionInfo Mesa":"sessionInfo Mesa empty"}
                                    title='Mesa1'><small>mesa 1</small></div>
                                    <div className={Session.Mesas.split(',')[1] === "Mesa2"?"sessionInfo Mesa":"sessionInfo Mesa empty" }
                                    title='Mesa2'><small>mesa 2</small></div>
                                    <div className={Session.Mesas.split(',')[2] === "Mesa3"?"sessionInfo Mesa":"sessionInfo Mesa empty" }
                                    title='Mesa3'><small>mesa 3</small></div>
                                    <div className="sessionInfo" 
                                    style={{gridColumn: `1/${Session.Mesas.split(',').length+1}`,
                                    gridRow: "2/-1", height:"100%", 
                                    fontSize:"12px"}}
                                    onClick={Session ? ()=>{SetSessionSelected([Session])}:handleNewSession}>
                                        <small title={Session ?`${Session.Asunto}\nInicia: ${Session.Hora_inicial}\nFinaliza: ${Session.Hora_final}\nDocente: ${Session.Responsable}`:'Click para Crear Sessión'}>
                                            {Session.Asunto}
                                        </small>
                                    </div>                  
                                    
                                    </div>
                                :
                                <div style={{height: "100px"}} key={nanoid(4)} title={"Click para Crear Sessión"} className={i === 0 ? "DayHeader":""}>
                                    {i === 0 &&
                                    <>
                                        <span>{dayInfo.Date}</span>
                                        {User?.User &&<img src="../public/Add.svg" alt="Crear Sessión" />}
                                    </> 
                                    }
                                </div>
                            }
                        </>
                    )
                })

            }
        </div>
    </>
)
}