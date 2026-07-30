function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center hover:shadow-xl transition">

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div
        className="text-white text-3xl p-4 rounded-full"
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