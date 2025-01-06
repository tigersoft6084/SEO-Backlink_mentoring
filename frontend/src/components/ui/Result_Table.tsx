import { useEffect, useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { MdFilterList } from "react-icons/md";
import { FaList } from "react-icons/fa";
import FilterDropdown from "./Result_Table_FilterDropdown";
import RightSidebar from "./Result_Table_RightSidebar";
import MarketPlacesLinks from "./MarketPlacesLinks";
import DynamicPrice from "./ShopingCartAndPrice";

interface Row {
  domain: string;
  keyword: string;
  RD: number;
  TF: number;
  CF: number;
  price: number;
  source: string;
  allSources: any;
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

  const [sortedRows, setSortedRows] = useState(rows);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Row; direction: "asc" | "desc"} | null>(null);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Row | null>(null);

  useEffect(() => {
    setSortedRows(rows);
  }, [rows]);

  const handleSort = (key: keyof Row) => {
    let direction: "asc" | "desc" = "asc";

    if(sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
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
    setSortConfig({ key, direction});
  }

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

  const handleFilterChange = (filters: Array<{ condition: string; value: string; logic?: string }>) => {
    console.log("Filter values:", filters);
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

  const getDynamicPrice = (source, price, domain) => {
    switch (source) {
      case "paper_club":
        return (
          <a
            href={`https://app.paper.club/annonceur/resultats?type=simple&term=${domain}`}
            target="_blank"
          >
            {price}
          </a>
        );
      case "seoJungle":
        return (
          <a
            href={`https://app.seo-jungle.com/search?searchField=${domain}&priceMax=110.6`}
            target="_blank"
          >
            {price}
          </a>
        );
      case "prensalink":
        return (
          <a
            href={`https://shop.prensalink.com/products/medias`}
            target="_blank"
          >
            {price}
          </a>
        );
      default:
        return price; // Default price
    }
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
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer" onClick={() => handleSort("domain")}>
                    <div className="flex items-center gap-2">
                        <span>Domain</span>
                        {sortConfig?.key === "domain" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        <MdFilterList />
                        
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Tools</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider dark:text-gray-400 relative" onClick={() => handleSort("RD")}>
                  <div className="flex items-center gap-2">
                    <span className="group relative cursor-pointer">
                      RD
                      {/* Tooltip */}
                      <div className="absolute left-0 bottom-full mb-2 hidden w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block" style={{zIndex : "10"}}>
                        Referring Domains: Unique domains linking to the website. Higher
                        values mean a stronger backlink profile.
                      </div>
                    </span>

                    {sortConfig?.key === "RD" && (sortConfig.direction === "asc" ? "▲" : "▼")}

                    <FilterDropdown onFilterChange={handleFilterChange} />
                                       
                  </div>
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400" onClick={() => handleSort("TF")}>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer">TF</span>
                        {sortConfig?.key === "TF" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        <FilterDropdown onFilterChange={handleFilterChange} />
                    </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400" onClick={() => handleSort("CF")}>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer">CF</span>
                        {sortConfig?.key === "CF" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        <FilterDropdown onFilterChange={handleFilterChange} />
                    </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer">TTF</span>
                        <MdFilterList />
                    </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer">Best Price</span>
                        {sortConfig?.key === "price" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        <FilterDropdown onFilterChange={handleFilterChange} />
                    </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400" onClick={() => handleSort("keyword")}>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer">Keyword</span>
                        {sortConfig?.key === "keyword" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                        <MdFilterList />
                    </div>
                    
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    All
                </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-700">

            {sortedRows.map((row, idx) => (

              <tr key={idx} 
                  className="hover:bg-blue-100 hover:rounded-3xl hover:scale-y-60 transition-all duration-100"
                  onClick={() => handleRowCheckboxChange(idx)}>

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

                <td className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300" onClick={(e) => e.stopPropagation()}>
                    <a 
                      href={`https://${row.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {row.domain}
                    </a>
                </td>

                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <MarketPlacesLinks domain={row.domain}/>                   
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.RD}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.TF}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.CF}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    Society/Adult
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300" >
                    <DynamicPrice
                      source={row.source}
                      price={row.price}
                      domain={row.domain}
                      onClick={(e) => e.stopPropagation()}
                    />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.keyword}</td>

                <td className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300" onClick={(e) => e.stopPropagation()}>
                  <div 
                    className=" flex justify-center cursor-pointer" 
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
