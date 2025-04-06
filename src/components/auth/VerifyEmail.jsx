import { useState } from "react";
import { getAuth, applyActionCode, signOut } from "firebase/auth";

const VerifyEmail = ({ oobCode }) => {
    const auth = getAuth();
    const [message, setMessage] = useState("");

    const handleVerifyEmail = async () => {
        try {
            await applyActionCode(auth, oobCode);
            console.log("E-postverifiering lyckades!");
            setMessage("E-postverifiering lyckades!");
        } catch (error) {
            console.error("Fel vid verifiering av e-post:", error);
            setMessage("Fel vid verifiering av e-post.");
        } finally {
            signOut(auth);
        }
    };

    return (
        <div>
            {oobCode ? (
                <>
                    {!message && <button onClick={handleVerifyEmail}>Verifiera e-post</button>}
                    {message && <p>{message}<a href="/"> Till start.</a></p>}
                </>
            ) : (
                <p>Något gick fel. <a href="/">Till start.</a></p>
            )}
        </div>
    );
};

export default VerifyEmail;
