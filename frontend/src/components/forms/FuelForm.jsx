import { useState } from "react";

function FuelForm({
  onSubmit,
  onCancel,
}) {
  const [fuel, setFuel] = useState({
    name: "",
    price: "",
    stock: "",
    status: "Available",
  });

  function handleChange(e) {
    setFuel({
      ...fuel,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      ...fuel,
      price: Number(fuel.price),
      stock: Number(fuel.stock),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div>

        <label className="block mb-2 font-medium">
          Fuel Name
        </label>

        <input
          type="text"
          name="name"
          value={fuel.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Price per Liter
        </label>

        <input
          type="number"
          name="price"
          value={fuel.price}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Stock Quantity
        </label>

        <input
          type="number"
          name="stock"
          value={fuel.stock}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

      </div>

      <div>

        <label className="block mb-2 font-medium">
          Status
        </label>

        <select
          name="status"
          value={fuel.status}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >

          <option>Available</option>

          <option>Low Stock</option>

          <option>Out of Stock</option>

        </select>

      </div>

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Fuel
        </button>

      </div>

    </form>
  );
}

export default FuelForm;