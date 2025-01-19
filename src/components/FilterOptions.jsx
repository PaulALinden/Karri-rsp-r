import "../css/filter.css";

const FilterOptions = ({ filterStatus, setFilterStatus, sortOrder, setSortOrder, searchValue, setSearchValue }) => {
    return (
        <div className="filter-options">

            <div>
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="" disabled selected hidden>Status:</option>
                    <option value="Ansökt">Ansökt</option>
                    <option value="Intervju">Intervju</option>
                    <option value="Avslag">Avslag</option>
                    <option value="Arkiverad">Arkiverad</option>
                </select>
            </div>

            <div>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                >
                    <option value="" disabled selected hidden>Datum:</option>
                    <option value="newest">Nyast först</option>
                    <option value="oldest">Äldst först</option>
                </select>
            </div>

            <div>
                <input type="text"
                    className="filter-select"
                    placeholder="search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterOptions;
