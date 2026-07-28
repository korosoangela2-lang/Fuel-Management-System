import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>

      <p className="mt-4 text-lg text-slate-600">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default NotFound;