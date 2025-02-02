"use client";

import { useState } from "react";
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
    router.push("/auth/signup"); // Redirect to the sign-up page
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
            className="w-full max-w-md py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md shadow-sm hover:from-blue-600 hover:to-purple-600 flex items-center gap-x-2 justify-center"
          >
            <BiSearch />
            <span>Sign In</span>
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
