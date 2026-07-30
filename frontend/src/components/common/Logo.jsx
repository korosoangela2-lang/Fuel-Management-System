import { FaGasPump } from "react-icons/fa";

function Logo() {
  return (
    <div className="flex flex-col items-center gap-3">

      <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
        <FaGasPump className="text-white text-xl" />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          FuelMS
        </h1>

        <p className="text-slate-500 text-sm">
          Fuel Management System
        </p>
      </div>

    </div>
  );
}

export default Logo;
