import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Enforce strong password
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long.");
            }
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            navigate("/login"); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="startform">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                <button className="submitbutton" type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p> 

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Register;
