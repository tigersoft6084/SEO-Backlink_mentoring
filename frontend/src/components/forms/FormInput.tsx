import { ChangeEvent } from "react";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string; // Add value prop
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}

export default function FormInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 w-full">
      <label
        htmlFor={id}
        className="sm:w-1/3 text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={type === "password" ? "new-password" : "on"}
        value={value} // Bind value prop
        onChange={onChange} // Bind onChange prop
        className="flex-grow px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900"
        aria-label={label}
      />
    </div>
  );
}
