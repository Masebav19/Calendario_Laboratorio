import { useState, useRef } from "react"
import bcrypt from "bcryptjs"
import RequestsManager from "../util/RequetsManager.js"
import TicketCard from "./TicketCard.jsx"
import "./Consulta.css"
export default function Consulta({}){
    const [option, SetOption] = useState(0)
    const TicketsClosed = useRef(undefined)
    const email = useRef(undefined)
    const password = useRef(undefined)

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
        if(result?.result !== "mateo.vasquez@epn.edu.ec") return alert("No estas autorizado para consultas")   
        URL = 'GetClosedTickets'
        const res = await RequestsManager({URL})
        if(result?.error) {
            password.current.value = ""
            email.current.value = ""
            return alert(`Error el encontrar ticket: ${result?.error}`)
        }
        TicketsClosed.current = res.result
        SetOption(1)
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
            <div className="TicketConatiner">
                {
                    TicketsClosed.current.map((ticket,index) =>{
                        return(
                            <TicketCard
                                ticket={ticket}
                                key={index}
                            />
                        )
                    })
                }
            </div>
            

            }
        </>
    )
}