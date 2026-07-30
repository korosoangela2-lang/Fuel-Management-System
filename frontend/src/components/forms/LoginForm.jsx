import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/useAuth";
import { loginUser } from "../../services/authService";
import { homeRouteFor } from "../../utils/roles";

function LoginForm() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  }

  async function handleSubmit(event) {

    event.preventDefault();
    setSubmitting(true);

    try {
      const result = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      login(result.user, result.access_token);

      toast.success("Login successful!");

      navigate(homeRouteFor(result.user.role));
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Username */}

      <div>

        <label className="block mb-2 font-medium">
          Username
        </label>

        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-slate-700 rounded-lg px-4 py-2"
          autoComplete="username"
          required
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border border-slate-700 rounded-lg px-4 py-2"
          autoComplete="current-password"
          required
        />

      </div>

      {/* Forgot password */}

      <div className="flex items-center justify-end">

        <Link
          to="/forgot-password"
          className="text-amber-600 hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Signing in..." : "Login"}
      </button>

      {/* Register Link */}

      <p className="text-center">

        Don't have an account?{" "}

        <Link
          to="/register"
          className="text-amber-600 hover:underline"
        >
          Register
        </Link>

      </p>

    </form>

  );

}

export default LoginForm;
