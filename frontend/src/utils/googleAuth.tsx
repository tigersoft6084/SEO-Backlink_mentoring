// utils/googleAuth.ts
import { signIn, getSession } from "next-auth/react";

export const handleGoogleAuth = async (action: 'signin' | 'signup') => {
  try {
    // Trigger Google sign-in/signup using NextAuth
    const result = await signIn("google", { redirect: false });
    console.log(result); // Log the result to see its structure and value

    if (result?.error) {
      console.error(`${action.charAt(0).toUpperCase() + action.slice(1)} failed:`, result.error);
      return;
    } else {
      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} successful:`, result);
    }

    // Extract the Google ID token from the session
    const session = await getSession();
    const idToken = session?.idToken;
    if (!idToken) {
      console.error("No ID Token found.");
      return;
    }

    // Send the token to your backend
    const response = await fetch("/api/googleAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken, action }),
    });

    if (!response.ok) {
      throw new Error(`${action.charAt(0).toUpperCase() + action.slice(1)} failed`);
    }

    const data = await response.json();
    console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} successful:`, data);
    // Redirect to homepage or dashboard
    window.location.href = "/";
  } catch (err) {
    console.error(`${action.charAt(0).toUpperCase() + action.slice(1)} failed:`, err);
  }
};
