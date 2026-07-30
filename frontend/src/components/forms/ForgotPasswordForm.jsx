import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../common/Input";
import Button from "../common/Button";
import { requestPasswordReset } from "../../services/authService";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success("If that email is registered, a reset link has been sent.");
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Forgot Password
        </h2>

        <p className="mt-2 text-slate-500">
          Enter your email to receive a password reset link.
        </p>
      </div>

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />

      <Button type="submit" disabled={submitting || sent}>
        {submitting ? "Sending..." : sent ? "Link sent" : "Send Reset Link"}
      </Button>

      <p className="text-center">
        <Link
          to="/login"
          className="text-indigo-600 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
