// StatsSection.tsx
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaUpDown } from "react-icons/fa6";
import { TbRadarFilled } from "react-icons/tb";

interface StatsSectionProps {
  responseData: string[];
}


export default function StatsSection({responseData} : StatsSectionProps) {
  return (
    <div className="flex items-center gap-16 py-4">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <TbRadarFilled className="text-blue-600" size={20} />
          <span>BACKLINKS FOUND</span>
        </p>
        <p className="text-2xl font-bold">{responseData[0]}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <FaUpDown className="text-orange-500" size={20} />
          <span>AVG DOMAIN PRICE</span>
        </p>
        <p className="text-2xl font-bold">{responseData[1]} €</p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <FaArrowDown className="text-green-600" size={20} />
          <span>MIN BUDGET</span>
        </p>
        <p className="text-2xl font-bold">{responseData[2]} €</p>
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
          <FaArrowUp className="text-red-600" size={20} />
          <span>MAX BUDGET</span>
        </p>
        <p className="text-2xl font-bold">{responseData[3]} €</p>
      </div>
    </div>
  );
}
