"use client";

import ResultsView from "../../../components/ui/ResultsView";
import { useSearchView } from "../../../hooks/useSearchView";
import InputView from "./InputView";


export default function CompetitiveAnalysis() {
  const {
    currentView,
    responseData,
    switchToResults,
    switchToInput,
  } = useSearchView();

  const pageName = "CompetitiveAnalysis"; // Define the pageName here

  return (
    <div className="flex-1 p-6 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {currentView === "input" ? (
        <InputView
          placeholder="Enter up to 15 competitor domain (1 per line) names to analyze their backlinks."
          onSearch={switchToResults}
        />
      ) : (
        <ResultsView responseData={responseData} onBack={switchToInput} pageName = {pageName}/>
      )}
    </div>
  );
}
