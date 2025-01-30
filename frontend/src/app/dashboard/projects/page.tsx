"use client"

import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

export default function Projects() {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = [
    { id: 1, name: "test", domain: "10sec.nl", favourites: 1 },
    { id: 2, name: "example", domain: "example.com", favourites: 5 },
  ];

  const toggleSort = () => {
    setSortOpen(!sortOpen);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedRows(!selectAll ? rows.map((row) => row.id) : []);
  };

  const handleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleCreateNewProject = () => {
    // Add search logic here
    console.log("Search initiated with:", );
  };

  return (
    <div className="flex-1 p-6">

    <div className="flex">
      <button
        className="px-3 py-2 bg-gradient-to-r text-white text-sm rounded-2xl flex items-center space-x-2 from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 ml-auto mb-4"
        onClick={handleCreateNewProject}>
          <MdAdd />
          <span>Create a new Project</span>
      </button>
    </div>

      <div className="mx-auto overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 border-b border-gray-600 dark:bg-slate-700 dark:border-gray-800">
            <tr>
              <th className="px-1 py-4"> {/* Reduced x (px-1) and increased y (py-6) */}
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th className="px-1 py-4 text-left">
                <div className="relative">
                  <div
                    className="flex items-center space-x-1 cursor-pointer"
                    onClick={toggleSort}
                    role="button"
                    aria-expanded={sortOpen}
                  >
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                      Name
                    </span>
                    <IoMdArrowDropdown />
                  </div>
                  {sortOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-300 rounded shadow-md w-36 z-10">
                      <ul className="py-1 text-sm text-gray-700">
                        <li
                          className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          onClick={() => console.log("Sort A-Z")}
                        >
                          Sort A-Z
                        </li>
                        <li
                          className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          onClick={() => console.log("Sort Z-A")}
                        >
                          Sort Z-A
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </th>
              <th className="px-1 py-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                Domain
              </th>
              <th className="px-1 py-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                Favourites
              </th>
              <th className="px-6 py-6 text-right text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-200 dark:bg-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:dark:hover:bg-slate-700">
                <td className="px-1 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelection(row.id)}
                    />
                  </div>
                </td>
                <td className="px-1 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {row.name}
                </td>
                <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-200">
                  {row.domain}
                </td>
                <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-200">
                  {row.favourites}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                      <FiEdit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button className="text-red-600 hover:text-red-900 flex items-center space-x-1">
                      <FiTrash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
