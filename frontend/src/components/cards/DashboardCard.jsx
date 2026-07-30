function DashboardCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="relative bg-slate-900 rounded-xl shadow p-5 overflow-hidden border border-slate-800">

      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: color }}
      />

      <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <h2
        className="text-3xl font-bold mt-2 font-mono"
        style={{ color }}
      >
        {value}
      </h2>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      )}

    </div>
  );
}

export default DashboardCard;
