
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

import Header from "../components/Header";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();


    const onSubmit = (e) => {
        e.preventDefault();

        // if (!username) {
        //     alert("Please type your username.")
        //     setUsername("")
        //     setPassword("")
        //     return
        // }

        // getUser({ username, password })
        
        console.log("User Credentials:")
        console.log(username, password)

        // Send the credentials to the back //
        window.electronAPI.login({ username, password });

        // Change from login to main page //
        navigate('/main-page');

        setUsername("")
        setPassword("")
    }

   
    return (

        <div className="container">
            
            <Header title="Login" />

            <form className="add-form" onSubmit={onSubmit}>
                <div className="form-control">
                    <label>Username</label>
                    <input type="text" placeholder="Type a username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>

                <div className="form-control">
                    <label>Password</label>
                    <input type="text" placeholder="Type a password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <input className="btn btn-block" type="submit" value="Login" />
            </form>
        </div>
    )
}

export default Login
