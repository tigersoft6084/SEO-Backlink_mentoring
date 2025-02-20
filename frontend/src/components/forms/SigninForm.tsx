"use client";

import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext"; // Import the User context
import FormInput from "./SigninInput";
import GoogleAuthButton from "../ui/GoogleSigninButton";
import Link from "next/link";

export default function SigninForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ Add loading state
  const router = useRouter(); // For navigation
  const { setUser } = useUser(); // ✅ Ensure `useUser` is hydrated

  useEffect(() => {
    // Listen for changes to localStorage (when the token is set by the popup)
    const storageListener = () => {
      const userDataString = localStorage.getItem("googleAuthUser");

      if (userDataString) {

        const userData = JSON.parse(userDataString);

        console.log(userData.token)

        sessionStorage.setItem("authToken", JSON.stringify(userData.token));
        sessionStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData);
        localStorage.removeItem("googleAuthUser")

        // Redirect to the dashboard after successful sign-in
        router.push("/dashboard");
      }
    };

    // Add event listener to monitor localStorage changes
    window.addEventListener("storage", storageListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [router, setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // ✅ Set loading state

    try {
      // Send request to Payload CMS login API
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Sign-in failed. Please try again.");
      }

      const data = await response.json();

      console.log(data)

      // ✅ Ensure `window` is available before using `sessionStorage` (avoids SSR issues)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Wrap `setUser` in try/catch to handle errors
      try {
        setUser(data.user);
      } catch (err) {
        console.error("Error setting user in context:", err);
      }

      // ✅ Redirect to dashboard after successful sign-in
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // ✅ Reset loading state
    }
  };

  const goToSignUp = () => {
    router.push("/api/auth/signup"); // Redirect to the sign-up page
  };

  return (
    <div className="mt-12 w-full max-w-md bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign In
        </h2>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <hr className="border-t border-gray-300 dark:border-gray-500 mb-6" />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full"
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full"
        />

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full max-w-md py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md shadow-sm flex items-center gap-x-2 justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                  ></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <BiSearch />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>

      </form>

      <hr className="border-t border-gray-300 dark:border-gray-500 my-6" />

      <div className="flex justify-center">
        <GoogleAuthButton action="signin" /> {/* Centered Google button */}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            onClick={goToSignUp}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}