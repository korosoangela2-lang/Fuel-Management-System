function Topbar() {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h2 className="text-xl font-semibold">
        Admin Panel
      </h2>

      <div className="flex items-center gap-4">

        <span className="text-gray-600">
          Welcome, Admin
        </span>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>

      </div>

    </header>
  );
}

export default Topbar;