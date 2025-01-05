import { useEffect } from "react";
import Image from "next/image";
import { TiShoppingCart } from "react-icons/ti";
import { MdFilterList } from "react-icons/md";
import { FaList } from "react-icons/fa";

interface Row {
  domain: string;
  keyword: string;
  RD: number;
  TF: number;
  CF: number;
  price: string;
  source: string;

}

interface TableSectionProps {
  rows: Row[];
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableSection: React.FC<TableSectionProps> = ({
  rows,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
}) => {
  const handleRowCheckboxChange = (index: number) => {
    setSelectedRows((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(index)) {
        newSelected.delete(index);
      } else {
        newSelected.add(index);
      }
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set()); // Deselect all
    } else {
      setSelectedRows(new Set(rows.map((_, idx) => idx))); // Select all rows
    }
  };

  // Calculate the header checkbox state dynamically
  const calculateHeaderCheckboxState = () => {
    if (selectedRows.size === 0) {
      return false; // No rows selected
    }
    if (selectedRows.size === rows.length) {
      return true; // All rows selected
    }
    return "indeterminate"; // Some rows selected
  };

  useEffect(() => {
    // When rows are selected/deselected, update selectAll state dynamically
    setSelectAll(selectedRows.size === rows.length);
  }, [selectedRows, rows.length, setSelectAll]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
          <thead className="bg-white dark:bg-gray-700">
            <tr>
                <th className="px-6">
                  <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className={`form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500 ${
                          calculateHeaderCheckboxState() === "indeterminate" ? "bg-yellow-500" : ""
                        }`}
                        checked={selectedRows.size === rows.length}
                        onChange={handleSelectAllChange}
                      />
                  </div>
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>Domain</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Tools</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>RD</span>
                      <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>TF</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>CF</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>TTF</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>Best Price</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>Keyword</span>
                        <MdFilterList />
                    </div>
                    
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    All
                </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700">
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="px-6 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500"
                        checked={selectedRows.has(idx)}
                        onChange={() => handleRowCheckboxChange(idx)}
                      />
                  </div>
                </td>
                <td className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300">{row.domain}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 items-center justify-center">
                        <Image
                            src={'/images/icons/IconMajesctic.svg'}
                            alt="IconMajesctic"
                            width={16}
                            height={16}
                            />
                        <Image
                            src={'/images/icons/IconSeobserver.svg'}
                            alt="IconSeobserver"
                            width={16}
                            height={16}
                        />
                        <Image
                            src={'/images/icons/IconSemrush.svg'}
                            alt="IconSemrush"
                            width={16}
                            height={16}
                        />
                        <Image
                            src={'/images/icons/IconAhrefs.svg'}
                            alt="IconAhrefs"
                            width={16}
                            height={16}
                        />
                        <Image
                            src={'/images/icons/IconHaloScanMonochrome.svg'}
                            alt="IconHaloScanMonochrome"
                            width={16}
                            height={16}
                        />
                  </div>
                    
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.RD}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.TF}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.CF}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Society/Relationships</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                      <button 
                            className="w-24 h-7 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
                        >
                          <TiShoppingCart />
                          {row.price}
                      </button>
                      {row.source}
                  </div>   
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.keyword}</td>
                <td className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300">
                  <div className=" flex justify-center">
                      <FaList style={{ transform: "scaleX(-1)" }} />
                  </div>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSection;
