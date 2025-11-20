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
                    const Session = dayInfo?.sessions?.find(session => session.Hora_inicial === CLASSHOURS[i])
                    return(
                        <>
                            {Session?.Hora_inicial === CLASSHOURS[i] ?
                                    <div className={"session"} style={{gridRow: Session?`${1+i}/${1+CLASSHOURS.findIndex(hour => {
                                        return hour === Session.Hora_final
                                    })}`:""
                                    }} 
                                    key={nanoid(4)} title={Session ?`${Session.Asunto}\nInicia: ${Session.Hora_inicial}\nFinaliza: ${Session.Hora_final}\nDocente: ${Session.Responsable}`:'Click para Crear Sessión'}
                                    onClick={Session ? ()=>{SetSessionSelected([Session])}:handleNewSession}>
                                    {i === 0 &&
                                    <>
                                        <span>{dayInfo.Date}</span>
                                        {User?.User &&<img src="../public/Add.svg" alt="Crear Sessión" />}
                                    </> 
                                    }
                                    {Session &&
                                        <div className="sessionInfo">
                                            <small title={Session.Asunto}>
                                                {dayInfo?.sessions.find(session => session.Hora_inicial === CLASSHOURS[i]).Asunto}
                                            </small>
                                        </div>                  
                                    }
                                    </div>
                                :
                                <div className={i === 0 ? "DayHeader":""} style={{height: "30px"}} key={nanoid(4)} title={"Click para Crear Sessión"}></div>
                            }
                        </>
                    )
                })

            }
        </div>
    </>
)
}