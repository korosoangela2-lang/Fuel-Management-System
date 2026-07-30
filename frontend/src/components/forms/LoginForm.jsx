import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Update form values
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Mock login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fake authenticated user
      const userData = {
        id: 1,
        name: "Administrator",
        email: formData.email,
        role: "admin",
      };

      // Fake JWT token
      const token = "demo-jwt-token";

      // Save login in AuthContext
      login(userData, token);

      toast.success("Login successful!");

      // Redirect to Admin Dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Login failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-3 text-gray-600">
          Sign in to your Fuel Management System account.
        </p>
      </div>

      {/* Email */}

      <div>
        <label className="block mb-2 font-medium">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Password */}

      <div>
        <label className="block mb-2 font-medium">
          Password
        </label>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Remember Me */}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />

          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
      >
        Sign In
      </button>

      {/* Register */}

      <p className="text-center">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 font-semibold hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;