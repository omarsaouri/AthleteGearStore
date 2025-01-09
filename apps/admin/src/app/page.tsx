import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="space-y-4">
          <Link
            href="/register"
            className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="w-full block text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
