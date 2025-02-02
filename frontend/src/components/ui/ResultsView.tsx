// ResultsView.tsx
import { useState, useEffect } from "react";
import TopSection from "./ResultsView_TopSection";
import StatsSection from "./ResultsView_StatsSection";
import ActionButtons from "./ActionButtons";
import TableSection from "./ResultsView_Table";

export default function ResultsView({ responseData, onBack, pageName } : any) {
  const maxKeywordsToShow = 3;

  // State to track the checkboxes
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (rowsLength: number) => {
    if (selectedRows.size === rowsLength) {
      setSelectedRows(new Set()); // Deselect all
    } else {
      setSelectedRows(new Set(Array.from({ length: rowsLength }, (_, idx) => idx))); // Select all rows
    }
  };

  return (
    <div className={`px-6 pt-6 rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200 mx-auto ${selectedRows.size > 0 ? "" : "pb-6"}`}>

      {/* Top section with keyword badges and button */}
      <TopSection responseData={responseData.keys} onBack={onBack} maxKeysToShow={maxKeywordsToShow} />

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Stats Section and Action Buttons in one line */}
      <div className="flex justify-between items-center py-4">
        {/* Stats Section */}
        <StatsSection responseData = {responseData.aboutPrice}/>

        {/* Action Buttons */}
        <ActionButtons responseData = {responseData.backlinks}/>
      </div>

      {/* Table Section */}
      <TableSection
        rows={responseData.backlinks}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectAll={selectedRows.size === responseData.backlinks.length}
        setSelectAll={(value) => handleSelectAll(responseData.backlinks.length)}
        pageName = {pageName}
      />

      {/* Show the "Add selected domain" bar */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between w-fit mx-auto my-10 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-t-3xl bg-white dark:bg-slate-700">
          <span className="text-gray-700 dark:text-gray-200">
            Add {selectedRows.size} selected domain{selectedRows.size > 1 ? "s" : ""} to
          </span>
          <div className="flex items-center space-x-4 ml-4">
            <select className="px-2 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 dark:text-gray-200">
              <option value="projects">Projects</option>
              <option value="lists">Lists</option>
            </select>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl hover:bg-blue-600">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
