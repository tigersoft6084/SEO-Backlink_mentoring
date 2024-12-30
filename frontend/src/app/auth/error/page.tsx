"use client"

// pages/auth/error.tsx
import { useRouter } from 'next/router';

export default function ErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-red-500">Authentication Error</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
        An error occurred during authentication: {error}
      </p>
    </div>
  );
}
