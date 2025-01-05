import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";

const Login = () => {
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    useEffect(() => {
        console.log("login useEffect")
        if (user) {
            navigate("/home");
        }
    }, [user,loading])
    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Successfully logged in!");
        } catch (err) {
            //Lägg till error logik
            setError(err.message);
        }
    };

    return (
        <div className="startform">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="inputcontainer">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="inputcontainer">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="submitbutton" type="submit">Login</button>
            </form>

            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p> 

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
