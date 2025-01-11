import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

import { sanitizeInput, validateEmail, validatePassword } from "../utils/validators";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    /*
        kanske onödigt med dubble check!!!!!!
    */
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            
            if (password.length < 12) {
                throw new Error("Password must be at least 12 characters long.");
            }

            if (!validateEmail(email)) {
                throw new Error("Ogiltig email-adress.");
            }

            if (!validatePassword(password)) {
                throw new Error("Ogiltig Lösenord.");
            }

            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            navigate("/login");
        } catch (err) {
                setError(err.message); 
                console.log(err.message)
           
        }
    };

    // Funktion för att validera lösenordet mot kraven
    const validatePasswordChecks = (password) => {
        setPasswordValidations({
            length: password.length >= 12,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[\W_]/.test(password),
        });
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
                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                        required
                    />
                </div>
                <div className="inputcontainer">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(sanitizeInput(e.target.value));
                            validatePasswordChecks(e.target.value);
                        }
                        }
                        required
                    />
                    
                    <div style={{ marginTop: '10px' }}>
                        <p><strong>Lösenordet måste uppfylla följande krav:</strong></p>
                        <ul>
                            <li style={{ color: passwordValidations.length ? 'green' : 'red' }}>
                                {passwordValidations.length ? '✔' : '❌'} Minst 12 tecken långt
                            </li>
                            <li style={{ color: passwordValidations.lowercase ? 'green' : 'red' }}>
                                {passwordValidations.lowercase ? '✔' : '❌'} Minst en liten bokstav (a-z)
                            </li>
                            <li style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>
                                {passwordValidations.uppercase ? '✔' : '❌'} Minst en stor bokstav (A-Z)
                            </li>
                            <li style={{ color: passwordValidations.number ? 'green' : 'red' }}>
                                {passwordValidations.number ? '✔' : '❌'} Minst en siffra (0-9)
                            </li>
                            <li style={{ color: passwordValidations.special ? 'green' : 'red' }}>
                                {passwordValidations.special ? '✔' : '❌'} Minst ett specialtecken (t.ex. !, @, #, $, %, &amp;, etc.)
                            </li>
                        </ul>
                    </div>

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
