import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";
import { registerUser, fetchRegistrationRegions } from "../../services/authService";
import { useAuth } from "../../context/useAuth";
import { homeRouteFor } from "../../utils/roles";

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [regions, setRegions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    regionId: "",
  });

  useEffect(() => {
    fetchRegistrationRegions()
      .then(setRegions)
      .catch(() => toast.error("Could not load regions. Please try again later."));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        region_id: Number(formData.regionId),
      });

      login(result.user, result.access_token);
      toast.success("Account created!");
      navigate(homeRouteFor(result.user.role));
    } catch (error) {
      toast.error(error.message || "Unable to register.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Create Account
        </h2>

        <p className="mt-2 text-slate-400">
          Register to use Fuel Management System.
        </p>
      </div>

      <Input
        label="Username"
        name="username"
        placeholder="Choose a username"
        value={formData.username}
        onChange={handleChange}
        autoComplete="username"
        required
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        required
      />

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Region
        </label>
        <select
          name="regionId"
          value={formData.regionId}
          onChange={handleChange}
          required
          className="w-full border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-900 text-slate-100"
        >
          <option value="" disabled>
            Select your region
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        required
      />

      <Button type="submit" disabled={submitting}>
        {submitting ? "Creating account..." : "Register"}
      </Button>

      <p className="text-center text-slate-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-amber-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
