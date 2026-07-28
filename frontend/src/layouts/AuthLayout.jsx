import Logo from "../components/common/Logo";
import illustration from "../assets/images/login-illustration.svg";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Login/Register/Forgot Password Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-10">
        <img
          src={illustration}
          alt="Fuel Management System"
          className="w-full max-w-lg"
        />
      </div>
    </div>
  );
}

export default AuthLayout;