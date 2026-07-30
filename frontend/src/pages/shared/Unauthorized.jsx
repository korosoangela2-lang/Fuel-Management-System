import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-5xl font-bold font-mono text-red-400">
          403
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          You do not have permission to access this page.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-lg bg-amber-500 px-5 py-3 text-slate-950 font-medium hover:bg-amber-400"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
