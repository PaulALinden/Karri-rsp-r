import { useEffect, useState } from "react";
import { getAuth, applyActionCode } from "firebase/auth";

const VerifyEmail = (oobCode) => {
    const auth = getAuth();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (oobCode) {
            applyActionCode(auth, oobCode)
                .then(() => setMessage("E-postadressen har verifierats!"))
                .catch(() => setMessage("Misslyckades med att verifiera e-postadressen."));
        }
    }, [oobCode]);

    return (
        <div>
            {oobCode ? (
                <>
                    <h2>Verifiera e-post</h2>
                    <p>{message}<a href="/"> Till start.</a></p>
                </>
            ) : (
                <p>Något gick fel. <a href="/">Till start.</a></p>
            )}
        </div>
    );
};

export default VerifyEmail;
