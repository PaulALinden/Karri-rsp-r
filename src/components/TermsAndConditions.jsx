import "../css/policy-and-terms.css";
import Header from "./Header";
import { useNavigate } from "react-router";

import { useLanguage } from "./context/LanguageContext";
import translations from "../utils/language/terms-and-condition.json"

const TermsAndConditions = (() => {

    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language].termsAndConditions;

    const handleGoBack = () => {
        navigate(-1); // Går tillbaka en sida i historiken
    };

    return (
        <div className="article">
            <Header />

            <div className="main-section">
                <h1>{t.title}</h1>
                <p>
                    <strong>{t.effectiveDate}</strong> 2025-01-25
                </p>

                <p>
                    {t.welcome.before}
                    <strong>{t.welcome.highlight}</strong>
                    {t.welcome.after}
                </p>

                <h2>{t.purposeTitle}</h2>
                <p>{t.purposeText}</p>

                <h2>{t.acceptableUseTitle}</h2>
                <p>{t.acceptableUseText}</p>
                <ul>
                    {t.acceptableUseItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <h2>{t.disclaimerTitle}</h2>
                <p>{t.disclaimerText1}</p>
                <p>{t.disclaimerText2}</p>
                <p>{t.disclaimerText3}</p>

                <h2>{t.terminationTitle}</h2>
                <p>{t.terminationText1}</p>
                <p>{t.terminationText2}</p>

                <h2>{t.feesTitle}</h2>
                <p>{t.feesText}</p>

                <h2>{t.contactTitle}</h2>
                <p>{t.contactText}<strong>{t.contactMail}</strong></p>

                <p className="note">
                    <em>{t.note}</em>
                </p>
            </div>

            <button onClick={handleGoBack} className="back-button">
                {t.backButton}
            </button>
        </div>
    );
});

export default TermsAndConditions;