import { useState, useEffect } from "react";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useSearchParams } from "react-router";
import { sanitizeInput, validatePasswordChecks } from "../utils/validators";
import "../css/reset-password.css";

const ResetPassword = () => {
    const auth = getAuth();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [email, setEmail] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });
    const oobCode = searchParams.get("oobCode");

    useEffect(() => {
        if (oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => setEmail(email))
                .catch(() => { setError("Ogiltig eller föråldrad återställningslänk."); });
        }

    }, [oobCode]);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return regex.test(password);
    };

    const handleResetPassword = () => {
        if (!validatePassword(newPassword)) {
            setError("Lösenordet måste vara minst 12 tecken långt och innehålla versaler, gemener, siffror och specialtecken.");
            return;
        }

        confirmPasswordReset(auth, oobCode, newPassword)
            .then(() => setSuccess("Lösenordet har återställts!"))
            .catch(() => setError("Misslyckades med att återställa lösenordet."));
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
            {oobCode ? (
                <>
                    <h2>Återställ lösenord</h2>

                    {error && <p className="error-message">{error}</p>}

                    {success ? (
                        <p className="success-message">{success}</p>
                    ) : (
                        <form className="password-reset-form">
                            <p>{email}</p>

                            <input
                                type="password"
                                placeholder="Nytt lösenord"
                                value={newPassword}
                                onChange={(e) => {
                                    const sanitizedValue = sanitizeInput(e.target.value);
                                    setNewPassword(sanitizedValue);
                                    validatePasswordChecks(sanitizedValue, setPasswordValidations);
                                }}
                            />

                            <div className="password-requirements">
                                <p>Lösenordet måste uppfylla följande krav:</p>
                                <ul>
                                    <li className={passwordValidations.length ? "valid" : "invalid"}>
                                        Minst 12 tecken långt
                                    </li>
                                    <li className={passwordValidations.lowercase ? "valid" : "invalid"}>
                                        Minst en liten bokstav (a-z)
                                    </li>
                                    <li className={passwordValidations.uppercase ? "valid" : "invalid"}>
                                        Minst en stor bokstav (A-Z)
                                    </li>
                                    <li className={passwordValidations.number ? "valid" : "invalid"}>
                                        Minst en siffra (0-9)
                                    </li>
                                    <li className={passwordValidations.special ? "valid" : "invalid"}>
                                        Minst ett specialtecken (!, @, #, $, %, &, etc.)
                                    </li>
                                </ul>
                            </div>

                            <button
                                className={areAllPasswordValidationsTrue() ? "submit-button" : "disabled-button"}
                                onClick={handleResetPassword}
                                disabled={!areAllPasswordValidationsTrue()}
                            >
                                Återställ lösenord
                            </button>
                        </form>
                    )}
                </>
            ): <p>Något gick fel. <a href="/">Till start.</a></p>}
        </div>
    );
};

export default ResetPassword;
