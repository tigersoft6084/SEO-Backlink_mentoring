import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Define a type for the Message component props
interface MessageProps {
    content: string;
}

// Renders errors or successful transactions on the screen.
function Message({ content }: MessageProps) {
    return <p dangerouslySetInnerHTML={{ __html: content }} />;
}

interface PayPalResponse {
    id?: string;
    details?: Array<{ issue?: string; description?: string }>;
    message?: string;
    debug_id?: string;
}

export default function Support () {
    // Corrected the client-id to clientId (camelCase)
    const initialOptions = {
        clientId: "AbpNcG_m61ifryOF-AMldotiw3ey3zorxqUaupMJIWCZoh8YwEvw0W6O5xSLDV9Ea2PGdEVbEcleoZRB",
        enableFunding: "",
        disableFunding: "paylater,card",
        dataSdkIntegrationSource: "integrationbuilder_sc",
        vault: "true",
        intent: "subscription",
    };

    const [message, setMessage] = useState<string>("");

    return (

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">Your plan : Spammer (Monthly)</h1>
            <div className="mt-4 flex justify-center">
              <button className="px-4 py-2 rounded-full bg-blue-500 text-white">Monthly</button>
              <span className="mx-2 text-white">/</span>
              <button className="px-4 py-2 rounded-full bg-transparent border-2 text-white">Yearly</button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <!-- Standard Plan --> */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Standard</h2>
              <p className="text-xl text-gray-600 mt-2">15€ / Month</p>
              <ul className="mt-6 text-left text-gray-600">
                <li>300 results per search</li>
                <li>100 backlinks monitored</li>
                <li>200 Plugin clicks</li>
                <li>50 keyword searches</li>
                <li>20 competitive analyses</li>
                <li>3 simultaneous bulk competitive</li>
              </ul>
              <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-full">Update my plan</button>
            </div>

            {/* <!-- Booster Plan --> */}
            <div className="bg-green-500 rounded-lg shadow-lg p-6 text-center text-white">
              <h2 className="text-2xl font-semibold">Booster</h2>
              <p className="text-xl mt-2">49€ / Month</p>
              <div className="mt-6 space-y-2 text-left">
                <ul>
                  <li>1000 results per search</li>
                  <li>500 backlinks monitored</li>
                  <li>1000 Plugin clicks</li>
                  <li>250 keyword searches</li>
                  <li>100 competitive analyses</li>
                  <li>15 simultaneous bulk competitive</li>
                </ul>
              </div>
              <button className="mt-6 w-full bg-white text-green-500 py-2 rounded-full">Update my plan</button>
            </div>

            {/* <!-- Spammer Plan --> */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Spammer</h2>
              <p className="text-xl text-gray-600 mt-2">99€ / Month</p>
              <ul className="mt-6 text-left text-gray-600">
                <li>30000 results per search</li>
                <li>2000 backlinks monitored</li>
                <li>5000 Plugin clicks</li>
                <li>2000 keyword searches</li>
                <li>500 competitive analyses</li>
                <li>40 simultaneous bulk competitive</li>
              </ul>
              <button className="mt-6 w-full bg-green-500 text-white py-2 rounded-full">Current plan</button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-white">Want to access our API? <a href="/contact" className="text-blue-400">Contact us!</a></p>
          </div>
        </div>
    );
}

