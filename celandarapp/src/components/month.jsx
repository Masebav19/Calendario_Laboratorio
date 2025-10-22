import { useEffect, useState } from "react"

export default function Month ({}){
    

    
    return(
        <>
        {
            CalendarDaysInfo &&
            CalendarDaysInfo.map(dayInfo =>{
                return(
                    <div className="dayInfoContainer">

                    </div>
                )
            })
        }
        </>
    )
}