import React from "react";
import { Filters as FilterType, FiltersProps } from "../../types/expired.d";
import { IoFilterSharp } from "react-icons/io5";

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
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
        </div>
    </div>
);

const Filters: React.FC<FiltersProps> = ({ filters, updateFilters, onFilter }) => {
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
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
                    <select className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
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
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
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

            {/* Filter Button */}
            <div className="flex justify-end mt-4">
                <button
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 space-x-2"
                    onClick={onFilter}
                >
                    <IoFilterSharp />
                    <span>Filter</span>
                </button>
            </div>
        </div>

    );
};

export default Filters;
