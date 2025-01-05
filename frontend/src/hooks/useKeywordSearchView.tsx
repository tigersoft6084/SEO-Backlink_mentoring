import { useState } from "react";

export function useKeywordSearchView() {
  const [currentView, setCurrentView] = useState("input");
  const [responseData, setKeywords] = useState([]);

  const switchToResults = (newResponseData) => {
    setKeywords(newResponseData);
    setCurrentView("results");
  };

  const switchToInput = () => {
    setCurrentView("input");
    setKeywords([]);
  };

  return {
    currentView,
    responseData,
    switchToResults,
    switchToInput,
  };
}
