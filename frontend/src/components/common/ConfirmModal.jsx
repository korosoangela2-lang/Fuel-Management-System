function ConfirmModal({
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-800">

        <h2 className="text-2xl font-bold mb-4 text-white">
          {title}
        </h2>

        <p className="text-slate-300 mb-8">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-5 py-2 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;