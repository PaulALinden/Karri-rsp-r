import "../css/filter.css";
import zoom_out from "../assets/zoom_out.svg";
import { useLanguage } from "./context/LanguageContext"; // Importera språk-kontexten
import translations from "../utils/language/filter-options.json";

const FilterOptions = ({
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder,
    searchValue,
    setSearchValue,
}) => {
    const { language } = useLanguage();
    const t = translations[language].filterOptions; // Hämta översättningar för FilterOptions

    return (
        <div className="filter-options">
            <div className="space-right">
                <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                    aria-label={t.statusLabel} // Lägg till aria-label för tillgänglighet
                >
                    <option value="">{t.statusOptions[""]}</option>
                    <option value="Ansökt">{t.statusOptions["Ansökt"]}</option>
                    <option value="Intervju">{t.statusOptions["Intervju"]}</option>
                    <option value="Avslag">{t.statusOptions["Avslag"]}</option>
                    <option value="Arkiverad">{t.statusOptions["Arkiverad"]}</option>
                </select>
            </div>

            <div className="space-right">
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="filter-select"
                    aria-label={t.sortLabel} // Lägg till aria-label för tillgänglighet
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