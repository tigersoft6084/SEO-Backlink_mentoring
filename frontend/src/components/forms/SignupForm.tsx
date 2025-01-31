"use client";

import { useState } from "react";
import FormInput from "./SigninInput";
import { BiLogInCircle } from "react-icons/bi";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import GoogleAuthButton from "../ui/GoogleSigninButton";
import Link from "next/link";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter(); // Initialize the useRouter hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed. Please try again.");
      }

      const data = await response.json();
      setSuccess("Sign-up successful! Redirecting...");

      console.log("Signup successful:", data);

      // Redirect to the sign-in page after a successful sign-up
      router.push("/auth/signin"); // Redirect to the sign-in page
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="mt-12 w-full max-w-lg bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sign Up</h2>

        {/* Google Sign-Up Button */}
        <GoogleAuthButton action="signup" />
      </div>

      <hr className="border-t border-gray-300 dark:border-gray-500 mb-6" />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="flex items-center mt-4">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
          >
            I agree to the{" "}
            <a href="#" className="text-blue-600 font-medium">
              Terms and Conditions
            </a>
          </label>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={!formData.terms}  // Disable the button if 'terms' is false
            className={`w-full py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md shadow-sm hover:from-blue-600 hover:to-purple-600 flex items-center gap-x-2 justify-center max-w-xs ${!formData.terms ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <BiLogInCircle />
            <span>Sign Up</span>
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
