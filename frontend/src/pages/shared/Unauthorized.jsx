import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">
          403
        </h1>

        <p className="mt-4 text-lg">
          You do not have permission to access this page.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-white"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;