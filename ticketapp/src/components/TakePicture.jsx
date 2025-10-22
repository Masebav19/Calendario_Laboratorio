import { useRef, useState, useEffect } from "react";
import "./TakePicture.css"

export default function TakePicture({ formData, SetPhoto, SetOption }){
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [foto, setFoto] = useState(null);
    const videoHtml = useRef(null)

    useEffect(() => {
        // Solicitar acceso a la cámara
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Error accediendo a la cámara:", err));
    }, []);

    // Capturar la foto desde el video
    const capturarFoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
        setFoto(blob); // guardar la imagen en el estado
        }, "image/jpeg");
        return videoHtml.current.disabled = true
    };

    // Enviar la foto + otros datos al servidor
    const enviar = async () => {
        if (!foto) {
        alert("Primero toma una foto");
        return;
        }

        const NewformData = new FormData();
        NewformData.append("observaciones", `${formData.observaciones}:${formData.MantenimientoType}`);
        NewformData.append("equipos_usados", formData.equipos_usados);
        NewformData.append("id_ticket", formData.id_ticket);
        NewformData.append("image", foto, "image.jpg");
        
        videoRef.current.srcObject = null

        try {
            const result = await fetch('http://localhost:4000/calendar/CloseTicket',{
                method: "POST",
                body: NewformData
            })
            if(result?.error) {
                SetPhoto(false)
                alert('No se pudo cerrar el ticket')
                return SetOption(0)
            }
            alert('Ticket Cerrado')
            SetPhoto(false)
             return SetOption(0)
        } catch (err) {
            alert('Ocurrió un problema al cerrar el ticket')
            SetPhoto(false)
             return SetOption(0)
        }
    }

    return(
        <div className="PhotoConatiner">
            <video ref={videoRef} autoPlay playsInline className="camera" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            
            <button onClick={capturarFoto} ref={videoHtml}>Tomar Foto</button>
            <button onClick={enviar}>Enviar</button>
        </div>
    )
}