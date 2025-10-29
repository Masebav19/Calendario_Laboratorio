export default function getSessionPos({Mesas}){
    switch (Mesas) {
        case "Mesa1":
            return "1/2"
        case "Mesa2":
            return "2/3"
        case "Mesa3":
            return "3/-1"
        case "Mesa1,Mesa2":
            return "1/3"
        case "Mesa2,Mesa3":
            return "2/-1"
        case "Mesa1,Mesa2,Mesa3":
            return "1/-1"   
        default:
            break;
    }
}