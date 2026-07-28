import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/forms/LoginForm";

function Login() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back
          </h1>

          <p className="text-slate-500">
            Sign in to continue to your account.
          </p>
        </div>

        <LoginForm />
      </div>
    </AuthLayout>
  );
}

export default Login;