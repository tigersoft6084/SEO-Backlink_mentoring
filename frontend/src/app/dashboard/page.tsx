"use client";

import Sidebar from "../../components/common/Sidebar";
import { FaSearch, FaFolderOpen, FaLink } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TbRadarFilled } from "react-icons/tb";
import { useSidebar } from "../../context/SidebarContext";
import { useUser } from "../../context/UserContext";
import { useEffect, useState, useCallback, useMemo, use } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Lazy imports for performance optimization
import dynamic from "next/dynamic";
import { usePlan } from "../../context/UserPlanContext";
import Support from "./support/page";
const KeywordSearch = dynamic(() => import("./keyword-search/page"));
const BulkSearch = dynamic(() => import("./bulk-search/page"));
const CompetitiveAnalysis = dynamic(() => import("./competitive-analysis/page"));
const SerpScanner = dynamic(() => import("./serp-scanner/page"));
const ExpiredDomains = dynamic(() => import("./expired-domains/page"));
const Projects = dynamic(() => import("./projects/page"));
const AccountSettings = dynamic(() => import("./account-settings/page"));
const PricingTable = dynamic(() => import("././quota/page"));


export default function Home() {
  const { user, refreshUser } = useUser();
  const { selectedMenuItem, setSelectedMenuItem } = useSidebar();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedPlanId, selectedPlanName, setPlan, clearPlan } = usePlan();
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState<boolean>(false);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user && pathname !== "/auth/signup" && pathname?.startsWith("/dashboard")) {
      router.push("/api/auth/signin");
    }
  }, [user, router, pathname]);

  // ✅ API call to save subscription
  const saveSubscription = useCallback(
    async (subscriptionId: string, planId: string, planName: string, email: string) => {
      try {
        console.log("🔵 Saving subscription:", { subscriptionId, planId, planName, email });

        const response = await fetch("/api/save-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionId, planId, planName, userEmail: email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save subscription");
        }

        console.log("✅ Subscription saved successfully!");
        return data.features || null;
      } catch (error) {
        console.error("❌ Failed to save subscription:", error);
        return null;
      }
    },
    []
  );

  // ✅ Handle subscription updates
  useEffect(() => {
    const subscriptionId = searchParams?.get("subscription_id");

    if (!user || !subscriptionId) return;

    let { email } = user;
    let planId = selectedPlanId;
    let planName = selectedPlanName;

    // ✅ Retrieve session data if missing
    if (!email || !planId || !planName) {
      const userSession = sessionStorage.getItem("user");
      if (userSession) {
        const parsedSession = JSON.parse(userSession);
        email = parsedSession.email || null;
        planId = sessionStorage.getItem("selectedPlanId") || null;
        planName = sessionStorage.getItem("selectedPlanName") || null;
      }
    }

    if (!email || !planId || !planName) return;

    setSelectedMenuItem("Extend Your Quota");
    setIsUpdatingSubscription(true); // ✅ Set loading state

    // ✅ Function to check subscription status
    const updateSubscription = async () => {
      try {
        if (!subscriptionId || typeof subscriptionId !== "string" || subscriptionId.includes(":")) {
          console.warn("⚠️ Skipping API request due to invalid subscriptionId:", subscriptionId);
          return;
        }

        console.log("🔵 Checking subscription status for:", subscriptionId);
        const response = await fetch(`/api/show-subscription?subscriptionId=${encodeURIComponent(subscriptionId)}`);

        if (!response.ok) {
          throw new Error("Failed to check subscription status");
        }

        const data = await response.json();
        const subscriptionStatus = data.subscriptionStatus;

        console.log("🔵 Subscription Status:", subscriptionStatus);

        if (subscriptionStatus === "ACTIVE") {
          await saveSubscription(subscriptionId, planId, planName, email);
          await refreshUser();
        }
      } catch (error) {
        console.error("❌ Error updating subscription:", error);
      } finally {
        setIsUpdatingSubscription(false);
      }
    };

    updateSubscription();

    sessionStorage.removeItem("selectedPlanId");
    sessionStorage.removeItem("selectedPlanName");
    if (pathname) {
      router.replace(pathname);
    }
  }, [searchParams, pathname, router, setSelectedMenuItem, user, refreshUser, saveSubscription, selectedPlanId, selectedPlanName, clearPlan]);

  // ✅ Sidebar menu items
  const menuItems = useMemo(
    () => [
      { name: "Bulk Search", icon: <FaSearch />, description: "Search in bulk for multiple domains at once." },
      { name: "Keyword Search", icon: <FcGoogle />, description: "Search keywords on Google to analyze rankings." },
      { name: "Competitive Analysis", icon: <TbRadarFilled />, description: "Analyze competitors' domains and backlinks." },
      { name: "Projects", icon: <FaFolderOpen />, description: "Manage and organize your projects here." },
      { name: "Expired Domains", icon: <FaLink />, description: "Find expired domains for backlink opportunities." },
      { name: "Serp Scanner", icon: <FcGoogle />, description: "Scan Google SERPs to track keyword rankings." },
    ],
    []
  );

  // ✅ Quota usage information
  const quotaUsed = useMemo(
    () => [
      {
        name: "Backlinks",
        value: user?.usedFeatures?.backlinks ?? 0,
        max: user?.subscriptionId ? user?.features?.backlinks ?? 3 : 3,
      },
      {
        name: "Plugin",
        value: user?.usedFeatures?.plugin ?? 0,
        max: user?.subscriptionId ? user?.features?.plugin ?? 3 : 3,
      },
      {
        name: "Keyword Searches",
        value: user?.usedFeatures?.keywordSearches ?? 0,
        max: user?.subscriptionId ? user?.features?.keywordSearches ?? 3 : 3,
      },
      {
        name: "Competitive Analysis",
        value: user?.usedFeatures?.competitiveAnalysis ?? 0,
        max: user?.subscriptionId ? user?.features?.competitiveAnalysis ?? 1 : 1,
      },
      {
        name: "SERP Scanner",
        value: user?.usedFeatures?.serpScanner ?? 0,
        max: user?.subscriptionId ? user?.features?.SerpScanner ?? 0 : 0,
      }
    ],
    [user]
  );

  // ✅ Render selected page content
  const renderContent = useMemo(() => {
    switch (selectedMenuItem) {
      case "Bulk Search":
        return <BulkSearch />;
      case "Keyword Search":
        return <KeywordSearch />;
      case "Competitive Analysis":
        return <CompetitiveAnalysis />;
      case "Projects":
        return <Projects />;
      case "Expired Domains":
        return <ExpiredDomains />;
      case "Serp Scanner":
        return <SerpScanner />;
      case "Extend Your Quota":
        return <PricingTable isUpdatingSubscription={isUpdatingSubscription} />;
      case "Account Settings":
        return <AccountSettings />;
      case "Support" :
        return <Support/>;
      default:
        return <div />;
    }
  }, [selectedMenuItem, isUpdatingSubscription]);

  return (
    <div className="flex flex-col dark:bg-slate-900 mt-20">
      <div className="h-fit flex flex-1">
        <div className="flex-shrink-0">
        <Sidebar menuItems={menuItems} quotaUsed={quotaUsed}  />
        </div>

        <div className="flex-1">{renderContent}</div>
      </div>
    </div>

  );
}
