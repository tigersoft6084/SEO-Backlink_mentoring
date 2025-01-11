"use client";

import ResultsView from "../../../components/ui/ResultsView";
import { useSearchView } from "../../../hooks/useSearchView";
import InputView from "./InputView";


export default function KeywordSearch() {
  const {
    currentView,
    responseData,
    switchToResults,
    switchToInput,
  } = useSearchView();

  const pageName = "KeywordSearch"; // Define the pageName here

  return (
    <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {currentView === "input" ? (
        <InputView
          placeholder="Enter up to 20 keywords (1 per line) to scan Google SERPs."
          onSearch={switchToResults}
        />
      ) : (
        <ResultsView responseData={responseData} onBack={switchToInput} pageName = {pageName}/>
      )}
    </div>
  );
}
