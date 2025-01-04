"use client";

import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaUpDown } from "react-icons/fa6";
import { TbRadarFilled } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";

export default function ResultsView({ keywords, onBack }) {
  return (
    <div className="p-6 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 mx-auto">
      {/* Top section with keyword badges and button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300"
            >
              {keyword}
            </span>
          ))}
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2"
          onClick={onBack}
        >
          <FaSearch />
          <span>Start New Search</span>
        </button>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 dark:border-gray-700" />

      <div className="flex items-center justify-between py-4">
          {/* Stats Section */}
          <div className="flex items-center gap-16">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <TbRadarFilled className="text-blue-600" size={20} />
                <span>BACKLINKS FOUND</span>
              </p>
              <p className="text-2xl font-bold">1859</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <FaUpDown className="text-orange-500" size={20} />
                <span>AVG DOMAIN PRICE</span>
              </p>
              <p className="text-2xl font-bold">608€</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <FaArrowDown className="text-green-600" size={20} />
                <span>MIN BUDGET</span>
              </p>
              <p className="text-2xl font-bold">1 071 473€</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <FaArrowUp className="text-red-600" size={20} />
                <span>MAX BUDGET</span>
              </p>
              <p className="text-2xl font-bold">1 997 480€</p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex items-center gap-2">
            {/* CSV Button */}
            <button className="flex items-center gap-2 w-20 h-10 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <FaArrowDown className="text-lg" />
              <span className="text-sm font-medium">CSV</span>
            </button>
            {/* Settings Button */}
            <button className="flex justify-center items-center w-10 h-10 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <IoMdSettings className="text-lg" />
            </button>
          </div>
        </div>

    </div>
  );
}
