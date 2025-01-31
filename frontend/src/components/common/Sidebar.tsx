"use client";

import { useState } from "react";
import { useSidebar } from "../../context/SidebarContext"; // Import context
import { RiVipCrown2Fill } from "react-icons/ri";
import { AiOutlineQuestionCircle, AiOutlineSetting } from "react-icons/ai";
import useExpiredFilterView from "../../hooks/useExpiredFilterView";

interface MenuItem {
  name: string;
  icon: React.ReactNode;
  count?: number; // Add the count property
}

interface QuotaItem {
  name: string;
  value: number;
  max: number;
}

interface SidebarProps {
  menuItems: MenuItem[];
  quotaUsed: QuotaItem[];
}

export default function Sidebar({ menuItems, quotaUsed }: SidebarProps) {
  const { setSelectedMenuItem } = useSidebar(); // Access context
  const [selectedItem, setSelectedItem] = useState<number | string | null>(null);
  const { fetchDomainsOnMount } = useExpiredFilterView();

  const handleMenuClick = (index: number, name: string) => {
    setSelectedItem(index);
    setSelectedMenuItem(name); // Update the context

    // Fetch expired domains when "Expired Domains" is clicked
    if (name === "Expired Domains") {
      fetchDomainsOnMount();
    }
  };

  return (
    <aside className="bg-gray-100 dark:bg-slate-900 w-72 p-4 flex flex-col justify-between h-screen" style={{resize : "none"}}>

      {/* Top Menu */}
      <div>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(index, item.name)} // Pass the item's name
              className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
                selectedItem === index
                  ? "dark:hover:bg-slate-700 dark:bg-slate-700 text-white bg-gray-400" // Selected state
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-slate-700" // Hover state
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>

            </li>
          ))}
        </ul>
      </div>


      {/* Quota Section */}
      <div className="mt-6 border border-gray-400 dark:border-gray-700 rounded-3xl p-4 dark:bg-slate-800 shadow-sm">
        <h2 className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-semibold">QUOTA USED</h2>
        <div className="space-y-4">
          {quotaUsed.map(({ name, value, max }, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
                <span className="text-gray-500 dark:text-gray-400">{`${value}/${max}`}</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-900 h-2 rounded-full relative">
                <div
                  className="h-2 bg-blue-500 dark:bg-blue-700 rounded-full"
                  style={{ width: `${(value / max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-full text-sm font-medium transition"
          onClick={() => {setSelectedItem("Extend Your Quota"), setSelectedMenuItem("Extend Your Quota")}}
        >
          <RiVipCrown2Fill className="mr-2" size={16} />
          Extend Your Quota
        </button>
      </div>

      {/* Bottom Menu */}
      <div className="mt-6">
        <ul className="space-y-1">
          <li
            onClick={() => {setSelectedItem("Support"), setSelectedMenuItem("Support")}}
            className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
              selectedItem === "Support"
                ? "dark:hover:bg-slate-700 dark:bg-slate-700 text-white bg-gray-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-slate-700"
            }`}
          >
            <AiOutlineQuestionCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Support</span>
          </li>
          <li
            onClick={() => {setSelectedItem("Account Settings"), setSelectedMenuItem("Account Settings")}}
            className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
              selectedItem === "Account Settings"
                ? "dark:hover:bg-slate-700 dark:bg-slate-700 text-white bg-gray-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-slate-700"
            }`}
          >
            <AiOutlineSetting className="w-6 h-6" />
            <span className="text-sm font-medium">Account Settings</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}