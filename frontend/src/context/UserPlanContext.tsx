"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext"; // If you already have a user context

interface UserPlanData {
    planId?: string;
    subscriptionId?: string;
    planName?: string;
    features?: {
        resultsPerSearch?: number;
        backlinks?: number;
        plugin?: number;
        keywordSearches?: number;
        competitiveAnalysis?: number;
        bulkCompetitive?: number;
        bulkKeywords?: number;
        SerpScanner?: number;
    };
}

interface UserPlanContextType {
    userPlanData: UserPlanData | null;
    loading: boolean;
    refreshUserPlan: () => void;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

export const UserPlanProvider = ({ children }: { children: React.ReactNode }) => {
    const { email } = useUser(); // Get user email from auth context
    const [userPlanData, setUserPlanData] = useState<UserPlanData | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch user plan data
    const fetchUserPlan = async () => {
        if (!email) return;

        try {
            const response = await fetch(`http://localhost:2024/api/get-user-plan?email=${email}`);
            const data = await response.json();

            if (data.userPlanData) {
                setUserPlanData(data.userPlanData);
            }
        } catch (error) {
            console.error("Error fetching user plan:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh function to update user plan
    const refreshUserPlan = () => {
        setLoading(true);
        fetchUserPlan();
    };

    // Fetch user plan on mount
    useEffect(() => {
        fetchUserPlan();
    }, [email]);

    return (
        <UserPlanContext.Provider value={{ userPlanData, loading, refreshUserPlan }}>
            {children}
        </UserPlanContext.Provider>
    );
};

// Custom hook to use the UserPlanContext
export const useUserPlan = () => {
    const context = useContext(UserPlanContext);
    if (!context) {
        throw new Error("useUserPlan must be used within a UserPlanProvider");
    }
    return context;
};
