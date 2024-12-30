"use client";

import { IoFilterSharp } from "react-icons/io5";

export default function ExpiredDomains() {
  return (

    <div className="flex-1 p-6">

        {/* Filters Section */}
        <div className="p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-4">

                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                </div>

                {/* Trust Flow */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Trust flow
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Links */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Links
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Topical Trust Flow */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Topical trust flow
                    </label>
                    <select className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <option value="Select">Select</option>
                        <option value="Category1">Category 1</option>
                        <option value="Category2">Category 2</option>
                    </select>
                </div>

                {/* Citation Flow */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Citation flow
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Links.edu */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Links.edu
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Language
                    </label>
                    <select className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        <option value="All">All</option>
                        <option value="En">English</option>
                        <option value="Fr">French</option>
                    </select>
                </div>

                {/* Referring Domains */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Referring Domains
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>

                {/* Links.gov */}
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Links.gov
                        </label>
                        <input
                            type="text"
                            placeholder="Min"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 invisible">
                            Max
                        </label>
                        <input
                            type="text"
                            placeholder="Max"
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Button */}
            <div className="flex justify-end mt-4">
                <button className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 space-x-2">
                    <IoFilterSharp />
                    <span>Filter</span>
                </button>
            </div>
        </div>

        {/* Table Section */}
        <div className="mt-6 bg-white border dark:bg-gray-800 dark:border-gray-400 p-6 rounded-lg shadow-md">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-gray-600 dark:text-gray-200">
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">Tools</th>
                <th className="px-4 py-2">RD</th>
                <th className="px-4 py-2">TF</th>
                <th className="px-4 py-2">CF</th>
                <th className="px-4 py-2">REF.IP</th>
                <th className="px-4 py-2">REF.EDU</th>
                <th className="px-4 py-2">REF.GOV</th>
                <th className="px-4 py-2">TTF</th>
                <th className="px-4 py-2">LANG</th>
                <th className="px-4 py-2">DATE ADDED</th>
                </tr>
            </thead>
            <tbody>
                <tr className="text-gray-700 dark:text-gray-300 border-t">
                <td className="px-4 py-2 text-blue-500">10sec.nl</td>
                <td className="px-4 py-2">Icons</td>
                <td className="px-4 py-2">478</td>
                <td className="px-4 py-2">43</td>
                <td className="px-4 py-2">59</td>
                <td className="px-4 py-2">4</td>
                <td className="px-4 py-2">2</td>
                <td className="px-4 py-2">0</td>
                <td className="px-4 py-2">Society/Relationships</td>
                <td className="px-4 py-2">EN</td>
                <td className="px-4 py-2">2024-05-03</td>
                </tr>
            </tbody>
            </table>
        </div>
        
    </div>
  );
}
