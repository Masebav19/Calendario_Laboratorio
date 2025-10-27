import {getDaysbyMonth, getDaysbyWeek, NewSession,
    DeleteSession, SignUp, LogIn, DeleteUser, OpenTicket, CloseTicket, ReadNewTickets, ReadClosedTickets, GetImageTicket } from "../util/calendar.js"
import { validateSessionData, validateDeleteSessionData } from "../Schema/sesionSchema.js"
import { validateUserSignUp, validateUserLogIn } from "../Schema/UserSchema.js"
import path from "path"

export default class Calendar{
    static async getDaysbyMonth(req,res){
        const { month, year } = req.params
        const daysofMonth = await getDaysbyMonth({month,year})
        res.json(daysofMonth)
    }
    static async getDaysbyWeek(req,res){
        const { month, year, date } = req.params
        const daysofWeek = await getDaysbyWeek({month,year,date})
        res.json(daysofWeek)
    }
    static async NewSession(req,res){
        const validationResult = validateSessionData(req.body)
        if(validationResult.error) return res.json({error: JSON.parse(validationResult.error.message)}).status(400)
        const { Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio, Mesas } = validationResult.data
        const result = await NewSession({Asunto, Hora_inicial, Hora_final, Periodicidad, Responsable, Correo_responsable, fecha_inicio, Mesas})
        res.json({success: result})
    }
    static async DeleteSession(req,res){
        const ValidateResult = validateDeleteSessionData(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Asunto, Hora_inicial, Correo } = ValidateResult.data
        const result = await DeleteSession({Asunto, Hora_inicial, Correo})
        if(result?.error) return res.json({error: result.error})
        res.json({success: result})
    }

    static async SignUp(req,res){
        const ValidateResult = validateUserSignUp(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Nombre, Apellido, Correo, Tipo, Password } = ValidateResult.data
        const result = await SignUp({Nombre, Apellido, Correo, Tipo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})
    }
    static async LogIn(req,res){
        const ValidateResult = validateUserLogIn(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Correo, Password } = ValidateResult.data
        const result = await LogIn({Correo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json(result)
    }
    static async DeleteUser(req,res){
        const ValidateResult = validateUserLogIn(req.body)
        if(ValidateResult.error) return res.json({error: JSON.parse(ValidateResult.error.message)}).status(400)
        const { Correo, Password } = ValidateResult.data
        const result = await DeleteUser({Correo, Password})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})

    }
    static async OpenTicket(req,res){
        const { Correo, Asunto, Fecha } = req.body
        const result = await OpenTicket({Correo, Asunto, Fecha})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})
    }
    static async CloseTicket(req,res){
        const {observaciones, equipos_usados, id_ticket}= req.body
        const imagePath = req?.file?.path
        const result = await CloseTicket({observaciones, equipos_usados, id_ticket, imagePath})
        if(result?.error) return res.json({error: result.error}).status(400)
        res.json({result: result?.result})
    }
    static async ReadNewTickets(req,res){
        const result = await ReadNewTickets() 
        res.json(result)
    }
    static async ReadClosedTickets(req,res){
        const result = await ReadClosedTickets()
        res.json(result)
    }
    static async GetImageTicket(req,res){
        const { id_ticket } = req.params
        const Path = await GetImageTicket({id_ticket})
        if(Path?.error) return res.json(Path)
        const ImagePath = path.join(process.cwd(),Path.ImagePath)
        res.sendFile(ImagePath)
    }
}