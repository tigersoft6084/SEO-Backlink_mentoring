import React, { useState } from "react";
import { MdFilterList } from "react-icons/md";

interface FilterDropdownProps {
  onFilterChange: (filters: Array<{ condition: string; value: string; logic?: string }>) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilterChange }) => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Array<{ condition: string; value: string; logic?: string }>>([
    { condition: "equals", value: "" },
  ]);
  const [logic, setLogic] = useState<"AND" | "OR">("AND");

  const handleFilterChange = (index: number, key: "condition" | "value", value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index][key] = value;
    setFilters(updatedFilters);

    // Automatically add a second filter if the first input has a value and there is only one filter
    if (filters.length === 1 && updatedFilters[0].value.trim()) {
      setFilters([
        ...updatedFilters,
        { condition: "equals", value: "", logic },
      ]);
    }

    // Remove the second filter if both inputs are empty
    if (
      filters.length === 2 &&
      !updatedFilters[0].value.trim() &&
      !updatedFilters[1].value.trim()
    ) {
      setFilters(updatedFilters.slice(0, 1)); // Keep only the first filter
    }

    onFilterChange(updatedFilters);
  };

  const handleLogicChange = (newLogic: "AND" | "OR") => {
    setLogic(newLogic);
    // Update the logic for the second filter, if it exists
    if (filters.length > 1) {
      const updatedFilters = [...filters];
      updatedFilters[1].logic = newLogic;
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
  };

  return (
    <span className="relative">
      <MdFilterList
        className="cursor-pointer"
        onClick={() => setFilterOpen((prev) => !prev)}
      />
      {isFilterOpen && (
        <div
          className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg w-[11rem] py-3 px-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {filters.map((filter, index) => (
            <div key={index} className="mb-2">
              {index > 0 && (
                <div className="flex items-center gap-2 mb-1 justify-center">
                  <label className="text-sm font-medium">
                    <input
                      type="radio"
                      name="logic"
                      value="AND"
                      checked={logic === "AND"}
                      onChange={() => handleLogicChange("AND")}
                      className="mr-1"
                    />
                    AND
                  </label>
                  <label className="text-sm font-medium">
                    <input
                      type="radio"
                      name="logic"
                      value="OR"
                      checked={logic === "OR"}
                      onChange={() => handleLogicChange("OR")}
                      className="mr-1"
                    />
                    OR
                  </label>
                </div>
              )}
              <select
                className="w-full px-2 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.condition}
                onChange={(e) => handleFilterChange(index, "condition", e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="contains">Does not equal</option>
                <option value="startsWith">Greater than</option>
                <option value="endsWith">Greater than or equal to</option>
                <option value="lessThan">Less than</option>
                <option value="lessThanOrEqual">Less than or equal to</option>
                <option value="between">Between</option>
                <option value="blank">Blank</option>
                <option value="notBlank">Not blank</option>
              </select>
              <input
                type="text"
                placeholder="Enter value"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.value}
                onChange={(e) => handleFilterChange(index, "value", e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </span>
  );
};

export default FilterDropdown;
