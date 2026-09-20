import { useState } from "react";

function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async(e)=>{
        e.preventDefault();
        try{
            const response = await fetch(
                "http://localhost:9000/api/auth/register",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );
            const data = await response.json();
            if(!response.ok){
                setMessage(data.message || "Registration failed");
                return;
            }

            setMessage("Registration successful!");
            console.log(data);

        }catch(error){
            console.log("Registration error:", error);
            setMessage("Unable to connect to server");
        }
    };
    return(
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">
                    Register
                </button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default Register;