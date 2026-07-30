function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
