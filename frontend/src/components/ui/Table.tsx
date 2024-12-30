export default function Table({ placeholder }) {
    return (
      <textarea
        className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        placeholder={placeholder}
      />
    );
  }
  