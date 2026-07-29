import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";

function ForgotPasswordForm() {
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Reset password");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Forgot Password
        </h2>

        <p className="mt-2 text-gray-500">
          Enter your email to receive a password reset link.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <Button type="submit">
        Send Reset Link
      </Button>

      <p className="text-center">
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;