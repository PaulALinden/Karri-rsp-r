import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { sanitizeInput, validateEmail, validatePasswordChecks } from "../utils/validators";
import handleFirebaseAuthError from "../utils/authErrorHandler";
import Alert from "./Alert";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logo from "../../public/logo.svg"
import "../css/start.css";

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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    const navigate = useNavigate();
    const areAllPasswordValidationsTrue = () => {
        return (
            passwordValidations.length &&
            passwordValidations.lowercase &&
            passwordValidations.uppercase &&
            passwordValidations.number &&
            passwordValidations.special
        );
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setShowErrorBanner(false);

            if (!validateEmail(email)) {
                setError("Ogiltig e-postadress")
                setShowErrorBanner(true);
                return;
            }

            if (areAllPasswordValidationsTrue()) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Account created successfully! Please verify your email before logging in.");
                navigate("/login");
            }
        } catch (err) {
            console.log(err.message)
            const message = handleFirebaseAuthError(err);
            setError(message);

        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="start-page">
            <div className="start-left">
                <img src={logo} alt="" />
            </div>

            <div className="start-right">
                <div className="startform">
                    {showErrorBanner && (
                        <Alert severity="error" onClose={() => setShowErrorBanner(false)}>
                            {error}
                        </Alert>
                    )}
                    <h1>SKAPA KONTO</h1>
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
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(sanitizeInput(e.target.value));
                                    validatePasswordChecks(e.target.value, setPasswordValidations);
                                }
                                }
                                required
                            />

                            <span className="eyeContainer">
                                {isPasswordVisible ? <FaEyeSlash className="eyeIconClosed" onClick={togglePasswordVisibility} /> : <FaEye className="eyeIconOpen" onClick={togglePasswordVisibility} />}
                            </span>

                            <div className="password-requirements">
                                <p>Lösenordet måste uppfylla följande krav:</p>
                                <ul>
                                    <li className={passwordValidations.length ? 'valid' : 'invalid'}>
                                        Minst 12 tecken långt
                                    </li>
                                    <li className={passwordValidations.lowercase ? 'valid' : 'invalid'}>
                                        Minst en liten bokstav (a-z)
                                    </li>
                                    <li className={passwordValidations.uppercase ? 'valid' : 'invalid'}>
                                        Minst en stor bokstav (A-Z)
                                    </li>
                                    <li className={passwordValidations.number ? 'valid' : 'invalid'}>
                                        Minst en siffra (0-9)
                                    </li>
                                    <li className={passwordValidations.special ? 'valid' : 'invalid'}>
                                         Minst ett specialtecken (t.ex. !, @, #, $, %, &, etc.)
                                    </li>
                                </ul>
                            </div>


                        </div>
                        <button className={areAllPasswordValidationsTrue() ? "submitbutton" : "disabled-button"} type="submit">Register{!areAllPasswordValidationsTrue()}</button>
                    </form>
                    <p>
                        Har du redan ett konto? <Link to="/login">Login here</Link>
                    </p>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
};

export default Register;
