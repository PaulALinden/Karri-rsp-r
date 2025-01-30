import { useState } from "react";
import { Link } from "react-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { sanitizeInput, validateEmail, validatePasswordChecks } from "../utils/validators";
import handleFirebaseAuthError from "../utils/authErrorHandler";
import Alert from "./Alert";
import SuccessModal from "./SuccesRegisterModal";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logo from "../assets/logo.svg"
import "../css/start.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
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
    const [isOpen, setIsOpen] = useState(false);
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
                setError("Ogiltig e-postadress");
                setShowErrorBanner(true);
                return;
            }

            if (!termsAccepted) {
                setError("Du måste acceptera villkoren och sekretesspolicyn för att registrera dig.");
                setShowErrorBanner(true);
                return;
            }

            if (areAllPasswordValidationsTrue()) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userId = user.uid;

                if (!userId) {
                    throw new Error("Användar-ID saknas!");
                }

                await sendEmailVerification(user);
                // Verifiera om användaren är skapad och har UID
                console.log("User ID:", userId);
                console.log("Email verification sent.");

                const userCollectionPath = `/users/${userId}/terms`;
                const userCollectionRef = collection(db, userCollectionPath);


                const terms = {
                    termsAccepted: true,
                    acceptedAt: new Date().toISOString(),
                };

                // Vänta på att dokumentet ska läggas till innan vi går vidare
                await addDoc(userCollectionRef, terms);

                console.log("Terms document created successfully!");
                setIsOpen(true);
            }
        } catch (err) {
            console.log(err);
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

                            <div className="check-box-container">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    required
                                />
                                <label> 
                                    I accept the{" "}
                                    <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                                        Terms and Conditions
                                    </a>{" "}
                                    and{" "}
                                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                        Privacy Policy
                                    </a>.

                                </label>
                            </div>


                        </div>
                        <button className={areAllPasswordValidationsTrue() ? "submitbutton" : "disabled-button"} type="submit">Register{!areAllPasswordValidationsTrue()}</button>
                    </form>
                    <p>
                        Har du redan ett konto? <Link to="/login">Login here</Link>
                    </p>
                </div>

                <SuccessModal isOpen={isOpen} setIsOpen={setIsOpen}></SuccessModal>
            </div>
        </div>
    );
};

export default Register;
