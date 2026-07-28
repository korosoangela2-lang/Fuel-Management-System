import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
      />

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="font-medium text-blue-700 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit">
        Sign In
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-700 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;