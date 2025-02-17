import { useState, useEffect } from "react";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { sanitizeInput, validatePasswordChecks } from "../utils/validators";
import "../css/reset-password.css";

const ResetPassword = (oobCode) => {
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
 
    useEffect(() => {
        if (oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => setEmail(email))
                .catch(() => { setStatusMessage("Ogiltig eller föråldrad återställningslänk."); });
        }
    }, [oobCode]);

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!areAllPasswordValidationsTrue()) {
            setStatusMessage("Lösenordet måste vara minst 12 tecken långt och innehålla versaler, gemener, siffror och specialtecken.");
            return;
        }

        confirmPasswordReset(auth, oobCode, newPassword)
            .then(() => setStatusMessage("Lösenordet har återställts!"))
            .catch(() => setStatusMessage("Misslyckades med att återställa lösenordet."));
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
            {oobCode && !statusMessage ? (
                <>
                    <h2>Återställ lösenord</h2>
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
                            onClick={(e) => { handleResetPassword(e) }}
                            disabled={!areAllPasswordValidationsTrue()}
                        >
                            Återställ lösenord
                        </button>
                    </form>
                </>
            ) : <p>{statusMessage} <a href="/">Till start.</a></p>}
        </div>
    );
};

export default ResetPassword;
