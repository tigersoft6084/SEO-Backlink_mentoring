"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams ? searchParams.get("keyword") : null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Result Page</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">Keyword: {keyword}</p>
      {/* Add your logic to display results here */}
    </div>
  );
}
