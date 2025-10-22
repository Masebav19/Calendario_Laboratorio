import z from "zod"

const UserSignUp = z.object({
    Nombre: z.string().min(2).max(200),
    Apellido: z.string().min(2).max(200),
    Correo: z.string().endsWith('@epn.edu.ec',{message: "Debe ser un correo institucional"}),
    Tipo: z.string(),
    Password: z.string().min(6,{message: "La contraseña debe tener al menos 6 caracteres"})
})

const UserLogin = z.object({
    Correo: z.string().endsWith('@epn.edu.ec',{message: "Debe ser un correo institucional"}),
    Password: z.string().min(6,{message: "La contraseña debe tener al menos 6 caracteres"})
})

export function validateUserSignUp(object){
    return UserSignUp.safeParse(object)
}

export function validateUserLogIn(object){
    return UserLogin.safeParse(object)  
}
