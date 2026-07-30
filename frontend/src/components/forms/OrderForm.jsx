import { useState } from "react";

function OrderForm({
  customers = [],
  fuels = [],
  submitting = false,
  onSave,
  onCancel,
}) {
  const [customerId, setCustomerId] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ fuel_id: "", quantity: "" }]);

  function updateItem(index, field, value) {
    setItems((previous) =>
      previous.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((previous) => [...previous, { fuel_id: "", quantity: "" }]);
  }

  function removeItem(index) {
    setItems((previous) => previous.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const selectedCustomer = customers.find((customer) => customer.id === Number(customerId));

    onSave({
      customer_id: Number(customerId),
      // A super admin has no region of their own, so the order's region is
      // taken from the customer being ordered for (regular admins/staff are
      // pinned to their own region server-side regardless of this value).
      region_id: selectedCustomer?.region_id ?? null,
      items: items
        .filter((item) => item.fuel_id && item.quantity)
        .map((item) => ({ fuel_id: Number(item.fuel_id), quantity: item.quantity })),
      delivery_address: deliveryAddress || null,
      notes: notes || null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border border-slate-700 rounded-lg p-3"
        required
      >
        <option value="" disabled>Select customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <select
              value={item.fuel_id}
              onChange={(e) => updateItem(index, "fuel_id", e.target.value)}
              className="flex-1 border border-slate-700 rounded-lg p-3"
              required
            >
              <option value="" disabled>Select fuel</option>
              {fuels.map((fuel) => (
                <option key={fuel.id} value={fuel.id}>
                  {fuel.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              placeholder="Quantity"
              className="w-32 border border-slate-700 rounded-lg p-3"
              required
            />

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="px-3 py-3 text-red-600"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="text-amber-600 text-sm font-medium"
        >
          + Add another fuel
        </button>
      </div>

      <input
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        placeholder="Delivery address (optional)"
        className="w-full border border-slate-700 rounded-lg p-3"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full border border-slate-700 rounded-lg p-3"
      />

      <div className="flex justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-slate-700 rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Order"}
        </button>

      </div>
    </form>
  );
}

export default OrderForm;
