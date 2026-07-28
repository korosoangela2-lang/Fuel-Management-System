function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
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
          outline-none
          transition
          focus:border-blue-600
          focus:ring-2
          focus:ring-blue-200
        "
      />
    </div>
  );
}

export default Input;