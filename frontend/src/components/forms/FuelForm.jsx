import { useState } from "react";

function FuelForm({
  initialData = {
    name: "",
    fuel_type: "",
    unit_price: "",
    quantity_available: "",
    unit_of_measure: "litres",
    reorder_level: "",
  },
  submitLabel = "Add Fuel",
  submitting = false,
  isEditing = false,
  regions = [],
  requireRegion = false,
  onSubmit,
  onCancel,
}) {
  const [fuel, setFuel] = useState(initialData);
  const [regionId, setRegionId] = useState(initialData.region_id || "");

  function handleChange(e) {
    setFuel({
      ...fuel,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      name: fuel.name,
      fuel_type: fuel.fuel_type || null,
      unit_price: fuel.unit_price,
      quantity_available: fuel.quantity_available,
      unit_of_measure: fuel.unit_of_measure,
      reorder_level: fuel.reorder_level,
      ...(requireRegion && !isEditing ? { region_id: Number(regionId) } : {}),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {requireRegion && !isEditing && (
        <div>

          <label className="block mb-2 font-medium">
            Region
          </label>

          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            className="w-full border border-slate-700 rounded-lg px-4 py-2 bg-slate-900 text-slate-100"
            required
          >
            <option value="" disabled>Select region</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>

        </div>
      )}

      <div>

        <label className="block mb-2 font-medium">
          Fuel Name
        </label>

        <input
          type="text"
          name="name"
          value={fuel.name}
          onChange={handleChange}
          className="w-full border border-slate-700 rounded-lg px-4 py-2"
          required
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Fuel Type
        </label>

        <input
          type="text"
          name="fuel_type"
          placeholder="e.g. diesel, petrol, kerosene"
          value={fuel.fuel_type || ""}
          onChange={handleChange}
          className="w-full border border-slate-700 rounded-lg px-4 py-2"
        />

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>

          <label className="block mb-2 font-medium">
            Unit Price (KES)
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            name="unit_price"
            value={fuel.unit_price}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg px-4 py-2"
            required
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Unit of Measure
          </label>

          <input
            type="text"
            name="unit_of_measure"
            value={fuel.unit_of_measure}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg px-4 py-2"
            required
          />

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div>

          <label className="block mb-2 font-medium">
            Stock Quantity
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            name="quantity_available"
            value={fuel.quantity_available}
            onChange={handleChange}
            disabled={isEditing}
            className="w-full border border-slate-700 rounded-lg px-4 py-2 disabled:bg-slate-800 disabled:text-slate-400"
            required={!isEditing}
          />

          {isEditing && (
            <p className="mt-1 text-xs text-slate-400">
              Use "Add Stock" from the table to adjust quantity.
            </p>
          )}

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Reorder Level
          </label>

          <input
            type="number"
            step="0.01"
            min="0"
            name="reorder_level"
            value={fuel.reorder_level}
            onChange={handleChange}
            className="w-full border border-slate-700 rounded-lg px-4 py-2"
            required
          />

        </div>

      </div>

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-slate-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>

      </div>

    </form>
  );
}

export default FuelForm;
