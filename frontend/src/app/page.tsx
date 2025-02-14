import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-slate-900">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Welcome to My App!
      </h1>
      <div className="space-x-4">
        <Link href="/api/auth/signin">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Login
          </button>
        </Link>
        <Link href="/api/auth/signup">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
            Signup
          </button>
        </Link>
      </div>
    </main>

  );
}
