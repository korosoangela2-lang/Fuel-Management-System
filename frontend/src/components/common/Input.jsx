function Input({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required = false,
  autoComplete,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
}

export default Input;
