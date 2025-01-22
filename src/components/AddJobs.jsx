import "../css/addJob.css"

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

    return (
        <div id="addjob">
            <h2 className="headerspace">{isEditing ? "Uppdatera jobbsökning" : "Lägg till jobbsökning"}</h2>
            <form onSubmit={addJobApplication}>
                <div className="addjobform-group">
                    <label className="addjobform-label">Jobbtitel:*</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Ex: Frontend Developer"
                        required
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">Företag:*</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ex: Spotify"
                        required
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">Url:</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Ex: www.exempel.com"
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">Plats:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: Stockholm"
                        className="addjobform-input"
                    />
                </div>

                <section className="addJobform-parallel">
                    <div className="addjobform-group">
                        <label className="addjobform-label">Arbetsform:*</label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">Välj arbetsform</option>
                            <option value="På plats">På plats</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Distans">Distans</option>
                        </select>
                    </div>

                    <div className="addjobform-group middle">
                        <label className="addjobform-label">Anställningsform:*</label>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">Välj typ</option>
                            <option value="Heltid">Heltid</option>
                            <option value="Deltid">Deltid</option>
                            <option value="Kontrakt">Kontrakt</option>
                            <option value="Praktik">Praktik</option>
                        </select>
                    </div>
                    <div className="addjobform-group">
                        <label className="addjobform-label">Status:*</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="addjobform-select"
                        >
                            <option value="">Välj status</option>
                            <option value="Ansökt">Ansökt</option>
                            <option value="Intervju">Intervju</option>
                            <option value="Avslag">Avslag</option>
                        </select>
                    </div>
                </section>
                <div className="addjobform-group">
                    <label className="addjobform-label">Kommentar:</label>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ex: Utfört tester"
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-buttons">
                    <button className="addButton" type="submit">
                        {isEditing ? "Uppdatera" : "Lägg till"}
                    </button>
                    <button
                        type="button"
                        className="delete"
                        onClick={cancelEdit}
                    >
                        Avbryt
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddJobs;


