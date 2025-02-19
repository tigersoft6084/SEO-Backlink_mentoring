import React, { useEffect, useState } from "react";
import { Filters as FilterType, FiltersProps } from "../../types/expired.d";
import { IoFilterSharp } from "react-icons/io5";
import { useExpiredDomains } from "../../context/ExpiredDomainsContext";

// Reusable component for min/max input fields
const MinMaxInput: React.FC<{
    forLabel : string;
    name: string;
    minValue: string;
    maxValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ forLabel, name, minValue, maxValue, onChange }) => (
    <div className="flex space-x-2">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {forLabel}
            </label>
            <input
                type="text"
                name={`min${name}`}
                value={minValue}
                onChange={onChange}
                placeholder="Min"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 invisible">
                MAX
            </label>
            <input
                type="text"
                name={`max${name}`}
                value={maxValue}
                onChange={onChange}
                placeholder="Max"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600"
            />
        </div>
    </div>
);

const Filters: React.FC<FiltersProps> = ({ filters, updateFilters, onFilter }) => {

    const { totalExpiredDomains } = useExpiredDomains();
    const [expiredCount, setExpiredCount] = useState(totalExpiredDomains || 0);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(filters.page || 10); // Default limit to 10

    // Calculate totalPages dynamically
    const totalPages = expiredCount > 0 ? Math.ceil(expiredCount / limit) : 1;

    // Update expiredCount when API updates `totalExpiredDomains`
    useEffect(() => {
        if (totalExpiredDomains !== expiredCount) {
            setExpiredCount(totalExpiredDomains);
        }
    }, [totalExpiredDomains, expiredCount]);

    // Update filters only when currentPage changes
    useEffect(() => {
        if (Number(filters.page) !== currentPage) {  // Convert filters.page to number
            updateFilters("page", currentPage.toString()); // Ensure it's stored as a string
        }
    }, [currentPage, updateFilters, filters.page]);



    // Trigger API call after filters are updated
    useEffect(() => {
        onFilter();
    }, [filters]); // Runs only when filters are updated



    // Handler for input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (
            name.startsWith("min") ||
            name.startsWith("max") ||
            (name === "Domain" && value) ||  // Ensure it handles search value properly
            !isNaN(Number(value)) // Ensure numeric input
        ) {
            updateFilters(name as keyof FilterType, value);
        }
    };

    // Handler for select changes
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateFilters(name as keyof FilterType, value);
    };

    const onSelect = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateFilters(name as keyof FilterType, value);
        setLimit(Number(value)); // Update the limit on page size change
    }

    // Update current page when filter is applied
    const onPageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-4">

                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        name="Domain"
                        value={filters.Domain}
                        onChange={handleInputChange}
                        placeholder="Search"
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600"
                    />
                </div>

                {/* Trust Flow */}
                <MinMaxInput
                    forLabel = "Trust Flow"
                    name="TF"
                    minValue={filters.minTF}
                    maxValue={filters.maxTF}
                    onChange={handleInputChange}
                />

                {/* Ref_Ips */}
                <MinMaxInput
                    forLabel="Ref.Ips"
                    name="RefIps"
                    minValue={filters.minRefIps}
                    maxValue={filters.maxRefIps}
                    onChange={handleInputChange}
                />

                {/* Topical Trust Flow */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Topical trust flow
                    </label>
                    <select
                        name="TTF"
                        value={filters.TTF}
                        onChange={handleSelectChange}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600">
                            <option value="Select">Select</option>
                            <option value="Adult">Adult</option>
                            <option value="Arts">Arts</option>
                            <option value="Business">Business</option>
                            <option value="Computers">Computers</option>
                            <option value="Games">Games</option>
                            <option value="Health">Health</option>
                            <option value="Home">Home</option>
                            <option value="Kids">Kids</option>
                            <option value="News">News</option>
                            <option value="Recreation">Recreation</option>
                            <option value="Reference">Reference</option>
                            <option value="Regional">Regional</option>
                            <option value="Science">Science</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Society">Society</option>
                            <option value="Sports">Sports</option>
                            <option value="World">World</option>
                    </select>
                </div>

                {/* Citation Flow */}
                <MinMaxInput
                    forLabel="Citation Flow"
                    name="CF"
                    minValue={filters.minCF}
                    maxValue={filters.maxCF}
                    onChange={handleInputChange}
                />

                {/* Ref.edu */}
                <MinMaxInput
                    forLabel="Ref.edu"
                    name="RefEdu"
                    minValue={filters.minRefEdu}
                    maxValue={filters.maxRefEdu}
                    onChange={handleInputChange}
                />

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Language
                    </label>
                    <select className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600">
                        <option value="All">All</option>
                        <option value="En">English</option>
                        <option value="Fr">French</option>
                        <option value="Fr">Spanish</option>
                        <option value="Fr">Russian</option>
                        <option value="Fr">Deutsche</option>
                        <option value="Fr">Islian</option>
                        <option value="Fr">Portuguese</option>
                        <option value="Fr">Netherlands</option>
                    </select>
                </div>

                {/* Referring Domains */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Referring Domains
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            name="minRD"
                            value={filters.minRD}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            name="maxRD"
                            value={filters.maxRD}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-slate-800 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Ref.gov */}
                <MinMaxInput
                    forLabel="Ref.gov"
                    name="RefGov"
                    minValue={filters.minRefGov}
                    maxValue={filters.maxRefGov}
                    onChange={handleInputChange}
                />
            </div>


            <div className="flex flex-row flex-1 justify-between">

                <div className="flex justify-start mt-4">
                    <select
                        className="px-6 py-3 bg-white w-48 text-center text-gray-900 dark:bg-slate-800 dark:text-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                        onChange={onSelect} // Handle dropdown value change
                        name="limit"
                    >
                        <option value="10" className="py-2 transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-700 dark:hover:text-white">10</option>
                        <option value="25" className="py-2 transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-700 dark:hover:text-white">25</option>
                        <option value="50" className="py-2 transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-700 dark:hover:text-white">50</option>
                        <option value="100" className="py-2 transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-700 dark:hover:text-white">100</option>
                    </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-purple-100 dark:bg-slate-700 dark:hover:bg-purple-600 dark:text-gray-200 transition-colors duration-200"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-purple-100 dark:bg-slate-700 dark:hover:bg-purple-600 dark:text-gray-200 transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>

                {/* Filter Button */}
                <div className="flex justify-end mt-4">
                    <button
                        className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 space-x-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2  focus:ring-opacity-50"
                        onClick={onFilter}
                    >
                        <IoFilterSharp />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

        </div>

    );
};

export default Filters;
