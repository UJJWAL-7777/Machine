import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-route-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPssword] = useState("");

    const navigate = useNavigate();
    
    const handleLogin = async () => {
        try{
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        }
        catch(error){
            alert(error.response.data.message);
        }
    };


    return (
        <div>
            <h1>Login</h1>
            <input placeholder="Email" onChange={(e) => setEmail(e.email.value)}/>
            <input placeholder="Password" type="password" onChange={(e) => setPssword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>
    );

}

export default Login;