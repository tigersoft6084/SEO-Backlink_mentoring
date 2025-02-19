import { useEffect, useState } from "react";
import { MdFilterList } from "react-icons/md";
import { FaList } from "react-icons/fa";
import FilterDropdown from "./ResultsView_Table_FilterDropdown";
import RightSidebar from "./ResultsView_Table_RightSidebar";
import MarketPlacesLinks from "./MarketPlacesLinks";
import DynamicPrice from "./ShopingCartAndPrice";

interface Row {
  domain: string;
  keyword: string;
  rd: number;
  tf: number;
  cf: number;
  ttf : string;
  price: number;
  source: string;
  allSources: any;
  pageName: string;
}

interface TableSectionProps {
  rows: Row[];
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
  pageName: String;
}

const TableSection: React.FC<TableSectionProps> = ({
  rows,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll,
  pageName,
}) => {
  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Row; direction: "asc" | "desc" } | null>(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Row | null>(null);

  const [filters, setFilters] = useState<{ [key in keyof Row]?: Array<{ condition: string; value: string; logic?: string }> }>({});

  useEffect(() => {
    let filteredRows = rows;
    Object.keys(filters).forEach((key) => {
      const filterConditions = filters[key as keyof Row];
      if (filterConditions && filterConditions.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          return filterConditions.reduce((acc, { condition, value, logic }, index) => {
            if (!value) return acc;
            let result = false;
            switch (condition) {
              case "equals":
                result = String(row[key as keyof Row]) === String(value);
                break;
              case "doesnotequal":
                result = String(row[key as keyof Row]) !== String(value);
                break;
              case "greaterThan":
                result = Number(row[key as keyof Row]) > Number(value);
                break;
              case "greaterThanOrEqual":
                result = Number(row[key as keyof Row]) >= Number(value);
                break;
              case "lessThan":
                result = Number(row[key as keyof Row]) < Number(value);
                break;
              case "lessThanOrEqual":
                result = Number(row[key as keyof Row]) <= Number(value);
                break;
              case "between":
                const [min, max] = value.split(",").map(Number);
                result = Number(row[key as keyof Row]) >= min && Number(row[key as keyof Row]) <= max;
                break;
              case "notBlank":
                result = String(row[key as keyof Row]).trim() !== "";
                break;
              case "blank":
                result = String(row[key as keyof Row]).trim() === "";
                break;
              default:
                result = true;
            }
            return index === 0 ? result : logic === "AND" ? acc && result : acc || result;
          }, true);
        });
      }
    });
    setSortedRows(filteredRows);
  }, [filters, rows]);


  useEffect(() => {
    setSortedRows(rows);
  }, [rows]);

  const handleSort = (key: keyof Row) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...rows].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setSortedRows(sorted);
    setSortConfig({ key, direction });
  };

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

  const handleFilterChange = (key: keyof Row, newFilters: Array<{ condition: string; value: string; logic?: string }>) => {
    setFilters((prev) => ({ ...prev, [key]: newFilters }));
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

  return (
    <div className="p-6 bg-white shadow-md rounded-lg dark:bg-slate-700">
      <div className="overflow-x-auto max-h-[calc(100vh-330px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
          <thead className="bg-white dark:bg-slate-700">
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
              <th
                className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                onClick={() => handleSort("domain")}
              >
                <div className="flex items-center gap-2">
                  <span>Domain</span>
                  {sortConfig?.key === "domain" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                  <MdFilterList />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tools
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider dark:text-gray-400 relative"
                onClick={() => handleSort("rd")}
              >
                <div className="flex items-center gap-2">
                  <span className="group relative cursor-pointer">
                    RD
                  </span>

                  {sortConfig?.key === "rd" && (sortConfig.direction === "asc" ? "▲" : "▼")}

                  <FilterDropdown onFilterChange={(filters) => handleFilterChange("rd", filters)} />
                </div>
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                onClick={() => handleSort("tf")}
              >
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer">TF</span>
                  {sortConfig?.key === "tf" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                  <FilterDropdown onFilterChange={(filters) => handleFilterChange("tf", filters)} />
                </div>
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                onClick={() => handleSort("cf")}
              >
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer">CF</span>
                  {sortConfig?.key === "cf" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                  <FilterDropdown onFilterChange={(filters) => handleFilterChange("cf", filters)} />
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer">TTF</span>
                  <MdFilterList />
                </div>
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center gap-2">
                  <span className="cursor-pointer">Best Price</span>
                  {sortConfig?.key === "price" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                  <FilterDropdown onFilterChange={(filters) => handleFilterChange("price", filters)} />
                </div>
              </th>

              {pageName === "KeywordSearch" && (
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  onClick={() => handleSort("keyword")}
                >
                  <div className="flex items-center gap-2">
                    <span className="cursor-pointer">Keyword</span>
                    {sortConfig?.key === "keyword" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                    <MdFilterList />
                  </div>
                </th>
              )}

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                All
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-slate-700">
            {sortedRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-100 hover:rounded-3xl hover:scale-y-60n dark:hover:dark:hover:bg-slate-600 transition-all duration-100"
                onClick={() => handleRowCheckboxChange(idx)}
              >
                <td className="px-6 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-500"
                      checked={selectedRows.has(idx)}
                      onChange={() => handleRowCheckboxChange(idx)}
                    />
                  </div>
                </td>

                <td
                  className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`https://${row.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {row.domain.length > 20 ? `${row.domain.substring(0, 20)}...` : row.domain}
                  </a>
                </td>

                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <MarketPlacesLinks domain={row.domain} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.rd}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.tf}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.cf}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.ttf?.length > 12 ? `${row.ttf.substring(0, 12)}...` : row.ttf}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <DynamicPrice
                    source={row.source}
                    price={row.price}
                    domain={row.domain}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                {pageName === "KeywordSearch" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {row.keyword}
                  </td>
                )}

                <td
                  className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="flex justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRowData(row); // Set row data
                      setSidebarVisible(true); // Open sidebar
                    }}
                  >
                    <FaList style={{ transform: "scaleX(-1)" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar */}
      <RightSidebar
        visible={sidebarVisible}
        data={selectedRowData}
        sellers={selectedRowData?.allSources || []}
        onClose={() => setSidebarVisible(false)}
      />
    </div>
  );
};

export default TableSection;
