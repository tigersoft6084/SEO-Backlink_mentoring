"use client"

import Sidebar from "../../components/common/Sidebar";

// Import icons
import { FaSearch, FaFolderOpen, FaLink, FaGoogle } from "react-icons/fa";
import { FaGauge } from "react-icons/fa6";
import { TbRadarFilled } from "react-icons/tb";
import KeywordSearch from "./keyword-search/page";
import { useSidebar } from "../../context/SidebarContext";
import BulkSearch from "./bulk-search/page";
import CompetitiveAnalysis from "./competitive-analysis/page";
import SerpScanner from "./serp-scanner/page";
import ExpiredDomains from "./expired-domains/page";
import Projects from "./projects/page";
import AccountSettings from "./account-settings/page";

export default function Home() {
  // Add icons and descriptions to the menu items
  const menuItems = [
    { name: "Bulk Search", icon: <FaSearch />, description: "Search in bulk for multiple domains at once." },
    { name: "Keyword Search", icon: <FaGoogle />, description: "Search keywords on Google to analyze rankings." },
    { name: "Competitive Analysis", icon: <TbRadarFilled />, description: "Analyze competitors' domains and backlinks." },
    { name: "Projects", icon: <FaFolderOpen />, description: "Manage and organize your projects here." },
    { name: "Expired Domains", icon: <FaLink />, description: "Find expired domains for backlink opportunities." },
    { name: "Serp Scanner", icon: <FaGauge />, description: "Scan Google SERPs to track keyword rankings." },
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

  const {selectedMenuItem} = useSidebar();

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Bulk Search":
        return <BulkSearch />;
      case "Keyword Search":
        return <KeywordSearch/>;
      case "Competitive Analysis":
        return <CompetitiveAnalysis />;
      case "Projects":
        return <Projects/>;
      case "Expired Domains":
        return <ExpiredDomains/>;
      case "Serp Scanner":
        return <SerpScanner />;
      case "Support":
        return <div/>;
      case "Account Settings":
        return <AccountSettings/>;
      default:
        return <div/>;
      }
    };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar with dynamic icons and descriptions */}
        <Sidebar menuItems={menuItems} quotaUsed={quotaUsed} />
        {renderContent()}
      </div>
    </div>
  );
}