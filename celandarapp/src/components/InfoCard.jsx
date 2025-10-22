import './InfoCard.css'
import { DAYSNAMES, MONTHNAMES } from '../utils/constants.js'
export default function InfoCard({session, Color}){
    return(
        <div className="card-container" style={{background: Color,color:"white"}}>
            <div className="title-section">
                <span><strong>{session.Asunto}</strong></span>
                <span><img src="../public/teacher.svg" alt="Responsable" /> <small><a href={`mailto://${session.Correo_responsable}`}>{session.Responsable}</a></small></span>
            </div>
            <article>
                <span>
                    <img src="../public/time.svg" alt="Hora" />
                    <small>{session.Hora_inicial}-{session.Hora_final} {session.Periodicidad === "Semanalmente"? `Cada ${DAYSNAMES[(new Date(session.Year,session.Month,session.Date)).getDay()]}`
                    :session.Periodicidad === "Mensualmente"?`${session.Date} de ${MONTHNAMES[session.Month]}`:""}</small>
                </span>
            </article>
        </div>
    )
}