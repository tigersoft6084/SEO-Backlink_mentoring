import React, { useState } from "react";

const PricingTable: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );

  return (
    <div className="flex flex-col items-center mx-auto py-10">
      {/* Billing Toggle */}
      <div className="flex items-center space-x-2 mb-10 border-2 border-gray-300 dark:border-gray-500 dark:bg-slate-900 p-1 rounded-3xl">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-1 dark:text-gray-200 text-gray-500 rounded-full ${
            billingCycle === "monthly"
              ? "bg-primary text-white"
              : " text-gray-600"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("annually")}
          className={`px-4 py-1 dark:text-gray-200 text-gray-500 rounded-full ${
            billingCycle === "annually"
              ? "bg-primary text-white"
              : "text-gray-600"
          }`}
        >
          Annually
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">

        {/* Freelancer Plan */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-600 dark:text-gray-200 text-xl font-bold mb-2">Freelancer</h3>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            The essentials to provide your best work for clients.
          </p>
          <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
            ${billingCycle === "monthly" ? "19" : "190"}
            <span className="text-sm text-gray-500 dark:text-gray-200">/month</span>
          </p>
          <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary">
            Buy plan
          </button>
          <ul className="mt-6 space-y-2 text-gray-600 dark:text-gray-200">
            <li>✓ 5 products</li>
            <li>✓ Up to 1,000 subscribers</li>
            <li>✓ Basic analytics</li>
            <li>✓ 48-hour support response time</li>
          </ul>
        </div>

        {/* Startup Plan */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border-2 border-primary">
          <h3 className="text-xl text-gray-600 dark:text-gray-200 font-bold mb-2">
            Startup{" "}
            <span className="text-xs bg-purple-100 text-primary px-2 py-1 rounded-full">
              Most popular
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            A plan that scales with your rapidly growing business.
          </p>
          <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
            ${billingCycle === "monthly" ? "29" : "290"}
            <span className="text-sm text-gray-500 dark:text-gray-200">/month</span>
          </p>
          <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary">
            Buy plan
          </button>
          <ul className="mt-6 space-y-2 text-gray-600 dark:text-gray-200">
            <li>✓ 25 products</li>
            <li>✓ Up to 10,000 subscribers</li>
            <li>✓ Advanced analytics</li>
            <li>✓ 24-hour support response time</li>
            <li>✓ Marketing automations</li>
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-600 dark:text-gray-200 font-bold mb-2">Enterprise</h3>
          <p className="text-gray-600 dark:text-gray-200 mb-4">
            Dedicated support and infrastructure for your company.
          </p>
          <p className="text-3xl text-gray-600 dark:text-gray-200 font-bold mb-4">
            ${billingCycle === "monthly" ? "59" : "590"}
            <span className="text-sm text-gray-500 dark:text-gray-200">/month</span>
          </p>
          <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary">
            Buy plan
          </button>
          <ul className="mt-6 space-y-2 text-gray-600 dark:text-gray-200">
            <li>✓ Unlimited products</li>
            <li>✓ Unlimited subscribers</li>
            <li>✓ Advanced analytics</li>
            <li>✓ 1-hour, dedicated support response time</li>
            <li>✓ Marketing automations</li>
            <li>✓ Custom reporting tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;
