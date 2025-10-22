export default async function RequestsManager ({URL, METHOD = "GET", BODY}){
    if(METHOD === 'GET'){
        const response = await fetch(`http://localhost:4000/calendar/${URL}`)
        const data = await response.json()
        return data
    }else{
        const response = await fetch(`http://localhost:4000/calendar/${URL}`, {
            method: METHOD,
            headers: { 'Content-Type': 'application/json' },
            body: BODY
        })
        const data = await response.json()
        return data
    }
}