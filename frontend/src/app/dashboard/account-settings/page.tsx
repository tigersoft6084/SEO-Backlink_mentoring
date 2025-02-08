"use client";

import { useUser } from "../../../context/UserContext";

export default function AccountSettings() {
  const { user } = useUser(); // Access the globally stored email

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
              {user?.email || "Loading..."}{" "}
            </p>
          </div>

          {/* Your Plan */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Your Plan</label>
            <p className="w-1/2 text-gray-900 dark:text-gray-200">
              {user? user.planName? user.planName : "You have no plans" : "You have no plans"}{" "}
            </p>
          </div>

          {/* Your Plan */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">API Key(Chrome Plugin)</label>
            <div className="w-1/2 overflow-x-auto whitespace-nowrap text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md p-2">
              {user? user.paypalSubscriptionApiKey? user.paypalSubscriptionApiKey : 'Please increase your quota' : 'Please increase your quota'}
            </div>
          </div>


          {/* Renewal Date */}
          <div className="py-4 flex justify-between items-center">
            <label className="text-gray-700 dark:text-gray-300">Renewal Date</label>
            <p className="w-1/2 text-gray-900 dark:text-gray-200">
              {
                user ? user.paypalSubscriptionExpiresAt
                ? (() => {
                    const date = new Date(user.paypalSubscriptionExpiresAt);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
                    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const seconds = String(date.getSeconds()).padStart(2, "0");
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                  })()
                : "Please increase your quota" : 'Please increase your quota'
              }
            </p>
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
