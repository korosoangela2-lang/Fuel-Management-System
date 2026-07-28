import Logo from "../components/common/Logo";

function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden bg-blue-700 lg:flex flex-col justify-center px-20 text-white">
        <Logo />

        <h2 className="mt-12 text-5xl font-bold leading-tight">
          Manage Fuel
          <br />
          Operations
          <br />
          Efficiently
        </h2>

        <p className="mt-6 max-w-md text-lg text-blue-100">
          Monitor inventory, customer orders,
          deliveries and reporting from one
          centralized platform.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;