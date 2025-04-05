import { useState } from "react";
import { useNavigate } from "react-router";
import Hamburger from 'hamburger-react'
import { Link } from "react-router";
//Logo
import logo from "../assets/logo.svg";
import ReactCountryFlag from "react-country-flag"
//Auth
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
//Component
import DeleteAccountModal from "./DeleteAccountModal";
//Context
import { useLanguage } from "./context/LanguageContext";
import { useAuth } from "./auth/AuthContext";
//Language
import translations from "../utils/language/header.json"
import LanguageDropdown from "./LanguageDropdown";

const Header = () => {
    const { user } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].header;
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

    const handleLanguageChange = (event) => {
        toggleLanguage(event.target.value); // Sätt språket till det valda värdet
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

                    <LanguageDropdown />

                    {user ? (
                        <>
                            <div className="menu-group1">
                                <Link to={"/"} onClick={() => setMenuOpen(!menuOpen)}>{t.home}</Link>
                                <Link to={"/privacy-policy"} onClick={() => setMenuOpen(!menuOpen)}>{t.policy}</Link>
                                <Link to={"/terms-and-conditions"} onClick={() => setMenuOpen(!menuOpen)}>{t.terms}</Link>
                                <Link onClick={() => setIsModalOpen(true)} className="menu-btn">{t.deleteAccount}</Link>
                            </div>
                            <div className="menu-group2">
                                <button onClick={handleSignOut} className="menu-btn sign-out">{t.signOut}</button>
                            </div>
                        </>
                    ) : (
                        <div className="menu-group1">
                            <Link to={"/privacy-policy"} onClick={() => setMenuOpen(!menuOpen)}>{t.policy}</Link>
                            <Link to={"/terms-and-conditions"} onClick={() => setMenuOpen(!menuOpen)}>{t.terms}</Link>
                        </div>
                    )}
                </nav>
            )}
        </>
    );
};

export default Header;
