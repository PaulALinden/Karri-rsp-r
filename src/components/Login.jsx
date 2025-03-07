import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useAuth } from "./AuthContext";
import Alert from "./Alert";
import PasswordResetModal from "./PasswordResetModal";
import handleFirebaseAuthError from "../utils/authErrorHandler";
import { sanitizeInput } from "../utils/validators";
import logo from "../assets/logo.svg"
import "../css/start.css";


const Login = () => {
    const { user, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user && user.uid && user.emailVerified) {
            navigate("/home");
        }
    }, [user, loading, navigate]);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setShowErrorBanner(false);
            const loginUser = await signInWithEmailAndPassword(auth, email, password);
            
            if (!loginUser.user.emailVerified) {
                await sendEmailVerification(loginUser.user);
                console.log("Verification mail has been sent.")
                const error = new Error('Please verify your email');
                error.code = "auth/email-verification";
                throw error;
            }
        } catch (err) {
            const message = handleFirebaseAuthError(err);
            setError(message);
            setShowErrorBanner(true);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Stäng modalen utan att ta bort något
        setError("");
    };

    return (
        <div className="start-page">
            {loading ?
                <div className="start-left">
                    <img src={logo} alt="" />
                </div> :
                <>
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
                            <h1>LOGGA IN</h1>
                            <form onSubmit={handleLogin}>
                                <div className="inputcontainer">
                                    <label>E-postadress</label>
                                    <input
                                        type="email"
                                        placeholder="Fyll i din e-postadress"
                                        value={email}
                                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="inputcontainer">
                                    <label>Lösenord</label>
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        placeholder="Fyll i ditt lösenord"
                                        value={password}
                                        onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                                        required
                                    />
                                    <span className="eyeContainer">
                                        {isPasswordVisible ? <FaEyeSlash className="eyeIconClosed" onClick={togglePasswordVisibility} /> : <FaEye className="eyeIconOpen" onClick={togglePasswordVisibility} />}
                                    </span>

                                    <Link onClick={() => setIsModalOpen(true)} >Glömt lösenord</Link>

                                </div>
                                <button className="submitbutton" type="submit">Logga in</button>
                            </form>

                            <p>
                                Har du inget konto? <Link to="/register">Skapa konto</Link>
                            </p>
                        </div>
                    </div>

                    <PasswordResetModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        error={error}
                        setError={setError}
                        handleFirebaseAuthError={handleFirebaseAuthError}
                    />
                </>
            }
        </div>
    );
};

export default Login;
