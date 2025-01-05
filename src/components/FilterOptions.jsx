import React from "react";

const FilterOptions = ({ filterStatus, setFilterStatus, sortOrder, setSortOrder, searchValue, setSearchValue }) => {
    return (
        <div className="filter-options">
            <div className="filter-jobs">
                <label htmlFor="filterStatus">Status:</label>
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Visa alla</option>
                    <option value="Ansökt">Ansökt</option>
                    <option value="Intervju">Intervju</option>
                    <option value="Avslag">Avslag</option>
                </select>
            </div>

            <div className="sort-dates">
                <label htmlFor="sortOrder">Datum:</label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                >
                    <option value="newest">Nyast först</option>
                    <option value="oldest">Äldst först</option>
                </select>
            </div>

            <div>
                <input type="text"
                    className="searchbar"
                    placeholder="search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterOptions;
