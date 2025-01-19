import "../css/statistics.css"

const StatisticsComponent = ({ stats }) => {
    return (
        <div className="statistics">
            <h2>Statistik</h2>
            <section className="stats-container">
                <div className="stats-box applied">
                    <p className="stats-label">Ansökningar:</p>
                    <p className="stats-amount"> {stats.applied}</p>
                </div>
                <div className="stats-box interview">
                    <p className="stats-label">Intervjuer:</p>
                    <p className="stats-amount"> {stats.interview}</p>
                </div>
                <div className="stats-box rejected">
                    <p className="stats-label">Avslag:</p>
                    <p className="stats-amount"> {stats.rejected}</p>
                </div>
            </section>

        </div>
    );
};

export default StatisticsComponent;
