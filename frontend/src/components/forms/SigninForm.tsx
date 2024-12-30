"use client";

import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";
import FormInput from "./FormInput";
import GoogleAuthButton from "./GoogleSigninButton";

export default function SigninForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For navigation

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
      console.log("Sign-in successful:", data);

      // Redirect to the dashboard after successful sign-in
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const goToSignUp = () => {
    router.push("/auth/signup"); // Redirect to the sign-up page
  };

  return (
    <div className="mt-12 w-full max-w-md bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Sign In
        </h2>
        <a
          href="/auth/forgot-password"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Forgot password?
        </a>
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
          className="w-full" // This makes the input field take the full width
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full" // This makes the input field take the full width
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

      {/* Button to go to the sign-up page */}
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
