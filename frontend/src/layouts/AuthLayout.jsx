import Logo from "../components/common/Logo";
import illustration from "../assets/images/login-illustration.svg";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Login/Register/Forgot Password Form */}
          {children}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-10 overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10" />
        <img
          src={illustration}
          alt="Fuel Management System"
          className="w-full max-w-lg relative"
        />
      </div>
    </div>
  );
}

export default AuthLayout;
