import { useState } from "react";
import { Link } from "react-router"; // Ändrade till react-router-dom
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { sanitizeInput, validateEmail, validatePasswordChecks } from "../utils/validators";
import handleFirebaseAuthError from "../utils/authErrorHandler";
import Alert from "./Alert";
import SuccessModal from "./modals/SuccesRegisterModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.svg";
import "../css/start.css";
import { useLanguage } from "./context/LanguageContext"; // Importera språk-kontexten
import registerTranslations from "../utils/language/register.json"; // Importera översättningar
import LanguageDropdown from "./LanguageDropdown";
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
    const { language } = useLanguage();
    const t = registerTranslations[language].register; // Hämta översättningar

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
        setError("");
        setShowErrorBanner(false);
        try {
            if (!validateEmail(email)) {
                setError(t.invalidEmailError);
                setShowErrorBanner(true);
                return;
            }

            if (!termsAccepted) {
                setError(t.termsNotAcceptedError);
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
                console.log("User ID:", userId);
                console.log("Email verification sent.");

                const userCollectionPath = `/users/${userId}/terms`;
                const userCollectionRef = collection(db, userCollectionPath);

                const terms = {
                    termsAccepted: true,
                    acceptedAt: new Date().toISOString(),
                };

                await addDoc(userCollectionRef, terms);
                console.log("Terms document created successfully!");
                setIsOpen(true);
            }
        } catch (err) {
            console.log(err);
            const message = handleFirebaseAuthError(err);
            setError(message);
            setShowErrorBanner(true);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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
                    <form onSubmit={handleRegister}>
                        <div className="inputcontainer">
                            <label>{t.emailLabel}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                                required
                            />
                        </div>
                        <div className="inputcontainer">
                            <label>{t.passwordLabel}</label>
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(sanitizeInput(e.target.value));
                                    validatePasswordChecks(sanitizeInput(e.target.value), setPasswordValidations);
                                }}
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

                            <div className="password-requirements">
                                <p>{t.passwordRequirements}</p>
                                <ul>
                                    <li className={passwordValidations.length ? "valid" : "invalid"}>
                                        {t.passwordValidations.length}
                                    </li>
                                    <li className={passwordValidations.lowercase ? "valid" : "invalid"}>
                                        {t.passwordValidations.lowercase}
                                    </li>
                                    <li className={passwordValidations.uppercase ? "valid" : "invalid"}>
                                        {t.passwordValidations.uppercase}
                                    </li>
                                    <li className={passwordValidations.number ? "valid" : "invalid"}>
                                        {t.passwordValidations.number}
                                    </li>
                                    <li className={passwordValidations.special ? "valid" : "invalid"}>
                                        {t.passwordValidations.special}
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
                                    {t.termsLabel}{" "}
                                    <Link to="/terms-and-conditions">
                                        {t.termsLink}
                                    </Link>{" "}
                                    {language === "en" ? "and" : "och"}{" "}
                                    <Link to="/privacy-policy">
                                        {t.privacyLink}
                                    </Link>.
                                </label>
                            </div>
                        </div>
                        <button
                            className={areAllPasswordValidationsTrue() ? "submitbutton" : "disabled-button"}
                            type="submit"
                        >
                            {t.submitButton}
                        </button>
                    </form>
                    <p>
                        {t.alreadyHaveAccount} <Link to="/login">{t.loginLink}</Link>
                    </p>
                </div>

                <SuccessModal isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    );
};

export default Register;
