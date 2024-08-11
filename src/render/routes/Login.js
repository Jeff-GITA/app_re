
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

import Header from "../components/Header";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();


    const onSubmit = (e) => {
        e.preventDefault();

        console.log("User Credentials:")
        console.log(username, password)

        // Send the credentials to the back //
        window.electronAPI.login({ username, password });

        setUsername("")
        setPassword("")
    }

    window.electronAPI.onLoginError((event, message) => {
        document.getElementById('error_msg').textContent = message;

    });

    window.electronAPI.correctLogin((event, message) => {
        console.log("Correct Login:", message);
        // Change from login to main page //
        navigate('/main-page');
    });

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
                    <input type="password" placeholder="Type a password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div>
                    {/* <label className='warning-message' id="error_msg"/> */}
                    <label className='warning-message' id="error_msg"> </label>
                </div>
                <div>
                    <input className="btn btn-block" type="submit" value="Login" />
                </div>



            </form>
        </div>
    )
}

export default Login