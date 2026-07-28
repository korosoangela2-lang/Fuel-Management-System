import Input from "./Input";

function PasswordInput({ label, placeholder }) {
  return (
    <Input
      label={label}
      type="password"
      placeholder={placeholder}
    />
  );
}

export default PasswordInput;