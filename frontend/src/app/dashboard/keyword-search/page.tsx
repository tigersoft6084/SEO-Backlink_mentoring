"use client";

import { useKeywordSearchView } from "../../../hooks/useKeywordSearchView";
import InputView from "./InputView";
import ResultsView from "./ResultsView";

export default function App() {
  const {
    currentView,
    keywords,
    switchToResults,
    switchToInput,
  } = useKeywordSearchView();

  return (
    <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {currentView === "input" ? (
        <InputView
          placeholder="Enter keywords, one per line..."
          onSearch={switchToResults}
        />
      ) : (
        <ResultsView keywords={keywords} onBack={switchToInput} />
      )}
    </div>
  );
}
