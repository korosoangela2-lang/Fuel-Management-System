function Input({
  label,
  type = "text",
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Input;