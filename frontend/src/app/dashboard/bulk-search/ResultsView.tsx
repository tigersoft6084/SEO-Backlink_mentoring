// ResultsView.tsx
import { useState, useEffect } from "react";
import StatsSection from "../../../components/ui/Result_StatsSection";
import ActionButtons from "../../../components/ui/ActionButtons";
import TopSection from "../../../components/ui/Result_TopSection";
import TableSection from "../../../components/ui/Result_Table";

export default function ResultsView({ responseData, onBack }) {
  const maxDomainsToShow = 3;

  // State to track the checkboxes
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  return (
    <div className="p-6 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 mx-auto">

      {/* Top section with keyword badges and button */}
      <TopSection responseData={responseData.domains} onBack={onBack} maxKeysToShow={maxDomainsToShow} />

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
        pageName = {"bulkSearch"}
      />
    </div>
  );
}
