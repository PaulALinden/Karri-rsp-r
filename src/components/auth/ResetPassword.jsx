import { useState, useEffect } from "react";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { sanitizeInput, validatePasswordChecks } from "../../utils/validators";
import LanguageDropdown from "../LanguageDropdown"
import registerTranslations from "../../utils/language/register.json";
import { useLanguage } from "../context/LanguageContext";
import "../../css/reset-password.css";

const ResetPassword = ({ oobCode }) => {
    const auth = getAuth();
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });
    const [statusMessage, setStatusMessage] = useState("");
    const { language } = useLanguage();
    const t = registerTranslations[language].resetPassword;
    const tRegister = registerTranslations[language].register;

    useEffect(() => {

        if (oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => setEmail(email))
                .catch(() => {
                    setStatusMessage(t.invalidLinkError);
                });
        }
    }, [oobCode]);

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!areAllPasswordValidationsTrue()) {
            setStatusMessage(t.passwordValidationError);
            return;
        }

        confirmPasswordReset(auth, oobCode, newPassword)
            .then(() => setStatusMessage(t.successMessage))
            .catch(() => setStatusMessage(t.failureMessage));
    };

    const areAllPasswordValidationsTrue = () => {
        return (
            passwordValidations.length &&
            passwordValidations.lowercase &&
            passwordValidations.uppercase &&
            passwordValidations.number &&
            passwordValidations.special
        );
    };

    return (
        <div className="container">
            <LanguageDropdown />
            {oobCode && !statusMessage ? (
                <>
                    <h2>{t.title}</h2>
                    <form className="password-reset-form">
                        <p>{email}</p>

                        <input
                            type="password"
                            placeholder={t.newPasswordPlaceholder}
                            value={newPassword}
                            onChange={(e) => {
                                const sanitizedValue = sanitizeInput(e.target.value);
                                setNewPassword(sanitizedValue);
                                validatePasswordChecks(sanitizedValue, setPasswordValidations);
                            }}
                        />

                        <div className="password-requirements">
                            <p>{t.passwordRequirements}</p>
                            <ul>
                                <li className={passwordValidations.length ? "valid" : "invalid"}>
                                    {tRegister.passwordValidations.length}
                                </li>
                                <li className={passwordValidations.lowercase ? "valid" : "invalid"}>
                                    {tRegister.passwordValidations.lowercase}
                                </li>
                                <li className={passwordValidations.uppercase ? "valid" : "invalid"}>
                                    {tRegister.passwordValidations.uppercase}
                                </li>
                                <li className={passwordValidations.number ? "valid" : "invalid"}>
                                    {tRegister.passwordValidations.number}
                                </li>
                                <li className={passwordValidations.special ? "valid" : "invalid"}>
                                    {tRegister.passwordValidations.special}
                                </li>
                            </ul>
                        </div>

                        <button
                            className={areAllPasswordValidationsTrue() ? "submit-button" : "disabled-button"}
                            onClick={(e) => { handleResetPassword(e) }}
                            disabled={!areAllPasswordValidationsTrue()}
                        >
                            {t.submitButton}
                        </button>
                    </form>
                </>
            ) : <p>{statusMessage} <a href="/">{t.backToStart}</a></p>}
        </div>
    );
};

export default ResetPassword;
