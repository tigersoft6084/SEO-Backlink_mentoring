import { useEffect, useState } from "react";
import Image from "next/image";
import { TiShoppingCart } from "react-icons/ti";
import { MdFilterList } from "react-icons/md";
import { FaList } from "react-icons/fa";
import FilterDropdown from "./Result_Table_FilterDropdown";

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
                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>Domain</span>
                        <MdFilterList />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Tools</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider dark:text-gray-400 relative ">
                  <div className="flex items-center gap-2">
                    <span className="group relative cursor-pointer">
                      RD
                      {/* Tooltip */}
                      <div className="absolute left-0 bottom-full mb-2 hidden w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block" style={{zIndex : "10"}}>
                        Referring Domains: Unique domains linking to the website. Higher
                        values mean a stronger backlink profile.
                      </div>
                    </span>

                    <FilterDropdown onFilterChange={handleFilterChange} />
                    
                  </div>
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>TF</span>
                        <FilterDropdown onFilterChange={handleFilterChange} />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>CF</span>
                        <FilterDropdown onFilterChange={handleFilterChange} />
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
                        <FilterDropdown onFilterChange={handleFilterChange} />
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
                    <div className="flex gap-1 items-center justify-center">

                        <a
                          href={`https://majestic.com/reports/site-explorer?q=${row.domain}&oq=${row.domain}&IndexDataSource=F`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <Image
                            src={'/images/icons/IconMajesctic.svg'}
                            alt="IconMajesctic"
                            width={16}
                            height={16}
                            className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                          />
                          <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Majestic
                          </span>
                        </a>

                        <a
                          href={`https://app.seobserver.com/sites/view/${row.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <Image
                            src={'/images/icons/IconSeobserver.svg'}
                            alt="IconSeobserver"
                            width={16}
                            height={16}
                            className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                          />
                          <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Seobserver
                          </span>
                        </a>

                        <a
                          href={`https://www.semrush.com/analytics/overview/?q=${row.domain}&protocol=https&searchType=domain`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <Image
                            src={'/images/icons/IconSemrush.svg'}
                            alt="IconSemrush"
                            width={16}
                            height={16}
                            className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                          />
                          <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Semrush
                          </span>
                        </a>

                        <a
                          href={`https://app.ahrefs.com/v2-site-explorer/overview?backlinksChartMode=metrics&backlinksChartPerformanceSources=domainRating%7C%7CurlRating&backlinksCompetitorsSource=%22UrlRating%22&backlinksRefdomainsSource=%22RefDomainsNew%22&bestFilter=all&brandedTrafficSource=Branded&chartGranularity=daily&chartInterval=all&competitors=&countries=&country=all&generalChartBrandedTraffic=Branded%7C%7CNon-Branded&generalChartIntents=branded%7C%7Ccommercial%7C%7Cinformational%7C%7Clocal%7C%7Cnavigational%7C%7Ctransactional&generalChartMode=metrics&generalChartPerformanceSources=organicTraffic%7C%7CpaidTraffic%7C%7CrefDomains&generalChartTopPosition=top11_20%7C%7Ctop21_50%7C%7Ctop3%7C%7Ctop4_10%7C%7Ctop51&generalCompetitorsSource=%22OrganicTraffic%22&generalCountriesSource=organic-traffic&generalPagesByTrafficChartMode=Percentage&generalPagesByTrafficSource=Pages%7C%7CTraffic&highlightChanges=none&intentsMainSource=informational&keywordsSource=all&organicChartBrandedTraffic=Branded%7C%7CNon-Branded&organicChartIntents=branded%7C%7Ccommercial%7C%7Cinformational%7C%7Clocal%7C%7Cnavigational%7C%7Ctransactional&organicChartMode=metrics&organicChartPerformanceSources=impressions%7C%7CorganicTraffic%7C%7CorganicTrafficValue&organicChartTopPosition=top11_20%7C%7Ctop21_50%7C%7Ctop3%7C%7Ctop4_10%7C%7Ctop51&organicCompetitorsSource=%22OrganicTraffic%22&organicCountriesSource=organic-traffic&organicPagesByTrafficChartMode=Percentage&organicPagesByTrafficSource=Pages%7C%7CTraffic&overview_tab=general&paidTrafficSources=cost%7C%7Ctraffic&target=${row.domain}&topLevelDomainFilter=all&topOrganicKeywordsMode=normal&topOrganicPagesMode=normal&trafficType=organic&volume_type=monthly`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <Image
                            src={'/images/icons/IconAhrefs.svg'}
                            alt="IconAhrefs"
                            width={16}
                            height={16}
                            className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                          />
                          <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Ahrefs
                          </span>
                        </a>

                        <a
                          href={`https://tool.haloscan.com/domain/overview?input=${row.domain}&mode=root&autoLoad=true`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="relative group"
                        >
                          <Image
                            src={'/images/icons/IconHaloScanMonochrome.svg'}
                                alt="IconHaloScanMonochrome"
                            width={16}
                            height={16}
                            className="cursor-pointer w-[16px] h-[16px] min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px]"
                          />
                          <span className="absolute left-1/2 bottom-full transform -translate-x-1/2 -translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            HaloScan
                          </span>
                        </a>
                                             
                  </div>
                    
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.RD}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.TF}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.CF}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    Society/Adult
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300" >
                  <div className="flex items-center gap-2">
                      <button 
                            className="w-24 h-7 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                          <TiShoppingCart />
                          {getDynamicPrice(row.source, row.price, row.domain)}
                      </button>
                      {row.source}
                  </div>   
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.keyword}</td>

                <td className="py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300" onClick={(e) => e.stopPropagation()}>
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
