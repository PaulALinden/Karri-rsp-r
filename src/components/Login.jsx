import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from 'react-icons/fa';  //

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";

import { sanitizeInput, validateEmail, validatePassword } from "../utils/validators";

const Login = () => {
    const { user, loading } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user,loading])
    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            if (!validateEmail(email)) {
                throw new Error("Ogiltig email-adress.");
            }

            if (!validatePassword(password)) {
                throw new Error("Ogiltig Lösenord.");
            }

            await signInWithEmailAndPassword(auth, email, password);
            alert("Successfully logged in!");
        } catch (err) {
            //Lägg till error logik
            setError(err.message);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                        required
                    />
                </div>
                <div className="inputcontainer">
                    <label>Password:</label>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                        required
                    />
                
                    {isPasswordVisible ? <FaEyeSlash className="eyeIcon" onClick={togglePasswordVisibility} /> : <FaEye className="eyeIcon" onClick={togglePasswordVisibility} />}
                  
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
