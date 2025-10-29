import { useRef } from 'react'
import { CLASSHOURS } from '../utils/constants.js'
import './DayInfo.css'
import { nanoid } from 'nanoid'
import getSessionPos from '../utils/getSessionpos.js'

export default function DayInfo({dayInfo, CalendarType, SetSessionSelected,SetLog, User, SetUser}){
    const Mesa = useRef(undefined)
    const TimeSession = useRef(undefined)
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
                session: {NewSessionInfo:`${dayInfo.Year}-${String(dayInfo.Month+1).padStart(2, "0")}-${String(dayInfo.Date).padStart(2, "0")}`,
                    User: User.UserDetail, Mesa: Mesa.current, TimeSession: TimeSession.current
                }
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
                    const Session = dayInfo?.sessions?.filter(session => session.Hora_inicial === CLASSHOURS[i].split('-')[0] ) 
                
                    return(
                        <>
                            {Session?.length ?
                                    <div className="session"
                                    key={nanoid(4)} 
                                    style={{padding:"0px"}}>
                                        <div className={Session.some(sess => sess.Mesas.includes("Mesa1"))?"sessionInfo Mesa":"sessionInfo Mesa empty"}
                                        title='Mesa1'
                                        onClick={(e)=>{
                                            e.preventDefault()
                                            if(!Boolean(Session.some(sess => sess.Mesas.includes("Mesa1")))) {
                                                TimeSession.current = CLASSHOURS[i].split('-')
                                                return handleNewSession(e)
                                            }
                                            alert("Ya se encuentra reservada la mesa")
                                        }}
                                        ><small>Mesa 1</small></div>
                                        <div className={Session.some(sess => sess.Mesas.includes("Mesa2"))?"sessionInfo Mesa":"sessionInfo Mesa empty"}
                                        title='Mesa2'
                                        onClick={(e)=>{
                                            e.preventDefault()
                                            if(!Boolean(Session.some(sess => sess.Mesas.includes("Mesa2")))) {
                                                TimeSession.current = CLASSHOURS[i].split('-')
                                                return handleNewSession(e)
                                            }
                                            alert("Ya se encuentra reservada la mesa")
                                        }}
                                        ><small>Mesa 2</small></div>
                                        <div className={Session.some(sess => sess.Mesas.includes("Mesa3"))?"sessionInfo Mesa":"sessionInfo Mesa empty"}
                                        title='Mesa3'
                                        onClick={(e)=>{
                                            e.preventDefault()
                                            if(!Boolean(Session.some(sess => sess.Mesas.includes("Mesa3")))) {
                                                TimeSession.current = CLASSHOURS[i].split('-')
                                                return handleNewSession(e)
                                            }
                                            alert("Ya se encuentra reservada la mesa")
                                        }}
                                        ><small>Mesa 3</small></div>
                                        {
                                            Session.map((sess,index) => {
                                                const pos = getSessionPos({Mesas: sess.Mesas})
                                                return(
                                                    <div className="sessionInfo" 
                                                    key={index}
                                                    style={{gridColumn: pos,
                                                    gridRow: "2/-1", height:"100%", 
                                                    fontSize:"13px", overflow:"hidden"}}
                                                    onClick={sess ? ()=>{SetSessionSelected([sess])}:handleNewSession}>
                                                        <small title={sess ?`${sess.Asunto}\nInicia: ${sess.Hora_inicial}\nFinaliza: ${sess.Hora_final}\nDocente: ${sess.Responsable}`:'Click para Crear Sessión'}>
                                                            {sess.Asunto}
                                                        </small>
                                                    </div> 
                                                )
                                            })
                                        }

                                    </div>
                                : i === 0 ?
                                <div style={{height: "100px"}} key={nanoid(4)} title={"Click para Crear Sessión"} className={i === 0 ? "DayHeader":""}>
                                    {i === 0 &&
                                    <>
                                        <span>{dayInfo.Date}</span>
                                        {User?.User && <img src="../public/Add.svg" alt="Crear Sessión" onClick={handleNewSession}/>}
                                    </> 
                                    }
                                </div>:
                                <div>
                                    <div className="sessionInfo Mesa empty" title='Mesa 1' aria-label="Mesa 1" 
                                    style={{gridRow:"1/-1"}}
                                    onClick={(e)=>{
                                        Mesa.current = 1
                                        TimeSession.current = CLASSHOURS[i].split('-')
                                        handleNewSession(e)
                                    }}>
                                        <p className="label">Mesa 1</p>
                                    </div>
                                    <div className="sessionInfo Mesa empty" title='Mesa 2' aria-label="Mesa 2" 
                                    style={{gridRow:"1/-1" }}
                                    onClick={(e)=>{
                                        Mesa.current = 2
                                        TimeSession.current = CLASSHOURS[i].split('-')
                                        handleNewSession(e)
                                    }}>
                                        <p className="label">Mesa 2</p>
                                    </div>
                                    <div className="sessionInfo Mesa empty" title='Mesa 3' aria-label="Mesa 3" 
                                    style={{gridRow:"1/-1"}}
                                    onClick={(e)=>{
                                        Mesa.current = 1
                                        TimeSession.current = CLASSHOURS[i].split('-')
                                        handleNewSession(e)
                                    }}>
                                        <p className="label">Mesa 3</p>
                                    </div>
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