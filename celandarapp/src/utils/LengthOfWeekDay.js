export default function LengthOfWeekDay({dayInfo}){
    if(!dayInfo?.sessions) return 68
    let nRows = 68
    dayInfo.sessions.forEach(session =>{
        const [horaInit, minutoInicial] = session.Hora_inicial.split(':')
        const [horaFinal, minutoFinal] = session.Hora_final.split(':')
        const NofRows = 4*((Number(horaFinal)+Number(minutoFinal)/15)-(Number(horaInit)+Number(minutoInicial)/15))
        nRows -= (NofRows-1)
    })
    return nRows
}