import { useState } from "react";

export function useKeywordSearchView() {
  const [currentView, setCurrentView] = useState("input");
  const [keywords, setKeywords] = useState([]);

  const switchToResults = (newKeywords) => {
    setKeywords(newKeywords);
    setCurrentView("results");
  };

  const switchToInput = () => {
    setCurrentView("input");
    setKeywords([]);
  };

  return {
    currentView,
    keywords,
    switchToResults,
    switchToInput,
  };
}
