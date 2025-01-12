// components/UploadButton.tsx
import { FC } from "react";
import { MdCloudUpload } from "react-icons/md";

interface UploadButtonProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ onUpload }) => (
  <label className="px-4 py-2 text-blue-600 dark:text-blue-300 flex space-x-2 items-center cursor-pointer">
    <MdCloudUpload />
    <span>Upload a CSV</span>
    <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
  </label>
);

export default UploadButton;
