const AddJobs = ({ jobTitle, setJobTitle, company, setCompany, url, setUrl, status, setStatus, addJobApplication, isEditing, cancelEdit }) => {
    return (
        <div id="addjob">
            <h1 className="headerspace">{isEditing ? "Uppdatera jobbsökning" : "Lägg till jobbsökning"}</h1>
            <form onSubmit={addJobApplication}>
                <div className="addjobform-group">
                    <label className="addjobform-label">Jobbtitel:</label>
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
                    <label className="addjobform-label">Företag:</label>
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
                        required
                        className="addjobform-input"
                    />
                </div>
                <div className="addjobform-group">
                    <label className="addjobform-label">Status:</label>
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
                <div className="form-buttons">
                    <button className="addButton" type="submit">
                        {isEditing ? "Uppdatera" : "Lägg till"}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            className="cancelButton"
                            onClick={cancelEdit}
                        >
                            Avbryt
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddJobs;


