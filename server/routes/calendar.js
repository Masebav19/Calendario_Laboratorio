import { Router } from "express"
import Calendar from "../Controllers/calendar.js"
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage })

export const router = Router()


router.get('/getDaysbyMonth/:month/:year', Calendar.getDaysbyMonth)
router.get('/getDaysbyWeek/:month/:year/:date', Calendar.getDaysbyWeek)


router.post('/LogIn',Calendar.LogIn)
router.post('/SignUp', Calendar.SignUp)
router.delete('/DeleteUser',Calendar.DeleteUser)

router.post('/NewSession', Calendar.NewSession)
router.post('/DeleteSession', Calendar.DeleteSession)

router.post('/OpenTicket', Calendar.OpenTicket)
router.post('/CloseTicket',upload.single('image'), Calendar.CloseTicket)
router.get('/GetNewTickets', Calendar.ReadNewTickets)
router.get('/GetClosedTickets', Calendar.ReadClosedTickets)
router.get('/GetTicketImage/:id_ticket', Calendar.GetImageTicket)