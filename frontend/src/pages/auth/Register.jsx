import AuthLayout from "../../layouts/AuthLayout";

function Register() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">
          Registration page coming next.
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;