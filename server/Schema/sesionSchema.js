import z from "zod"

const SessionSchema = z.object({
    Asunto: z.string({required_error: "Debe contener el asunto de la sesión"}),
    Hora_inicial: z.string().includes(':').max(6,{message: "Colocar en el formato correcto"}),
    Hora_final : z.string().includes(':').max(6,{message: "Colocar en el formato correcto"}),
    Periodicidad: z.string().default("Ninguno"),
    Responsable: z.string(),
    Correo_responsable: z.string().endsWith('@epn.edu.ec',{message: "Debe ser un correo institucional"}),
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Colocar en el formato correcto"})
})

const DeleteSessionSchema = z.object({
    Asunto: z.string({required_error: "Debe contener el asunto de la sesión"}),
    Hora_inicial: z.string().includes(':').max(6,{message: "Colocar en el formato correcto"}),
    Correo: z.string().endsWith('@epn.edu.ec',{message: "Debe ser un correo institucional"}),
})

function validateSessionData (object){
    return SessionSchema.safeParse(object)
}

function validateDeleteSessionData(object){
    return DeleteSessionSchema.safeParse(object)
}

export { validateSessionData, validateDeleteSessionData }