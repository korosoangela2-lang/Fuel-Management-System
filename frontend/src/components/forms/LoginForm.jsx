import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Backend login will be added later
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="form-group">
        <label>Email Address</label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="login-options">
        <label className="remember">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
          />

          Remember me
        </label>

        <Link to="/forgot-password">
          Forgot Password?
        </Link>
      </div>

      <button type="submit" className="login-btn">
        Login
      </button>

      <div className="register-link">
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </div>
    </form>
  );
}

export default LoginForm;