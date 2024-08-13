
import React from 'react'
import { useNavigate } from 'react-router-dom';

// Import components //
import Header from '../components/Header'
import Button from '../components/Button';
import Webcam from '../components/Webcam';
import { Box, Typography } from '@mui/material';


const MainPage = () => {


  const startExam = () => {
    window.electronAPI.startExam("Starting Exam...");
  }

  return (
    <div className='container'>
      <Header title="Examen de admisión" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Usted debería estar viendo su camara web...
        </Typography>
        <Webcam />
        <Typography variant="h5" gutterBottom>
          Si todo está en orden presione el siguiente boton para iniciar el examen.
        </Typography>
      </Box>
      
      <Button color={"green"} text={"Iniciar Examen de admisión"} onClick={startExam}/>

    </div>

  );
}

export default MainPage

