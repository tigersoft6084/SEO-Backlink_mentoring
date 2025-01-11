// ResultsView.tsx
import { useState, useEffect } from "react";
import TopSection from "./ResultsView_TopSection";
import StatsSection from "./ResultsView_StatsSection";
import ActionButtons from "./ActionButtons";
import TableSection from "./ResultsView_Table";

export default function ResultsView({ responseData, onBack, pageName }) {
  const maxKeywordsToShow = 3;

  // State to track the checkboxes
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div className="p-6 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 mx-auto">

      {/* Top section with keyword badges and button */}
      <TopSection responseData={responseData.keys} onBack={onBack} maxKeysToShow={maxKeywordsToShow} />

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Stats Section and Action Buttons in one line */}
      <div className="flex justify-between items-center py-4">
        {/* Stats Section */}
        <StatsSection responseData = {responseData.aboutPrice}/>

        {/* Action Buttons */}
        <ActionButtons responseData = {responseData}/>
      </div>

      {/* Table Section */}
      <TableSection
        rows={responseData.backlinks}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        pageName = {pageName}
      />
    </div>
  );
}
