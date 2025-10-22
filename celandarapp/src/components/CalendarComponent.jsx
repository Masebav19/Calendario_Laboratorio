import { useState, useEffect } from "react"
import RequestsManager from "../utils/RequetsManager.js"
import DayInfo from "./DayInfo.jsx"
import { DAYSNAMES, MONTHNAMES } from "../utils/constants.js"
import './CalendarComponent.css'

export default function CalendarConatiner ({CalendarType, SetSessionSelected, SetLog, User, SetUser}){
    const [CalendarDaysInfo, SetCalendarDaysInfo] = useState(undefined)
    useEffect(()=>{
        const now = new Date()
        const month = now.getMonth()+1
        const year = now.getFullYear()
        const URL = CalendarType === 'month'?`getDaysbyMonth/${month}/${year}`:
        `getDaysbyWeek/${month}/${year}/${now.getDate()}`
        RequestsManager({URL}).then(result=>{
            SetCalendarDaysInfo(result)
        })
    },[CalendarType])

    async function changeDateCalendar(Type){
        if(Type === 'Hoy'){
            const now = new Date()
            const month = now.getMonth()+1
            const year = now.getFullYear()
            const URL = CalendarType === 'month'?`getDaysbyMonth/${month}/${year}`:
            `getDaysbyWeek/${month}/${year}/${now.getDate()}`
            RequestsManager({URL}).then(result=>{
                SetCalendarDaysInfo(result)
            }) 
        }else if(Type === "Previous"){
            const now = CalendarType === 'month'? new Date(CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Year,
        CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Month-1):
        new Date(CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Year,
        CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Month,CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Date-7)
            const month = now.getMonth()+1
            const year = now.getFullYear()
            const URL = CalendarType === 'month'?`getDaysbyMonth/${month}/${year}`:
            `getDaysbyWeek/${month}/${year}/${now.getDate()}`
            RequestsManager({URL}).then(result=>{
                SetCalendarDaysInfo(result)
            })
        }else{
            const now = CalendarType === 'month'? new Date(CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Year,
        CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Month+1):
        new Date(CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Year,
        CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Month,CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Date+7)
            const month = now.getMonth()+1
            const year = now.getFullYear()
            const URL = CalendarType === 'month'?`getDaysbyMonth/${month}/${year}`:
            `getDaysbyWeek/${month}/${year}/${now.getDate()}`
            RequestsManager({URL}).then(result=>{
                SetCalendarDaysInfo(result)
            })
        }
    }
    return( 
        <>
        <div className="CalendarNavigation">
            <span onClick={()=>changeDateCalendar('Hoy')}>Hoy</span>
            <nav onClick={()=>changeDateCalendar('Previous')}><img src="../public/leftArrow.svg" alt="previus" /></nav>   
            <nav onClick={()=>changeDateCalendar('Next')}><img src="../public/rigthArrow.svg" alt="next" /></nav>
            {CalendarDaysInfo&&
            <span>{CalendarType === 'month'? `${CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Year}, ${MONTHNAMES[CalendarDaysInfo[Math.round(CalendarDaysInfo.length/2)].Month]}`
            :`${CalendarDaysInfo[0].Year}, ${MONTHNAMES[CalendarDaysInfo[0].Month]} ${CalendarDaysInfo[0].Date}-${CalendarDaysInfo[CalendarDaysInfo.length-1].Date}`}</span> }  
        </div>
        <div className={`Calendar ${CalendarType}`}>
            { CalendarType === 'week' && 
                <div className="CalendarWeekdivisions">
                    <span></span>
                        {Array.from({length: 17}, (v,i)=>i).map(i =>{
                            return(
                                <span style={{gridRow: `${i === 0 ? i+2:i*4+2}/${i=== 0? i+6: i*4+6}`}} key={i}>{i+5}</span>
                            )
                        })}
                </div>
            }
            <div className="CalendarBody">
                {
                    DAYSNAMES.map(dayname =>{
                        return(
                            <span className="CalendarDay" key={dayname}>{dayname}</span>
                        )
                    })
                }
                {
                    CalendarDaysInfo &&
                    CalendarDaysInfo.map((dayInfo,index) =>{
                        return(
                            <DayInfo
                                dayInfo={dayInfo}
                                CalendarType={CalendarType}
                                SetSessionSelected= {SetSessionSelected}
                                SetLog = {SetLog}
                                User = {User}
                                SetUser = {SetUser}
                                key={index}
                            />
                        )
                    })
                }
            </div>

        </div>
        </>
    )
}