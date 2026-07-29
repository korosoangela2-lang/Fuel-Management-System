import { Link } from "react-router-dom";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";

function LoginForm() {
  const handleSubmit = (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    // We'll connect this to the Flask backend later
    console.log("Login submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Heading */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <p className="mt-2 text-gray-500">
          Sign in to your Fuel Management System account.
        </p>
      </div>

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      {/* Password Input */}
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
      />

      {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          <span className="text-gray-600">
            Remember me
          </span>
        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <Button type="submit">
        Sign In
      </Button>

      {/* Register Link */}
      <p className="text-center text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;