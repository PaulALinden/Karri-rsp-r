import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./context/LanguageContext";
import ReactCountryFlag from "react-country-flag";

const LanguageDropdown = () => {
    const { language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const languageOptions = [
        { code: "en", label: "en", flag: "GB" },
        { code: "sv", label: "sv", flag: "SE" },
    ];

    const currentLang = languageOptions.find(opt => opt.code === language);

    return (
        <>
            <div className="language-options">
                {languageOptions.map(opt => (

                    <ReactCountryFlag
                        key={opt.code}
                        onClick={() => {
                            toggleLanguage(opt.code);
                            setIsOpen(false);
                        }}
                        className="language-option"

                        countryCode={opt.flag}
                        svg
                        style={{ width: '30px', height: '30px' }}
                    />

                ))}
            </div>
        </>
    );
};

export default LanguageDropdown;
