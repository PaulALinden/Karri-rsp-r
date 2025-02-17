import { useSearchParams } from "react-router";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

const AuthActionHandler = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");
    //const oobCode = searchParams.get("oobCode");
    const oobCode = "adsd"

    return (
        <div className="auth-container">
            {mode === "resetPassword" && <ResetPassword oobCode={oobCode} />}
            {mode === "verifyEmail" && <VerifyEmail oobCode={oobCode} />}

            {!mode && <p>Ogiltig länk. <a href="/">Till start.</a></p>}
        </div>
    );
};

export default AuthActionHandler;

