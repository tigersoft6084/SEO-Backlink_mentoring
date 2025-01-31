import React from "react";
import { FaArrowDown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { parse } from "json2csv";

// List of required sources
const requiredSources = [
  "Paperclub", "Prnews", "Ereferer", "Develink", "Presswhizz", "Linkbroker",
  "Whitepress", "Seojungle", "123media", "Growwer", "Linkbuilders",
  "Mistergoodlink", "Prensalink", "Linkatomic", "Unancor", "Publisuites",
  "Backlinked", "Motherlink", "Getalink", "Lemmilink"
];

// Type for the responseData prop
interface ActionButtonsProps {
  responseData: Array<{
    domain: string;
    keyword: string;
    RD: string;
    TF: number;
    CF: number;
    price: number;
    source: string;
    allSources: Array<{ source: string; price: number }>;
  }> | null | undefined; // Allow null or undefined responseData
}

export default function ActionButtons({ responseData }: ActionButtonsProps) {

  const responseBacklinkArray = responseData || [];

  const handleCSVDownload = () => {
    try {
      // Check if responseData is valid and contains backlinks
      if (!responseBacklinkArray || !Array.isArray(responseBacklinkArray)) {
        throw new Error("Invalid responseData: Expected an array.");
      }

      // Process the backlinks data to include all required sources
      const processedBacklinks = responseBacklinkArray.map((backlink) => {
        if (!backlink.allSources || !Array.isArray(backlink.allSources)) {
          throw new Error(`Invalid data in backlink for domain ${backlink.domain}: Expected 'allSources' to be an array.`);
        }

        const backlinkData: any = {
          domain: backlink.domain,
          keyword: backlink.keyword,
          RD: backlink.RD,
          TF: backlink.TF,
          CF: backlink.CF,
          price: backlink.price
        };

        // Add the required sources to the backlink data
        requiredSources.forEach((source) => {
          const foundSource = backlink.allSources.find((item: { source: string; price: number }) => item.source === source);
          backlinkData[source] = foundSource ? foundSource.price : -2;
        });

        return backlinkData;
      });

      // Convert the processed data to CSV
      const csv = parse(processedBacklinks);

      // Create a Blob from the CSV data
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BulkKeywordSearch.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      // Log the error and display an alert to the user
      console.error("Error generating CSV:", error);
      if (error instanceof Error) {
        alert(`Error generating CSV: ${error.message}`);
      } else {
        alert("Error generating CSV: An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* CSV Button */}
      <button
        onClick={handleCSVDownload}
        className="flex items-center gap-2 w-20 h-10 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <FaArrowDown className="text-lg" />
        <span className="text-sm font-medium">CSV</span>
      </button>

      {/* Settings Button */}
      <button className="flex justify-center items-center w-10 h-10 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-gray-600">
        <IoMdSettings className="text-lg" />
      </button>
    </div>
  );
}