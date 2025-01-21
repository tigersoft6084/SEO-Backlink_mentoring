import { useEffect, useState } from "react";
import { MdFilterList } from "react-icons/md";
import { FaList } from "react-icons/fa";
import MarketPlacesLinks from "./MarketPlacesLinks";
interface Row {
    domain: string;
    tf: number;
    cf: number;
    rd: number;
    ref_ips: number;
    ref_edu: number;
    ref_gov: number;
    ttf: string;
    language : string;
    expiry_date : string;
}

interface ExpiredDomainsTableProps{
    rows : Row[];
}

const ExpiredDomainsTable : React.FC<ExpiredDomainsTableProps> = ({
    rows
}) => {

    console.log(rows);
    const [sortedRows, setSortedRows] = useState(rows);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Row; direction: "asc" | "desc" } | null>(null);

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

    console.log(sortedRows)
    return (
        <div className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-700">
            <div className="overflow-x-auto max-h-[calc(100vh-330px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
                    <thead className="bg-white dark:bg-gray-700">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
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
                                        {/* Tooltip */}
                                        <div
                                            className="absolute left-0 bottom-full mb-2 hidden w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg group-hover:block"
                                            style={{ zIndex: "10" }}
                                        >
                                            Referring Domains: Unique Domains linking to the website. Higher values mean a stronger backlink
                                            profile.
                                        </div>
                                    </span>

                                    {sortConfig?.key === "rd" && (sortConfig.direction === "asc" ? "▲" : "▼")}

                                </div>
                            </th>

                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("tf")}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">TF</span>
                                    {sortConfig?.key === "tf" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("cf")}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">CF</span>
                                    {sortConfig?.key === "cf" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("ref_ips")}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">Ref.Ips</span>
                                    {sortConfig?.key === "ref_ips" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("ref_edu")}
                                >
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">Ref.Edu</span>
                                    {sortConfig?.key === "ref_edu" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("ref_gov")}>
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">Ref.Gov</span>
                                    {sortConfig?.key === "ref_gov" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("ttf")}>
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">TTF</span>
                                    {sortConfig?.key === "ttf" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("language")}>
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">Language</span>
                                    {sortConfig?.key === "language" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                                onClick={() => handleSort("expiry_date")}>
                                <div className="flex items-center gap-2">
                                    <span className="cursor-pointer">Expiry_Date</span>
                                    {sortConfig?.key === "expiry_date" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </div>
                            </th>

                        </tr>
                    </thead>

                    <tbody className="bg-white dark:bg-gray-700">
                        {sortedRows.map((row, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-blue-100 hover:rounded-3xl hover:scale-y-60n dark:hover:bg-gray-500 transition-all duration-100"
                            >
                                <td
                                    className="px-4 py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-300"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <a
                                        href={`https://${row.domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {row.domain}
                                    </a>
                                </td>

                                <td className="py-4" onClick={(e) => e.stopPropagation()}>
                                    <MarketPlacesLinks domain={row.domain} />
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.rd}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.tf}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.cf}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.ref_ips}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.ref_edu}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{row.ref_gov}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Society/Adult</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">En</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">2024-01-01</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExpiredDomainsTable;