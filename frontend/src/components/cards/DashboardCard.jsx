function DashboardCard({
  title,
  value,
  color,
  icon,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div
        className="text-4xl p-4 rounded-full text-white"
        style={{
          backgroundColor: color,
        }}
      >
        {icon}
      </div>

    </div>
  );
}

export default DashboardCard;