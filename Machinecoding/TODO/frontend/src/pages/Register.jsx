import { useState } from React;
import axios from "axios";

function Register () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try{
            await axios.post(
                "http://localhost:500/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );
            alert("Register Successfully");
        }
        catch(error){
            alert(error.response.data.message);
        }
    };



    return (
        <div>
            <h1>Register</h1>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)}/>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleRegister}>Register</button>
        </div>
    )


}