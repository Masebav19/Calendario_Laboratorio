import "./TicketCard.css"

export default function TicketCard ({ ticket }){
    return(
        <div className="ticketCardConatiner">
            <span>
                <h4>{ticket.Asunto}</h4>
            </span>
            <span>
                <small><strong>Fecha Registro:</strong> {ticket.fecha_registro.split(' ')[0]} {ticket.fecha_registro.split(' ')[1].split('.')[0]}</small>
                <small><strong>Fecha de cierre:</strong> {ticket.fecha_cierre.split(' ')[0]} {ticket.fecha_cierre.split(' ')[1].split('.')[0]}</small>
            </span>
            <div className="imagetickerConatiner">
                <img src={`http://localhost:4000/calendar/GetTicketImage/${ticket.id_ticket}`} alt="" />
            </div>
            <div className="Observaciones">
                <h5>Observaciones</h5>
                <span>{ticket.observaciones.split(':').map((obs,index) =>{
                    return(
                        <small key={index}><strong>{index === 1?'Tipo de mantenimiento: ':''}</strong>{obs}</small>
                    )
                })}</span>
            </div>
        </div>
    )
}