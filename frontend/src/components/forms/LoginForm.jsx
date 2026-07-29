import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  // Update form fields
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Submit login form
  async function handleSubmit(e) {
    e.preventDefault();

    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      // Call Flask API
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Save user and token
      login(data.user, data.token);

      toast.success("Login successful!");

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-gray-500">
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
          placeholder="Enter your email"
          className="w-full rounded-lg border p-3"
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
          placeholder="Enter your password"
          className="w-full rounded-lg border p-3"
        />
      </div>

      {/* Remember me */}
      <div className="flex justify-between items-center">
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
          className="text-indigo-600 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 transition"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-600 font-semibold"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;