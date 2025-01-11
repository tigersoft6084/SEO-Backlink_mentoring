"use client";

import InputView from "./InputView";
import { useSearchView } from "../../../hooks/useSearchView";
import ResultsView from "../../../components/ui/ResultsView";

export default function BulkSearch() {
  const {
    currentView,
    responseData,
    switchToResults,
    switchToInput,
  } = useSearchView();

  const pageName = "BulkSearch"

  return (
    <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {currentView === "input" ? (
        <InputView
          placeholder="Send up to 30000 URLs maximum, 1 per line."
          onSearch={switchToResults}
        />
      ) : (
        <ResultsView responseData={responseData} onBack={switchToInput} pageName={pageName} />
      )}
    </div>
  );
}
