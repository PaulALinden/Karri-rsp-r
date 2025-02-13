import { useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import DeleteAccountModal from "./DeleteAccountModal";

const Header = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className="header">
            <img src={logo} alt="logo" className="logo" />

            {/* Hamburgarikonen */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            {menuOpen ? (
                <nav>
                    <button>Policy</button>
                    <div />
                    <button>Användarvilkor</button>
                    <div />
                    <button onClick={handleSignOut} className="menu-btn">Logga ut</button>
                    <div/>
                    <button onClick={() => setIsModalOpen(true)} className="menu-btn">Ta bort konto</button>
                </nav>
            ) : null}


            <DeleteAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
};

export default Header;
