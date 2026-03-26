import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-red-600">Unauthorized</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to access this page.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
