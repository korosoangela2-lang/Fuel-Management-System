function Button({
  children,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
    >
      {children}
    </button>
  );
}

export default Button;