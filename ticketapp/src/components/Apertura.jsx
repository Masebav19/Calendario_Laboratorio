import { useRef, useState } from "react"
import RequestsManager from "../util/RequetsManager.js"
import "./Apertura.css"

export default function Apertura({}){
    const [option, SetOption] = useState(0)
    const [Sessions, SetSessions] = useState(undefined)
    const dateSession = useRef(undefined)
    const SessionSelected = useRef(undefined)
    const email = useRef(undefined)
    async function handleGetSessions(e){
        e.preventDefault()
        const NewDate = dateSession.current.value
        const [Year, Month, Date] = NewDate.split('-')
        const URL = `getDaysbyWeek/${Month}/${Year}/${Date}`
        const result = (await RequestsManager({URL})).find(session => session.Year == Year && session.Month == Number(Month)-1 && session.Date == Date)
        if(!result?.sessions) return alert('No existe sessiones en el día seleecionado')
        SetSessions({SessionDate: dateSession.current.value, Sessions: result.sessions})
        SetOption(1)
    }

    async function handleNewTicket(e){
        e.preventDefault()
        const URL = "OpenTicket"
        const BODY = {
            Correo: email.current.value,
            Asunto: SessionSelected.current.value,
            Fecha: Sessions.SessionDate
        }
        const result = await RequestsManager({URL, METHOD:"POST", BODY: JSON.stringify(BODY)})
        if(result?.error) return alert(`No se puedo ingresar el ticket: ${result.error}`)
        alert('Ticket ingresado')
    }
    return(
        <>
            {
                option === 0 &&
                <div className="OptionConatiner">
                    <label htmlFor="AperturaDate">Ingrese la fecha del día de su sessión</label>
                    <input type="date" id="AperturaDate" onChange={handleGetSessions} onKeyDown={(e)=>{if(e.key === "Enter") handleGetSessions(e)} } ref={dateSession} defaultValue={(new Date()).toISOString().split('T')[0]}/>
                </div>
            }
            {
                option === 1 &&
                <div className="OptionConatiner">
                    <label htmlFor="AperturaDate">Session</label>
                    <input list="SessionList" id="Sessiones" required ref={SessionSelected}/>
                    <datalist id="SessionList">
                        {
                            Sessions &&
                            Sessions.Sessions.map((session,index)=>{
                                return(
                                    <option key={index} value={`${session.Asunto}`}>{session.Asunto} {session.Responsable}</option>
                                )
                            })
                        }
                    </datalist>
                    <label htmlFor="email">Correo</label>
                    <input type="email" required ref={email}/>
                    <button onClick={handleNewTicket}>Abrir el ticket</button>
                </div>
            }
        </>
    )
}