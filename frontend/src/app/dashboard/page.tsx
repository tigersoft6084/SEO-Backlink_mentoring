import Sidebar from "../../components/common/Sidebar";
import DynamicContent from "../../components/ui/DynamicContent";

// Import icons
import { FaSearch, FaFolderOpen, FaLink, FaGoogle } from "react-icons/fa";
import { FaGauge } from "react-icons/fa6";
import { TbRadarFilled } from "react-icons/tb";

export default function Home() {
  // Add icons to the menu items
  const menuItems = [
    { name: "Bulk Search", icon: <FaSearch /> },
    { name: "Keyword Search", icon: <FaGoogle /> },
    { name: "Competitive Analysis", icon: <TbRadarFilled /> },
    { name: "Projects", icon: <FaFolderOpen /> },
    { name: "Expired Domains", icon: <FaLink /> },
    { name: "Serp Scanner", icon: <FaGauge /> },
  ];

  const quotaUsed = [
    { name: "Backlinks", value: 100, max: 500 },
    { name: "Plugin", value: 0, max: 1000 },
    { name: "Keyword Searches", value: 11, max: 250 },
    { name: "Competitive Analysis", value: 4, max: 100 },
    { name: "SERP Scanner", value: 0, max: 100 },
  ];

  const handleSearch = () => {
    console.log("Search initiated");
  };

  return (
    <div className="h-screen flex flex-col">

      <div className="flex flex-1">
        {/* Sidebar with dynamic icons */}
        <Sidebar menuItems={menuItems} quotaUsed={quotaUsed} />

        {/* Dynamic content */}
        <DynamicContent
          title=""
          description="Enter up to 20 keywords (1 per line) to scan Google SERPs"
          placeholder="Paste URLs"
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
}
