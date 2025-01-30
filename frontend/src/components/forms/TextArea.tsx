// components/TextArea.tsx
import { FC } from "react";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const TextArea: FC<TextAreaProps> = ({ value, onChange, placeholder }) => (
  <textarea
    className="w-full p-4 border border-gray-300 rounded-lg dark:bg-slate-800 dark:border-gray-400 dark:text-gray-200"
    placeholder={placeholder}
    rows={10}
    value={value}
    onChange={onChange}
  />
);

export default TextArea;
