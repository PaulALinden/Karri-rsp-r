import { useSearchParams } from "react-router";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

const AuthActionHandler = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");

    return (
        <div className="auth-container">
            {mode === "resetPassword" && <ResetPassword />}
            {mode === "verifyEmail" && <VerifyEmail />}
            {!mode && <p>Ogiltig länk.</p>}
        </div>
    );
};

export default AuthActionHandler;
