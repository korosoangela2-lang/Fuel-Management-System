import { useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const page = location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replaceAll("-", " ");

  return (
    <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200">

      <span className="text-xs text-slate-400">
        Home /
      </span>

      <span className="ml-1.5 text-xs font-medium text-slate-600 capitalize">
        {page}
      </span>

    </div>
  );
}

export default Breadcrumb;
