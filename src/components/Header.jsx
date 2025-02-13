import { useState } from 'react';
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import DeleteAccountModal from "./DeleteAccountModal";

const Header = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <button onClick={()=> setIsModalOpen(true)} id="delete-acc">Ta bort konto</button>

            <DeleteAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </header>
    );
};

export default Header;