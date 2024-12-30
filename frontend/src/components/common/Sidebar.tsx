"use client"

import { useState } from "react";
import { RiVipCrown2Fill } from "react-icons/ri";
import { AiOutlineQuestionCircle, AiOutlineSetting } from "react-icons/ai";

export default function Sidebar({ menuItems, quotaUsed }) {
  // Use a union type for state: number | string | null
  const [selectedItem, setSelectedItem] = useState<number | string | null>(null);

  return (
    <aside className="bg-gray-100 dark:bg-gray-800 w-64 p-4 flex flex-col justify-between h-screen ">
      {/* Top Menu */}
      <div>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedItem(index)}
              className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
                selectedItem === index
                  ? "bg-gray-500 text-white" // Selected state
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-400" // Hover state matches selected state
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full ${
                  selectedItem === index
                    ? "text-gray-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-white hover:text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quota Section */}
      <div className="mt-6 border border-gray-400 dark:border-gray-700 rounded-3xl p-4 dark:bg-gray-900 shadow-sm">
        <h2 className="text-gray-600 dark:text-gray-400 mb-4 text-lg font-semibold">
          QUOTA USED
        </h2>
        <div className="space-y-4">
          {quotaUsed.map(({ name, value, max }, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {name}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{`${value}/${max}`}</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 rounded-full relative">
                <div
                  className="h-2 bg-blue-500 dark:bg-blue-700 rounded-full"
                  style={{ width: `${(value / max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 rounded-full hover:bg-purple-600 text-sm font-medium transition">
          <RiVipCrown2Fill className="mr-2" size={16} />
          Extend Your Quota
        </button>
      </div>

      {/* Bottom Menu */}
      <div className="mt-6">
        <ul className="space-y-1">
          <li
            onClick={() => setSelectedItem("support")}
            className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
              selectedItem === "support"
                ? "bg-gray-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-400"
            }`}
          >
            <AiOutlineQuestionCircle
              className={`w-6 h-6 ${
                selectedItem === "support"
                  ? "text-gray-200"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
            <span className="text-sm font-medium">Support</span>
          </li>
          <li
            onClick={() => setSelectedItem("settings")}
            className={`flex items-center space-x-3 p-3 cursor-pointer rounded-full transition-colors ${
              selectedItem === "settings"
                ? "bg-gray-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-400"
            }`}
          >
            <AiOutlineSetting
              className={`w-6 h-6 ${
                selectedItem === "settings"
                  ? "text-gray-200"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
            <span className="text-sm font-medium">Account Settings</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
