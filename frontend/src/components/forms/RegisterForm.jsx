import { Link } from "react-router-dom";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import Button from "../common/Button";

function RegisterForm() {
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Register submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Create Account
        </h2>

        <p className="mt-2 text-gray-500">
          Register to use Fuel Management System.
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="Enter your full name"
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <PasswordInput
        label="Password"
        placeholder="Create a password"
      />

      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <Button type="submit">
        Register
      </Button>

      <p className="text-center text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;