import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useUserPlan } from "../../../context/UserPlanContext";

interface Plan {
    plan_name: string;
    plan_id: string;
    description: string;
    price: number;
    currency: string;
}

const PricingTable: React.FC = () => {

    const { userPlanData, loading } = useUserPlan();

    const { email } = useUser();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [fetchLoading, setFetcgLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
        "monthly"
    );
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);


    useEffect(() => {

        const fetchPlans = async () => {

            try {

                const response = await fetch("http://localhost:2024/api/plans");
                const data = await response.json();
                setPlans(data.fetchedPlans); // Update the plans
                setFetcgLoading(false); // Mark fetching as completed

            } catch (error) {

                console.error("Error fetching plans:", error);
                setFetcgLoading(false); // Still mark fetching as completed in case of error

            }

        };

        fetchPlans();
    }, []);

    // Function to handle subscription creation
    const handleSubscription = async (planId: string, planName : string) => {

        try {

            const response = await fetch("http://localhost:2024/api/create-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planId
                }),
            });

            const result = await response.json();

            if (response.ok) {

                console.log("Subscription created successfully:", result);
                const approvalUrl = result.approvalUrl; // Ensure the backend sends `approvalUrl`

                if (approvalUrl) {

                    // Store the planId in localStorage to use it after redirect
                    localStorage.setItem("selectedPlanId", planId);
                    localStorage.setItem("selectedPlanName", planName);
                    if (email) {
                        localStorage.setItem("userEmail", email);
                    }

                    // Redirect the user to the approval URL
                    window.location.href = approvalUrl;

                } else {
                    alert("No approval URL returned from the server.");
                }

            } else {

                console.error("Subscription creation failed:", result);
                alert(`Failed to create subscription: ${result.message}`);
            }

        } catch (error) {

            console.error("Error creating subscription:", error);
            alert("An error occurred while creating the subscription.");

        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600 dark:text-gray-200 text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mx-auto py-10">

            {/* Billing Toggle */}
            <div className="flex items-center space-x-2 mb-10 border-2 border-gray-300 dark:border-gray-500 dark:bg-slate-900 p-1 rounded-3xl">

                <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1 dark:text-gray-200 text-gray-500 rounded-full ${
                        billingCycle === "monthly"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        : " text-gray-600"}`
                    }
                >
                    Monthly
                </button>

                <button
                    onClick={() => setBillingCycle("annually")}
                    className={`px-4 py-1 dark:text-gray-200 text-gray-500 rounded-full ${
                        billingCycle === "annually"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        : "text-gray-600"}`
                    }
                >
                    Annually
                </button>

            </div>

            {/* Pricing Cards */}
            <div className="px-10 grid grid-cols-1 md:grid-cols-3 gap-16 w-full mix-w-2xl max-w-7xl">

                {/* Freelancer Plan */}
                <div className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border-2
                    ${userPlanData?.subscriptionId ? userPlanData.planName == "Standard Plan" ? "border-primary" : "border-gray-300 dark:border-gray-700" : "border-gray-300 dark:border-gray-700" }`}>
                    <h3 className="text-gray-600 dark:text-gray-200 text-xl font-bold mb-2">{plans[0].plan_name}</h3>

                    <p className="text-gray-600 dark:text-gray-200 mb-4">
                        {plans[0].description}
                    </p>

                    <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
                        {plans[0].currency ? "$" : "€"}{billingCycle === "monthly" ? plans[0].price : plans[0].price * 10}
                        <span className="text-sm text-gray-500 dark:text-gray-200"> / {billingCycle === "monthly" ? "month" : "year"}</span>
                    </p>

                    <button className={`w-full py-2 rounded-lg
                        ${userPlanData?.subscriptionId ? userPlanData.planName == "Standard Plan" ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200"}`}
                        onClick={() => handleSubscription(plans[0].plan_id, plans[0].plan_name)}>
                        {userPlanData?.subscriptionId ? userPlanData.planName == "Standard Plan" ? "Current plan" : "Update my plan" : "Update my plan"}
                    </button>

                    <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-200">
                        <li>✓ Forums and expired domains analysis</li>
                        <li>✓ 300 results per search</li>
                        <li>✓ 100 backlinks monitored</li>
                        <li>✓ 200 Plugin clicks</li>
                        <li>✓ 50 keyword searches</li>
                        <li>✓ 20 competitive analyses</li>
                        <li>✓ 3 simultaneous bulk competitive</li>
                        <li>✗ Bulk Keywords</li>
                        <li>✗ SERP Scanner</li>
                    </ul>

                </div>

                {/* Booster Plan */}
                <div className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border-2
                    ${userPlanData?.subscriptionId ? userPlanData.planName == "Booster Plan" ? "border-primary" : "border-gray-300 dark:border-gray-700" : "border-gray-300 dark:border-gray-700" }`}>

                    <h3 className="text-xl text-gray-600 dark:text-gray-200 font-bold mb-2">
                        {plans[1].plan_name}{" "}
                        <span className="text-xs bg-purple-100 text-primary px-2 py-1 rounded-full">
                            Most popular
                        </span>
                    </h3>

                    <p className="text-gray-600 dark:text-gray-200 mb-4">
                        {plans[1].description}
                    </p>

                    <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
                        {plans[1].currency ? "$" : "€"}{billingCycle === "monthly" ? plans[1].price : plans[1].price * 10}
                        <span className="text-sm text-gray-500 dark:text-gray-200"> / {billingCycle === "monthly" ? "month" : "year"}</span>
                    </p>

                    <button className={`w-full py-2 rounded-lg
                        ${userPlanData?.subscriptionId ? userPlanData.planName == "Booster Plan" ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200"}`}
                        onClick={() => handleSubscription(plans[1].plan_id, plans[1].plan_name)}>
                        {userPlanData?.subscriptionId ? userPlanData.planName == "Booster Plan" ? "Current plan" : "Update my plan" : "Update my plan"}
                    </button>

                    <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-200">
                        <li>✓ Forums and expired domains analysis</li>
                        <li>✓ 1000 results per search</li>
                        <li>✓ 500 backlinks monitored</li>
                        <li>✓ 1000 Plugin clicks</li>
                        <li>✓ 250 keyword searches</li>
                        <li>✓ 100 competitive analyses</li>
                        <li>✓ 15 simultaneous bulk competitive</li>
                        <li>✓ 20 simultaneous bulk Keywords</li>
                        <li>✓ 20 SERP Scanner</li>
                    </ul>

                </div>

                {/* Enterprise Plan */}
                <div className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-md border-2
                    ${userPlanData?.subscriptionId ? userPlanData.planName == "Spammer Plan" ? "border-primary" : "border-gray-300 dark:border-gray-700" : "border-gray-300 dark:border-gray-700" }`}>

                    <h3 className="text-xl text-gray-600 dark:text-gray-200 font-bold mb-2">{plans[2].plan_name}</h3>

                    <p className="text-gray-600 dark:text-gray-200 mb-4">
                        {plans[2].description}
                    </p>

                    <p className="text-3xl text-gray-600 dark:text-gray-200 font-bold mb-4">
                        {plans[2].currency ? "$" : "€"}{billingCycle === "monthly" ? plans[2].price : plans[2].price * 10}
                        <span className="text-sm text-gray-500 dark:text-gray-200"> / {billingCycle === "monthly" ? "month" : "year"}</span>
                    </p>

                    <button className={`w-full py-2 rounded-lg
                        ${userPlanData?.subscriptionId ? userPlanData.planName == "Spammer Plan" ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200" : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0  dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200"}`}
                        onClick={() => handleSubscription(plans[2].plan_id, plans[2].plan_name)}>
                        {userPlanData?.subscriptionId ? userPlanData.planName == "Spammer Plan" ? "Current plan" : "Update my plan" : "Update my plan"}
                    </button>

                    <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-200">
                        <li>✓ Forums and expired domains analysis</li>
                        <li>✓ 30000 results per search</li>
                        <li>✓ 2000 backlinks monitored</li>
                        <li>✓ 5000 Plugin clicks</li>
                        <li>✓ 2000 keyword searches</li>
                        <li>✓ 500 competitive analyses</li>
                        <li>✓ 40 simultaneous bulk competitive</li>
                        <li>✓ 100 simultaneous bulk Keywords</li>
                        <li>✓ 50 SERP Scanner</li>
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default PricingTable;
