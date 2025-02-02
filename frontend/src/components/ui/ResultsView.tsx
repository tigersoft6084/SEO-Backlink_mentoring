// ResultsView.tsx
import { useState, useEffect } from "react";
import TopSection from "./ResultsView_TopSection";
import StatsSection from "./ResultsView_StatsSection";
import ActionButtons from "./ActionButtons";
import TableSection from "./ResultsView_Table";
import { AddSelectedDomainBar } from "./AddSelectedDomainBar";

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

      {/* Add Selected Domain Bar */}
      <AddSelectedDomainBar selectedDomains={new Set(Array.from(selectedRows).map((index: number) => responseData.backlinks[index].domain))} />
    </div>
  );
}
