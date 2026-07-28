function Button({
  children,
  type = "button",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        w-full
        rounded-xl
        bg-blue-700
        py-3.5
        text-base
        font-semibold
        text-white
        shadow-lg
        transition
        duration-300
        hover:bg-blue-800
        hover:shadow-xl
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;