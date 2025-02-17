import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getAuth, applyActionCode } from "firebase/auth";

const VerifyEmail = () => {
    const auth = getAuth();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get("oobCode");
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
            <h2>Verifiera e-post</h2>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
