export default function Title({ title, description }) {
    return (
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    );
  }
  