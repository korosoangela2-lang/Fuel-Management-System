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
    role: "admin",
  });

  function handleChange(event) {

    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  }

  function handleSubmit(event) {

    event.preventDefault();

    const user = {

      id: 1,

      name:
        formData.role === "admin"
          ? "Administrator"
          : "Bruce James",

      email: formData.email,

      role: formData.role,

    };

    login(user, "demo-token");

    toast.success("Login successful!");

    if (formData.role === "admin") {

      navigate("/admin/dashboard");

    } else {

      navigate("/dashboard");

    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Email */}

      <div>

        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
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
          className="w-full border rounded-lg px-4 py-2"
          required
        />

      </div>

      {/* Login As */}

      <div>

        <label className="block mb-2 font-medium">
          Login As
        </label>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >

          <option value="admin">
            Administrator
          </option>

          <option value="customer">
            Customer
          </option>

        </select>

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

          Remember Me

        </label>

        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        Login
      </button>

      {/* Register Link */}

      <p className="text-center">

        Don't have an account?{" "}

        <Link
          to="/register"
          className="text-blue-600 hover:underline"
        >
          Register
        </Link>

      </p>

    </form>

  );

}

export default LoginForm;