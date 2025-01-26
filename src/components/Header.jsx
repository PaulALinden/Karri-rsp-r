import logo from "../assets/logo.svg"
import { useNavigate } from "react-router";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";

const Header = () => {
    const navigate = useNavigate();

   const handleSignOut = async () => {
           try {
               await signOut(auth);
               navigate("/login")
           } catch (error) {
               console.error(error);
           }
       };
    
    return (
        <header>
            <img src={logo} alt="logo" />
            <button onClick={handleSignOut} id="signout">Logga ut</button>
        </header>
    );
};

export default Header;