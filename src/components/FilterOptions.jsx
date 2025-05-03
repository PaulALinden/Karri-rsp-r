import "../css/filter.css";
import zoom_out from "../assets/zoom_out.svg";
import { useLanguage } from "./context/LanguageContext";
import translations from "../utils/language/filter-options.json";
import { statusOptions } from "../utils/constants";

const FilterOptions = ({
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    searchValue,
    setSearchValue,
}) => {
    const { language } = useLanguage();
    const t = translations[language].filterOptions;

    return (
        <div className="filter-options">
            <div className="space-right">
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                    aria-label={t.statusLabel}
                >
                    <option value="">{t.statusOptions[""]}</option>
                    {statusOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {t.statusOptions[option.value]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-right">
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                    aria-label={t.sortLabel}
                >
                    <option value="newest">{t.sortOptions["newest"]}</option>
                    <option value="oldest">{t.sortOptions["oldest"]}</option>
                </select>
            </div>

            <div className="search">
                <input
                    type="text"
                    className="filter-select search-input"
                    placeholder={t.searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <img className="zoom_out" src={zoom_out} alt="Search" />
            </div>
        </div>
    );
};

export default FilterOptions;