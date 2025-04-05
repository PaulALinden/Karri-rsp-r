import "../css/policy-and-terms.css";
import Header from "./Header";
import { useNavigate } from "react-router";
import { useLanguage } from "./context/LanguageContext";
import translations from "../utils/language/policy.json";

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language].privacyPolicy;

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="article">
            <Header />

            <section className="main-section">
                <h1>{t.title}</h1>
                <p>
                    <strong>{t.effectiveDate}</strong> 2025-01-25
                </p>

                <p>
                    {t.welcome.before}
                    <strong>{t.welcome.highlight}</strong>
                    {t.welcome.after}
                </p>

                <h2>{t.infoCollectTitle}</h2>
                <p>{t.infoCollectText}</p>
                <ul>
                    {t.infoCollectItems.map((item, index) => {
                        const [label, text] = item.split(": ");
                        return (
                            <li key={index}>
                                <strong>{label}:</strong> {text}
                            </li>
                        );
                    })}
                </ul>
                <p>{t.noTracking}</p>

                <h2>{t.howWeUseTitle}</h2>
                <p>{t.howWeUseText}</p>
                <ul>
                    {t.howWeUseItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>

                <h2>{t.dataStorageTitle}</h2>
                <p>{t.dataStorageText}</p>

                <h2>{t.userRightsTitle}</h2>
                <p>{t.userRightsText}</p>
                <ul>
                    {t.userRightsItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                <p>
                    {t.userRightsContact}
                    <strong>{t.contactEmail}</strong>
                </p>

                <h2>{t.thirdPartyTitle}</h2>
                <p>{t.thirdPartyText}</p>

                <h2>{t.contactTitle}</h2>
                <p>
                    {t.contactText}
                    <strong>{t.contactEmail}</strong>

                </p>
            </section>

            <button onClick={handleGoBack} className="back-button">
                {t.backButton}
            </button>
        </div>
    );
};

export default PrivacyPolicy;