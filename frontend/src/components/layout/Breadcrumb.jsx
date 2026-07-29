import { useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const page = location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace("-", " ");

  return (
    <div className="px-6 py-3 bg-gray-50 border-b">

      <span className="text-sm text-gray-500">
        Home /
      </span>

      <span className="ml-2 font-medium capitalize">
        {page}
      </span>

    </div>
  );
}

export default Breadcrumb;