import AuthLayout from "../../layouts/AuthLayout";
import LoginForm from "../../components/forms/LoginForm";

function Login() {
  return (
    <AuthLayout>
      <div className="login-wrapper">
        <h1 className="login-title">Welcome Back</h1>

        <p className="login-subtitle">
          Sign in to continue to the Fuel Management System
        </p>

        <LoginForm />
      </div>
    </AuthLayout>
  );
}

export default Login;