import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function PasswordInput({
  label,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            bg-slate-50
            px-4
            py-3
            pr-12
            outline-none
            transition
            duration-200
            focus:border-blue-600
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-700"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;