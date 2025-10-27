import mysql from "mysql2/promise.js"
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"

export default class MySQLClient{
    constructor(){
        this.Client = mysql
    }
    async getSessionbymonth ({year,month}){
        //const client = await mysql.createConnection("mysql://root:@localhost:3306")
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        con.connect()
        await con.query("USE intrucalendar")
        const result = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ?",[year,month-1])
        con.end()
        return result[0] || []
    }

    async holadaybymonth ({year,month}){
        //const client = await mysql.createConnection("mysql://root:@localhost:3306")
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const result = await con.query("SELECT * FROM feriados WHERE Year = ? AND Month = ?",[year,month-1])
        con.end()
        return result[0] || []
    }

    async CreateMultpleSessions({sessions}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const result = await con.query(`INSERT INTO sesiones (Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, Year, Month, Date, fecha_inicio, Mesas) VALUES ${sessions.map(session =>{
            return `('${session.Asunto}','${session.Hora_inicial}','${session.Hora_final}','${session.Periodicidad}','${session.Responsable}','${session.Correo_responsable}',${session.Year},${session.Month},${session.Date},'${session.fecha_inicio}','${session.Mesas}')`
        }).join(",")}`)
        con.end()
        return result[0] ? true : false
    }

    async DeleteSession({Asunto, Hora_inicial, Correo}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const IsThaSession = await con.query("SELECT * FROM sesiones WHERE Asunto = ? AND Hora_inicial = ?",[Asunto, Hora_inicial])
        if(IsThaSession[0][0].Correo_responsable !== Correo) return {error: "Debe contener el mismo correo"}
        const result = await con.query("DELETE FROM sesiones WHERE Asunto = ? AND Hora_inicial = ? AND Correo_responsable = ?",[Asunto, Hora_inicial, Correo])
        return result[0] ? true : false
    }

    async SignUp({Nombre, Apellido, Correo, Tipo, Password}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].length > 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: El usuario ya existe"])
            return {error: "El usuario ya existe"}
        }

        const UUID = uuidv4()
        const result = await con.query("INSERT INTO integrantes (UUID, Nombre, Apellido, correo, Tipo) VALUES (?,?,?,?,?)",
            [UUID, Nombre, Apellido, Correo, Tipo])
        if(result[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: No se pudo crear el usuario"])
            return {error: "No se pudo crear el usuario"}
        }
        const result2 = await con.query("INSERT INTO credenciales (UUID, password) VALUES (?,?)",[UUID, Password])
        if(result2[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UUID, Correo, Nombre, Apellido, "Creacion de usuario fallida: No se pudo crear la contraseña"])
            con.query("DELETE FROM integrantes WHERE UUID = ?",[UUID])
            return {error: "No se pudo crear la contraseña"}
        }
        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
            [UUID, Correo, Nombre, Apellido, "Creacion de usuario: Exitosa"])
        return {result: Correo}
    }

    async LogIn({Correo, Password}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                ["NA", Correo, "NA", "NA", "LogIn: No se encontró el usuario"])
            return {error: "El usuario no existe"}
        }
        const UUID = UserExist[0][0].UUID
        const PasswordExist = await con.query("SELECT * FROM credenciales WHERE UUID = ?",[UUID])
        if(!(await bcrypt.compare(PasswordExist[0][0].password,Password))) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "LogIn: Contraseña Incorrecta"])
            return {error: "La contraseña es incorrecta"}
        }

        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
            [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "LogIn: Exitoso"])
        return {result: Correo, Id: UserExist[0][0].UUID}
    }
    async DeleteUser({Correo, Password}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                ["NA", Correo, "NA", "NA", "Borrar usuario: No se encontró el usuario"])
            return {error: "El usuario no existe"}
        }
        const UUID = UserExist[0][0].UUID
        const PasswordExist = await con.query("SELECT * FROM credenciales WHERE UUID = ?",[UUID])
        if(PasswordExist[0][0].password !== Password) {
            await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [PasswordExist[0][0].UUID, Correo, PasswordExist[0][0].Nombre, PasswordExist[0][0].Apellido, "Borrar usuario: Contraseña incorrecta"])
            return {error: "La contraseña es incorrecta"}
        }
        await con.query("DELETE FROM credenciales WHERE UUID = ?",[UUID])
        await con.query("DELETE FROM integrantes WHERE UUID = ?",[UUID])

        await con.query("INSERT INTO lab_logs_sessions (UUID, correo, Nombre, Apellido, Resultado) VALUES (?,?,?,?,?)",
                [UserExist[0][0].UUID, Correo, UserExist[0][0].Nombre, UserExist[0][0].Apellido, "Borrar usuario: Exitoso"])
        return {result: true}
    }
    async OpenTicket({Correo, Asunto, Fecha}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const UserExist = await con.query("SELECT * FROM integrantes WHERE correo = ?",[Correo])
        if(UserExist[0].affectedRows === 0) return {error: "El usuario no existe"}
        const SessionDate = new Date(Fecha)
        const SessionYear = SessionDate.getFullYear()
        const SessionMonth = SessionDate.getMonth()
        const SessionDay = SessionDate.getDate()+1
        const SessionExist = await con.query("SELECT * FROM sesiones WHERE Year = ? AND Month = ? AND Date = ? AND Asunto = ?",
            [SessionYear, SessionMonth, SessionDay, Asunto])
        if(SessionExist[0].affectedRows === 0) return {error: "La sesión no existe"}
        const UUID = UserExist[0][0].UUID
        const TicketID = nanoid()
        const registerDate = new Date().toISOString().split('T').join(' ').split('.')[0]
        const result = await con.query("INSERT INTO ticket (id_ticket, id_session, UUID_usuario, fecha_registro) VALUES (?,?,?,?)",
            [TicketID, SessionExist[0][0].Id, UUID, registerDate])
        if(result[0].affectedRows === 0) return {error: "No se pudo crear el ticket"}
        return {result: true}
    }

    async CloseTicket({observaciones, equipos_usados, id_ticket, imagePath}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const TicketExist = await con.query("SELECT * FROM ticket WHERE id_ticket = ?",[id_ticket])
        if(TicketExist[0].affectedRows === 0) return {error: "El ticket no existe"}
        const cierreDate = new Date().toISOString().split('T').join(' ').split('.')[0]
        const result = await con.query("UPDATE ticket SET fecha_cierre = ?, observaciones = ?, image_path = ?, equipos_usados = ? WHERE id_ticket = ?"
            ,[cierreDate, observaciones, imagePath || "Ninguno", equipos_usados, id_ticket])
        if(result[0].affectedRows === 0) return {error: "No se pudo cerrar el ticket"}
        return {result: true}
    }
    async ReadNewTickets(){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const NewTickets = await con.query("SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NULL")
        if(NewTickets[0].affectedRows === 0) return {error: "No existen tickets abiertos"}
        return {result: NewTickets[0]}

    }
    async ReadClosedTickets(){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const ClosedTickets = await con.query("SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NOT NULL")
        if(ClosedTickets[0].affectedRows === 0) return {error: "No existen tickets abiertos"}
        return {result: ClosedTickets[0]}
    }
    async GetImageTicket({id_ticket}){
        const con = await this.Client.createConnection("mysql://root:@localhost:3306")
        await con.connect()
        await con.query("USE intrucalendar")
        const PathImage = await con.query("SELECT image_path FROM ticket WHERE id_ticket = ?",[id_ticket])
        if(PathImage[0].length === 0) return {error: "No existe ticket"}
        return {ImagePath: PathImage[0][0].image_path}
    }
}