import { useState } from "react";

function OrderForm({
  initialData = {
    customer: "",
    fuel: "Petrol",
    quantity: "",
    status: "Pending",
  },
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialData);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSave(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="customer"
        value={formData.customer}
        onChange={handleChange}
        placeholder="Customer Name"
        className="w-full border rounded-lg p-3"
        required
      />

      <select
        name="fuel"
        value={formData.fuel}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      >
        <option>Petrol</option>
        <option>Diesel</option>
        <option>Premium Petrol</option>
        <option>Kerosene</option>
      </select>

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity (Litres)"
        className="w-full border rounded-lg p-3"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      >
        <option>Pending</option>
        <option>Approved</option>
        <option>Delivered</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save Order
        </button>

      </div>
    </form>
  );
}

export default OrderForm;