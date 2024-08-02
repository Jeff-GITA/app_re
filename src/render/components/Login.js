
import { useState } from "react"


const Login = ({getUser}) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    

    const onSubmit = (e) => {
        e.preventDefault();
        if (!username) {
            alert("Please type your username.")
            return
        }

        getUser({ username, password})
        setUsername("")
        setPassword("") 
    }

    return (
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
    )
}

export default Login
