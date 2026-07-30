function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      <span className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
