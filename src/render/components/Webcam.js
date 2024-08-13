// src/Webcam.js
import React, { useEffect, useRef } from 'react';

function Webcam() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Accede a la cámara web
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Asigna el stream de la cámara al elemento de video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });

    // Limpia el stream de la cámara cuando se desmonte el componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      style={{
        width: '100%',
        maxWidth: '600px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: 'scaleX(-1)', // Aplica el efecto espejo
      }}
    />
  );
}

export default Webcam;
