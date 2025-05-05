import { useState } from "react";
import { getAuth, applyActionCode, signOut } from "firebase/auth";
import Header from "../Header";
import verifyEmailTranslations from "../../utils/language/verify-email.json";
import { useLanguage } from "../context/LanguageContext";

const VerifyEmail = ({ oobCode }) => {
    const auth = getAuth();
    const [message, setMessage] = useState("");
    const { language } = useLanguage();
    const t = verifyEmailTranslations[language].verifyEmail;

    const handleVerifyEmail = async () => {
        try {
            await applyActionCode(auth, oobCode);
            setMessage(t.successMessage);
        } catch (error) {
            setMessage(t.errorMessage);
        } finally {
            signOut(auth);
        }
    };

    return (
        <>
            <Header></Header>
            <div>
                {oobCode ? (
                    <>
                        {!message && <button onClick={handleVerifyEmail}>{t.verifyButton}</button>}
                        {message && <p>{message}<a href="/"> {t.backToStart}</a></p>}
                    </>
                ) : (
                    <p>{t.invalidLinkError} <a href="/">{t.backToStart}</a></p>
                )}
            </div>
        </>
    );
};

export default VerifyEmail;
