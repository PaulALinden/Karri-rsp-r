import "../css/addJob.css";
import { useLanguage } from "./context/LanguageContext";
import translations from "../utils/language/add-jobs.json";

const AddJobs = ({
    jobTitle, setJobTitle,
    company, setCompany,
    url, setUrl,
    location, setLocation,
    position, setPosition,
    jobType, setJobType,
    status, setStatus,
    comment, setComment,
    addJobApplication,
    isEditing,
    cancelEdit
}) => {
    const { language } = useLanguage();
    const t = translations[language].addJobs;

    return (
        <div id="addjob">
            <h2 className="headerspace">
                {isEditing ? t.titleUpdate : t.titleAdd}
            </h2>
            <form onSubmit={addJobApplication}>
                <div className="addjobform-group">
                    <label className="addjobform-label">{t.jobTitleLabel}</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder={t.jobTitlePlaceholder}
                        required
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">{t.companyLabel}</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={t.companyPlaceholder}
                        required
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">{t.urlLabel}</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t.urlPlaceholder}
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">{t.locationLabel}</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t.locationPlaceholder}
                        className="addjobform-input"
                    />
                </div>

                <section className="addJobform-parallel">
                    <div className="addjobform-group">
                        <label className="addjobform-label">{t.positionLabel}</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">{t.positionPlaceholder}</option>
                            {t.positionOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="addjobform-group middle">
                        <label className="addjobform-label">{t.jobTypeLabel}</label>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">{t.jobTypePlaceholder}</option>
                            {t.jobTypeOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="addjobform-group">
                        <label className="addjobform-label">{t.statusLabel}</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">{t.statusPlaceholder}</option>
                            {t.statusOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <div className="addjobform-group">
                    <label className="addjobform-label">{t.commentLabel}</label>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t.commentPlaceholder}
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-buttons">
                    <button className="addButton" type="submit">
                        {isEditing ? t.updateButton : t.addButton}
                    </button>
                    <button type="button" className="delete" onClick={cancelEdit}>
                        {t.cancelButton}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJobs;

