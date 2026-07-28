import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";

function LoginForm() {
  return (
    <form className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <p className="text-gray-500 mt-2">
          Sign in to continue to FuelMS.
        </p>
      </div>

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      {/* Password */}
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
      />

      {/* Remember Me */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300"
          />

          <span>Remember me</span>
        </label>

        <button
          type="button"
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <Button type="submit">
        Sign In
      </Button>

      {/* Register Link */}
      <p className="text-center text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </form>
  );
}

export default LoginForm;