import { FaGasPump } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex flex-col items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
        <FaGasPump className="text-white text-xl" />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          FuelMS
        </h1>

        <p className="text-slate-400 text-sm">
          Fuel Management System
        </p>
      </div>

    </div>
  );
}

export default Logo;
