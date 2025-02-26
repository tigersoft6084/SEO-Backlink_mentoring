"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import

export default function Privacy() {
  const router = useRouter();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const currentPath = window.location.pathname; // Get the current path of the page

//     // Check if the URL contains the 'page=privacy-policy' query parameter
//     if (urlParams.get("page") === "privacy-policy" && currentPath !== "/privacy-policy") {
//       // If the parameter is 'privacy-policy' and you're not already on the /privacy-policy page, redirect
//       router.push("/privacy-policy");
//     }

//     // Skip redirect to signin if we're on the /privacy-policy page
//     if (currentPath === "/privacy-policy") {
//       return; // Skip any further checks and redirects for the /privacy-policy page
//     }

//     // Prevent redirect to the signin page if there's no user data in localStorage
//     const userData = localStorage.getItem("userData");
//     if (!userData && currentPath !== "/api/auth/signin") {
//       // If there's no user data and the current page is not /signin, redirect to /signin
//       router.push("/privacy-policy");
//     }

//   }, [router]);

  return (
    <div className="flex flex-row justify-center items-center h-screen mx-auto space-x-48" style={{ marginTop: "-100px" }}>
      <div className="flex flex-col">
        {/* Any other content can go here */}
      </div>
      <div className="flex flex-col mx-auto text-center items-center">
        <h5 className="text-gray-500 dark:text-gray-400 text-lg font-semibold mt-4 loaderL">
          Chrome Extension
        </h5>
      </div>
    </div>
  );
}
