import InfoCard from "./InfoCard"
import './InfoSessionPanel.css'
const COLOR = ["#262532","#353446","#3a3a52","#444361","#535277","#262532","#353446","#3a3a52","#444361","#535277"]
export default function InfoSessionPanel ({SessionSelected}){
    return(
        <div className="InfoPanel">
            {SessionSelected&&
            SessionSelected.map((session, index) =>{
                return(
                    <InfoCard
                        session={session}
                        Color = {COLOR[index]}
                        key={index}
                    />
                )
            })}
        </div>
    )
}