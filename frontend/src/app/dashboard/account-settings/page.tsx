"use client";

import { useUser } from "../../../context/UserContext";

export default function AccountSettings() {
  const { email } = useUser(); // Access the globally stored email

  return (
    <div className="flex-1 p-6 bg-gray-100 dark:bg-slate-900 items-center">
      <div className="w-full p-6 bg-white dark:bg-slate-800 rounded shadow-md">
        <div className="divide-y divide-gray-300 dark:divide-gray-500">
          {/* Default Google Geolocation */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">
              Default Google Geolocation
            </label>
            <select className="w-1/2 p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:text-gray-200 dark:border-gray-600">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>France</option>
              <option>Spain</option>
              <option>Germany</option>
              <option>Brazil</option>
              <option>Portugal</option>
              <option>Italy</option>
              <option>Belgium</option>
              <option>Switzerland</option>
            </select>
          </div>

          {/* Email */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Email</label>
            <p className="w-1/2 text-gray-900 dark:text-gray-200">
              {email || "Loading..."}{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                Change the email
              </a>
            </p>
          </div>

          {/* Your Plan */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Your Plan</label>
            <p className="w-1/2 text-gray-900 dark:text-gray-200">
              Booster Monthly{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline dark:text-blue-400"
              >
                Change the plan
              </a>
            </p>
          </div>

          {/* Renewal Date */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Renewal Date</label>
            <p className="w-1/2 text-gray-900 dark:text-gray-200">2025-01-01</p>
          </div>

          {/* Invoices */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Invoices</label>
            <a
              href="#"
              className="w-1/2 text-blue-500 hover:underline dark:text-blue-400"
            >
              View My Invoices
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
