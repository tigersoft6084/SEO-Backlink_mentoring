"use client";

import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import CreateProjectModal from "../../../components/common/CreateProjectModal";
import { useUser } from "../../../context/UserContext";
import Lottie from "lottie-react";
import LottiePlayer from "react-lottie-player";
import emptyAnimation from '../../../../public/preload/noResultsFound.json';
import findLinks from '../../../../public/preload/findLinks.json'

interface Project {
  id: number;
  name: string;
  domain: string;
  favourites: number;
}

export default function Projects() {
  const { user } = useUser();

  const [sortOpen, setSortOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [rows, setRows] = useState<Project[]>([]);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    if (!user?.email) return;

    const fetchProjects = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/get-projects?email=${user.email}`);
        const data = await response.json();

        if (response.ok) {
          // Convert API response into rows structure
          const formattedProjects: Project[] = data.map((project: any, index: number) => ({
            id: index + 1,
            name: project.projectName,
            domain: project.domainName,
            favourites: project.favourites?.length || 0,
          }));

          setRows(formattedProjects);
        } else {
          console.error("Error fetching projects:", data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      finally {
        setLoading(false); // ✅ Hide loading after fetch
      }
    };

    fetchProjects();
  }, [user?.email]);

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

  const handleProjectCreated = (newProject: { name: string; domain: string }) => {
    const newRow: Project = {
      id: rows.length + 1,
      name: newProject.name,
      domain: newProject.domain,
      favourites: 0,
    };

    setRows((prevRows) => [...prevRows, newRow]);
    setIsCreateModalOpen(false);
  };

  // ✅ DELETE project
  const handleDeleteProject = async (projectName: string) => {
    if (!user?.email) return;

    setDeletingProject(projectName); // ✅ Set loading state

    try {
      const response = await fetch("/api/remove-project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          projectName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row.name !== projectName));
      } else {
        console.error("Error deleting project:", data.error);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }finally {
      setDeletingProject(null); // ✅ Reset loading state
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex">
        <button
          className="px-3 py-2 bg-gradient-to-r text-white text-sm rounded-2xl flex items-center space-x-2 from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 ml-auto mb-4"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <MdAdd />
          <span>Create a new Project</span>
        </button>
      </div>

      {/* ✅ Show loading text while fetching */}
      {loading ? (
        // Show Lottie animation while loading
        <div className="flex flex-col justify-center items-center h-screen" style={{marginTop : "-100px"}}>
          <p className="text-gray-500 dark:text-gray-300 text-lg font-semibold mt-4 loaderL">
            Loading Project
          </p>
        </div>
      ) : rows.length === 0 ? (
        // ✅ Show empty animation when no projects exist
        <div className="flex flex-col items-center justify-center h-96">
          <Lottie animationData={emptyAnimation} className="w-80 h-80" />
          <p className="text-gray-500 dark:text-gray-300 text-lg font-semibold mt-4">
            No projects found. Create a new one!
          </p>
        </div>
      ) : (
        <div className="mx-auto overflow-hidden rounded-lg shadow-lg bg-white">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-200 border-b border-gray-600 dark:bg-slate-700 dark:border-gray-800">
              <tr>
                <th className="px-1 py-4">
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
                    <div className="flex items-center justify-end space-x-6">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                        <FiEdit className="h-4 w-4" />
                      </button>
                      {deletingProject === row.name ? (
                        <div
                          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"
                          role="status">
                        </div>
                      ) : (
                        <button
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                          onClick={() => handleDeleteProject(row.name)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreated={handleProjectCreated}
          userEmail={user?.email || ""}
        />
    </div>
  );
}
