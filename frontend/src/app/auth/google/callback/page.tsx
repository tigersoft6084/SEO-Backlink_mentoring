"use client"; // Ensure this page is client-side

import { useEffect } from "react";

const GoogleCallbackPage = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userData = urlParams.get("userData");

        if (userData) {

            // Store the token in localStorage
            localStorage.setItem("googleAuthUser", userData);
            window.close(); // Close the popup after saving the token
        } else {
            console.error("Token not found in the URL.");
        }
    }, []);

    return <div>Loading...</div>;
};

export default GoogleCallbackPage;
