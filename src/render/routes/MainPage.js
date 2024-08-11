
import React from 'react'
import { useNavigate } from 'react-router-dom';

// Import components //
import Header from '../components/Header'
import Button from '../components/Button';

const MainPage = () => {
  
  const navigate = useNavigate();

  const onLogin = () => {
    navigate("/")
  }

  const onWarning = () => {
    // Send the credentials to the back //
    window.electronAPI.openWarinig("On Warning...");
    // navigate("/warning-page")
  }

  return (
    <div className='container'>
        <Header title="Main Window" />
        <Button color="black" text="Return Login" onClick={onLogin}/>
        <Button color="red" text="Warning" onClick={onWarning}/>
    </div>
  )
}

export default MainPage

