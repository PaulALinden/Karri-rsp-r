import { useState } from "react";
import { Link } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import Alert from "./Alert";
import PasswordResetModal from "./modals/PasswordResetModal";
import handleFirebaseAuthError from "../utils/authErrorHandler";
import { sanitizeInput } from "../utils/validators";
import logo from "../assets/logo.svg";
import "../css/start.css";
import { useLanguage } from "./context/LanguageContext"; // Importera språk-kontexten
import loginTranslations from "../utils/language/login.json"; // Importera översättningar
import LanguageDropdown from "./LanguageDropdown"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { language } = useLanguage();
    const t = loginTranslations[language].login; // Hämta översättningar

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setShowErrorBanner(false);
            const loginUser = await signInWithEmailAndPassword(auth, email, password);

            if (!loginUser.user.emailVerified) {
                await sendEmailVerification(loginUser.user);
                const error = new Error(t.emailVerificationError);
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
        setIsModalOpen(false);
        setError("");
    };

    return (
        <div className="start-page">

            <LanguageDropdown />

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
                    <h1>{t.title}</h1>
                    <form onSubmit={handleLogin}>
                        <div className="inputcontainer">
                            <label>{t.emailLabel}</label>
                            <input
                                type="email"
                                placeholder={t.emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                                required
                            />
                        </div>
                        <div className="inputcontainer">
                            <label>{t.passwordLabel}</label>
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder={t.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                                required
                            />
                            <span className="eyeContainer">
                                {isPasswordVisible ? (
                                    <FaEyeSlash
                                        className="eyeIconClosed"
                                        onClick={togglePasswordVisibility}
                                    />
                                ) : (
                                    <FaEye
                                        className="eyeIconOpen"
                                        onClick={togglePasswordVisibility}
                                    />
                                )}
                            </span>
                            <Link onClick={() => setIsModalOpen(true)}>{t.forgotPassword}</Link>
                        </div>
                        <button className="submitbutton" type="submit">
                            {t.submitButton}
                        </button>
                    </form>
                    <p>
                        {t.noAccount} <Link to="/register">{t.createAccountLink}</Link>
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
        </div>
    );
};

export default Login;