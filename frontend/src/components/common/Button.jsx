function Button({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        rounded-lg
        bg-blue-700
        px-4
        py-3
        font-semibold
        text-white
        transition
        duration-200
        hover:bg-blue-800
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;