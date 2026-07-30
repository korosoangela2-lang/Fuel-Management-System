import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <h1 className="text-6xl font-bold font-mono text-amber-500">404</h1>

      <p className="mt-4 text-lg text-slate-300">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-medium text-slate-950 hover:bg-amber-400"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default NotFound;
