"use client"

import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { usePlan } from "../../../context/UserPlanContext";

interface Plan {
    plan_name: string;
    plan_id: string;
    description: string;
    price: number;
    currency: string;
}

const PricingTable: React.FC = () => {
    const { user, refreshUser } = useUser(); // ✅ Use `useUser()` instead of `useUserPlan()`
    const [plans, setPlans] = useState<Plan[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { selectedPlanId, selectedPlanName, setPlan } = usePlan();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

    // ✅ Fetch available plans
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch("/api/plans");
                const data = await response.json();
                setPlans(data.fetchedPlans);
            } catch (error) {
                console.error("Error fetching plans:", error);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchPlans();
    }, []);

  // ✅ Handle subscription process
    const handleSubscription = async (planId: string, planName: string) => {
        try {
            const response = await fetch("/api/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            });

            const result = await response.json();
            if (response.ok && result.approvalUrl) {
                setPlan(planId, planName);              // ✅ Store selected plan in state + sessionStorage
                window.location.href = result.approvalUrl;
            } else {
                alert("Subscription creation failed.");
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
            <div className="flex items-center space-x-2 mb-10 bg-white border-2 border-gray-300 dark:border-gray-500 dark:bg-slate-800 p-1 rounded-3xl">
                {["monthly", "annually"].map((cycle) => (
                <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle as "monthly" | "annually")}
                    className={`px-4 py-1 rounded-full ${
                    billingCycle === cycle
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        : "text-gray-600 dark:text-gray-200"
                    }`}
                >
                    {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </button>
                ))}
            </div>

            {/* Pricing Cards */}
            <div className="px-10 grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-7xl">
                {plans.map((plan, index) => {
                    const isCurrentPlan = user?.planName === plan.plan_name;
                    return (
                        <div
                            key={index}
                            className={`p-6 rounded-3xl shadow-md border-2 bg-white dark:bg-slate-800 ${
                                isCurrentPlan ? "border-primary" : "border-gray-300 dark:border-gray-700"
                            }`}
                        >
                            <h3 className="text-gray-600 dark:text-gray-200 text-xl font-bold mb-2">{plan.plan_name}</h3>
                            <p className="text-gray-600 dark:text-gray-200 mb-4">{plan.description}</p>
                            <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
                                {plan.currency ? "$" : "€"}
                                {billingCycle === "monthly" ? plan.price : plan.price * 10}
                                <span className="text-sm text-gray-500 dark:text-gray-200"> / {billingCycle}</span>
                            </p>

                            {/* Button to Subscribe or Indicate Current Plan */}
                            <button
                                className={`w-full py-2 rounded-lg ${
                                    isCurrentPlan
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                        : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0 dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200"
                                }`}
                                onClick={() => handleSubscription(plan.plan_id, plan.plan_name)}
                            >
                                {isCurrentPlan ? "Current Plan" : "Upgrade Plan"}
                            </button>

                            <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-200">
                                <li>✓ Forums and expired domains analysis</li>
                                <li>✓ {index === 0 ? "300" : index === 1 ? "1000" : "30000"} results per search</li>
                                <li>✓ {index === 0 ? "100" : index === 1 ? "500" : "2000"} backlinks monitored</li>
                                <li>✓ {index === 0 ? "200" : index === 1 ? "1000" : "5000"} Plugin clicks</li>
                                <li>✓ {index === 0 ? "50" : index === 1 ? "250" : "2000"} keyword searches</li>
                                <li>✓ {index === 0 ? "20" : index === 1 ? "100" : "500"} competitive analyses</li>
                                <li>✓ {index === 0 ? "3" : index === 1 ? "15" : "40"} simultaneous bulk competitive</li>
                                <li>✓ {index === 0 ? "0" : index === 1 ? "20" : "100"} bulk keywords</li>
                                <li>✓ {index === 0 ? "0" : index === 1 ? "20" : "50"} SERP Scanner</li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PricingTable;
