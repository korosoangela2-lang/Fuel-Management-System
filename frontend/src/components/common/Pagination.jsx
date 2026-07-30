function Pagination({ meta, onPageChange }) {
  if (!meta || meta.pages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 text-sm text-slate-400">
      <span>
        Page {meta.page} of {meta.pages} · {meta.total} total
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.has_prev}
          className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          Prev
        </button>

        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.has_next}
          className="px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
