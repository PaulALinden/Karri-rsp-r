import { useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import DeleteAccountModal from "./DeleteAccountModal";
import Hamburger from 'hamburger-react'
import { Link } from "react-router";

const Header = ({ showFull = true }) => { // showFull defaults till true om ingen prop skickas
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
        <>
            <header className="header">
                <img src={logo} alt="logo" className="logo" />

                <div className="hamburger">
                    <Hamburger
                        toggled={menuOpen}
                        toggle={setMenuOpen}
                        className="hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                </div>

                <DeleteAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </header>

            {menuOpen && (
                <nav>
                    {showFull ? (
                        <>
                            <div className="menu-group1">
                                <Link to={"/privacy-policy"}>Policy</Link>
                                <Link to={"/terms-and-conditions"}>Användarvilkor</Link>
                                <Link onClick={() => setIsModalOpen(true)} className="menu-btn">Ta bort konto</Link>
                            </div>
                            <div className="menu-group2">
                                <button onClick={handleSignOut} className="menu-btn sign-out">Logga ut</button>
                            </div>
                        </>
                    ) : (
                        <div className="menu-group1">
                            <Link to={"/privacy-policy"}>Policy</Link>
                            <Link to={"/terms-and-conditions"}>Användarvilkor</Link>
                        </div>
                    )}
                </nav>
            )}
        </>
    );
};

export default Header;
