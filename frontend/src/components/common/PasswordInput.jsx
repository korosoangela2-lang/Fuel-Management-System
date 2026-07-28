import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function PasswordInput({
  label,
  name,
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            px-4
            py-3
            pr-12
            outline-none
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-200
          "
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;