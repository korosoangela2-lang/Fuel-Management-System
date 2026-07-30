function DashboardCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="relative bg-white rounded-2xl shadow p-6 flex justify-between items-center overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">

      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />

      <div>

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2 text-slate-800">
          {value}
        </h2>

      </div>

      <div
        className="text-2xl w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${color}1a`,
          color,
        }}
      >
        {icon}
      </div>

    </div>
  );
}

export default DashboardCard;
