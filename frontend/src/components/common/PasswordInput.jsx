import Input from "./Input";

function PasswordInput({
  label,
  placeholder,
  name,
  value,
  onChange,
  required = false,
  autoComplete,
}) {
  return (
    <Input
      label={label}
      type="password"
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete={autoComplete}
    />
  );
}

export default PasswordInput;
