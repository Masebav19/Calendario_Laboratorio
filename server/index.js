import express from "express"
import cors from "cors"
import { router } from "./routes/calendar.js"
const server = express()

server.use(cors())
server.use(express.json())

server.use('/calendar', router)

server.listen(process.env.PORT || 4000,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT || 4000}`)
})