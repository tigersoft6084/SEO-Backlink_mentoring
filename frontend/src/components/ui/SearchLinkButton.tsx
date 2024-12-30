"use client"

export default function SearchLinkButton({ onClick }) {
    return (
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        onClick={onClick}
      >
        Find Links
      </button>
    );
  }
  