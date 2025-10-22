import { useRef, useState } from "react"
import bcrypt from "bcryptjs"
import RequestsManager from "../util/RequetsManager.js"
import TakePicture from "./TakePicture.jsx"
export default function Cierre({}){
    const [option, SetOption] = useState(0)
    const [Tickets, SetTickets] = useState(undefined)
    const [photo, SetPhoto] = useState(false)
    const TicketSelected = useRef(undefined)
    const TicketId = useRef(undefined)
    const email = useRef(undefined)
    const password = useRef(undefined)
    const observaciones = useRef(undefined)
    const equipos_usados = useRef(undefined)
    const formData = useRef(undefined)
    const ExistObservaciones= useRef(undefined)
    const MantenimientoType = useRef(undefined)

    async function handleLogIn(e){
        e.preventDefault()
        const HashedPassword = await bcrypt.hash(password.current.value,10)
        let URL = "LogIn"
        const METHOD = "POST"
        const BODY = {
            Correo: email.current.value,
            Password: HashedPassword
        }
        const result = await RequestsManager({URL,METHOD,BODY: JSON.stringify(BODY)})
        if(result?.error) {
            password.current.value = ""
            email.current.value = ""
            return alert(`Error de inicio de sesión: ${result?.error}`)
        }
        URL = 'GetNewTickets'
        const Newtickets = await RequestsManager({URL})
        if(Newtickets?.error) {
            password.current.value = ""
            email.current.value = ""
            return alert(`Error al encontrar los tickets: ${Newtickets.error}`)
        }
        if(Newtickets.result.length === 0) {
            alert('No existen tickets por cerrar')
            password.current.value = ""
            email.current.value = ""
            return SetOption(0)  
        }
        const ticketOfUser = Newtickets.result.filter(ticket=> ticket.UUID_usuario === result.Id)
        if(ticketOfUser.length === 0){
            password.current.value = ""
            email.current.value = ""
            return alert(`El usuario que cierra debe ser el mismo que abrió el ticket`)
        }
        SetTickets(ticketOfUser)
        SetOption(1)
        
    }

    async function handleChoseTicket(e){
        e.preventDefault()
        if(e.target.value === "No") {
            const NewformData = new FormData();
            NewformData.append("observaciones", "Ninguno:Sin respuesto");
            NewformData.append("equipos_usados", "No Aplica");
            NewformData.append("id_ticket", Tickets.find(ticket => ticket.Asunto === TicketSelected.current.value).id_ticket);

            try {
                const result = await fetch('http://localhost:4000/calendar/CloseTicket',{
                    method: "POST",
                    body: NewformData
                })
                if(result?.error) {
                    SetOption(0)
                    return alert('No se pudo cerrar el ticket')
                }
                alert('Ticket Cerrado')
                SetOption(0)
            } catch (err) {
                SetOption(0)
                alert('Ocurrió un problema al cerrar el ticket')
            }
            return
        }
        TicketId.current = Tickets.find(ticket => ticket.Asunto === TicketSelected.current.value).id_ticket
        SetOption(2)
        
    }
    
    async function handleCloseTicket(e){
        e.preventDefault()
        const NewformData = new FormData();
        NewformData.append("observaciones", `${observaciones.current.value}:${MantenimientoType.current.value}`);
        NewformData.append("equipos_usados", equipos_usados.current.value);
        NewformData.append("id_ticket", TicketId.current);

        try {
            const result = await fetch('http://localhost:4000/calendar/CloseTicket',{
                method: "POST",
                body: NewformData
            })
            if(result?.error) {
                SetOption(1)
                return alert('No se pudo cerrar el ticket')
            }
            alert('Ticket Cerrado')
            SetOption(1)
        } catch (err) {
            SetOption(1)
            alert('Ocurrió un problema al cerrar el ticket')
        }
    }

    return(
        <>
            {
                option === 0 &&
                <div className="OptionConatiner">
                    
                    <label htmlFor="User">Correo electrónico</label>
                    <input type="email" id = "User" ref={email} required/>
        
                    <label htmlFor="Password">Password</label>
                    <input type="password" id = "Password" ref={password} required/>     
                    <div className="buttonPanel">
                    <button onClick={handleLogIn}>Iniciar</button>

                    </div>
                </div>
            }
            {option === 1 &&
                <div className="OptionConatiner">
                        <label htmlFor="TicketList">Tickets</label>
                        <input list="ListOfTickets" required id="TicketList" ref={TicketSelected}/>
                        <datalist id="ListOfTickets">
                            {Tickets &&
                            Tickets.map((ticket, index) => {
                                return(
                                    <option key= {index} value={`${ticket.Asunto}`}>{ticket.Asunto}, {ticket.Responsable}</option>
                                )
                            })

                            }
                        </datalist>
                        <label htmlFor="ExisteObservaciones">Existe alguna observación</label>
                        <input list="ListExisteObservaciones" id="ExisteObservaciones" onChange={handleChoseTicket} ref={ExistObservaciones}/>
                        <datalist id="ListExisteObservaciones">
                            <option value="Si">Si</option>
                            <option value="No">No</option>
                        </datalist>
                </div>

            }
            {option === 2 &&
                <div className="OptionConatiner">
                    <label htmlFor="TipoMante">Tipo de Mantenimiento</label>
                    <input list="Mantenimiento" ref={MantenimientoType}/>
                    <datalist id="Mantenimiento">
                        <option value="Con respuesto">Con respuesto</option>
                        <option value="Sin respuesto">Sin respuesto</option>
                    </datalist>
                    <label htmlFor="Observaciones">Observaciones</label>
                    <input type="text" id="Observaciones" required ref={observaciones}/>
                    <label htmlFor="EquiposUsados">Equipos usados</label>
                    <input type="EquiposUsados" ref={equipos_usados}/>
                    <button onClick={()=> {
                        formData.current = {
                            observaciones: observaciones.current.value || "Ninguno",
                            equipos_usados: equipos_usados.current.value || "Ninguno",
                            id_ticket: TicketId.current,
                            MantenimientoType: MantenimientoType.current.value
                        }
                        SetPhoto(true)
                        }}>Ilustración</button>
                    {!photo && <button onClick={handleCloseTicket}>Cerrar el ticket</button>}
                </div>

            }
            {photo &&
                <TakePicture
                    formData={formData.current}
                    SetPhoto = {SetPhoto}
                    SetOption = {SetOption}
                />

            }
        </>
    )
}