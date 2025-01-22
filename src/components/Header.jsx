import logo from "../assets/logo.svg"
import { useAuth } from "./AuthContext";

const Header = () => {
     const { handleSignOut } = useAuth(); // Säkerställ att denna hook alltid ligger högst upp
    
    return (
        <header>
            <img src={logo} alt="logo" />
            <button onClick={handleSignOut} id="signout">Logga ut</button>
        </header>
    );
};

export default Header;