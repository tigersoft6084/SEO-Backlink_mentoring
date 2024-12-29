// components/GoogleSignUpButton.tsx
import { signIn, getSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignUpButton = () => {
    const handleGoogleSignIn = async () => {
      try {
        // Trigger Google sign-in using NextAuth
        const result = await signIn("google", { redirect: false });

        console.log(result); // Log the result to see its structure and value

        if (result?.error) {
            console.error("Google Sign-In failed:", result.error);
        return;
        } else {
            console.log("Google Sign-In successful:", result);
            // You can perform any further actions after success here (e.g., redirect, update state)
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
          body: JSON.stringify({ idToken }),
        });
  
        if (!response.ok) {
          throw new Error("Google authentication failed");
        }
  
        const data = await response.json();
        console.log("Google sign-up successful:", data);
        // Redirect to homepage or dashboard
        window.location.href = "/";
      } catch (err) {
        console.error("Google Sign-In failed:", err);
      }
    };
  
    return (
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-x-2 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <FcGoogle />
        <span>Sign Up with Google</span>
      </button>
    );
  };
  

export default GoogleSignUpButton;
