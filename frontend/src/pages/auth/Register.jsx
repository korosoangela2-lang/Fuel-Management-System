import AuthLayout from "../../layouts/AuthLayout";

function Register() {
  return (
    <AuthLayout>

      <h2 className="text-3xl font-bold text-gray-800">
        Create Account
      </h2>

      <p className="text-gray-500 mt-2">
        Register to use FuelMS.
      </p>

    </AuthLayout>
  );
}

export default Register;