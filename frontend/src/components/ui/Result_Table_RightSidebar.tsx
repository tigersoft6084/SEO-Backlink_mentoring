import React from "react";
import { IoCloseSharp } from "react-icons/io5";

interface Row {
  domain: string;
  RD: number;
  TF: number;
  CF: number;
  price: number;
  source: string;
  keyword: string;
}

interface RightSidebarProps {
  visible: boolean;
  data: Row | null;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ visible, data, onClose }) => {
  if (!visible || !data) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="p-4  dark:border-gray-500">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 float-right"
        >
          <IoCloseSharp size={25} />
        </button>
      </div>
      <div className="p-4 text-blue-500">
        <a 
            href={`https://${data.domain}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline"
        >
            {data.domain}
        </a>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <strong>RD:</strong> {data.RD}
        </div>
        <div>
          <strong>TF:</strong> {data.TF}
        </div>
        <div>
          <strong>CF:</strong> {data.CF}
        </div>
        <div>
          <strong>Price:</strong> {data.price}
        </div>
        <div>
          <strong>Source:</strong> {data.source}
        </div>
        <div>
          <strong>Keyword:</strong> {data.keyword}
        </div>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("Add to Project")}
        >
          Add to Project
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
