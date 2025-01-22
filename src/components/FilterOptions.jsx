import "../css/filter.css";
import zoom_out from "../assets/zoom_out.svg"

const FilterOptions = ({ filterStatus, setFilterStatus, sortOrder, setSortOrder, searchValue, setSearchValue }) => {
    return (
        <div className="filter-options">

            <div className="space-right">
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="" disabled hidden>Status:</option>
                    <option value="Ansökt">Ansökt</option>
                    <option value="Intervju">Intervju</option>
                    <option value="Avslag">Avslag</option>
                    <option value="Arkiverad">Arkiverad</option>
                </select>
            </div>

            <div className="space-right">
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                >
                    <option value="" disabled hidden>Datum:</option>
                    <option value="newest">Nyast först</option>
                    <option value="oldest">Äldst först</option>
                </select>
            </div>

            <div className="search">
                <input type="text"
                    className="filter-select search-input"
                    placeholder="Sök..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <img className="zoom_out" src={zoom_out} />
            </div>
        </div>
    );
};

export default FilterOptions;
