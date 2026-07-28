function Button({
  children,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow transition hover:bg-blue-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;