// ResultsView.tsx
import { useState, useEffect } from "react";
import StatsSection from "../../../components/ui/StatsSection";
import ActionButtons from "../../../components/ui/ActionButtons";
import TopSection from "../../../components/ui/Result_TopSection";
import TableSection from "../../../components/ui/ResultTable";

export default function ResultsView({ keywords, onBack }) {
  const maxKeywordsToShow = 3;

  // State to track the checkboxes
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Example rows data
  const rows = [
    {
      domain: "10sec.nl",
      rd: 478,
      tf: 43,
      cf: 59,
      ttf: "Society/Relationships",
      bestPrice: "275€",
      source : "PaperClub",
      keyword: "best vpn",
    },
    {
      domain: "http://localhost:1212/",
      rd: 1400,
      tf: 30,
      cf: 62,
      ttf: "Recreation/Travel",
      bestPrice: "15519€",
      source : "Seojungle",
      keyword: "best cheap vpn",
    },
    // Add more rows here
  ];

  return (
    <div className="p-6 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 mx-auto">

      {/* Top section with keyword badges and button */}
      <TopSection keywords={keywords} onBack={onBack} maxKeywordsToShow={maxKeywordsToShow} />

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Stats Section and Action Buttons in one line */}
      <div className="flex justify-between items-center py-4">
        {/* Stats Section */}
        <StatsSection />

        {/* Action Buttons */}
        <ActionButtons />
      </div>

      {/* Table Section */}
      <TableSection
        rows={rows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
      />
    </div>
  );
}
