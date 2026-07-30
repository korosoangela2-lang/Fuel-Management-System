import { useState } from "react";

function CustomerForm({
  initialData = {
    name: "",
    email: "",
    phone: "",
    address: "",
    customer_type: "individual",
    credit_limit: "0",
  },
  submitLabel = "Add Customer",
  submitting = false,
  isEditing = false,
  regions = [],
  requireRegion = false,
  onSubmit,
  onCancel,
}) {
  const [customer, setCustomer] = useState(initialData);
  const [regionId, setRegionId] = useState(initialData.region_id || "");

  function handleChange(e) {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...customer,
      ...(requireRegion && !isEditing ? { region_id: Number(regionId) } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {requireRegion && !isEditing && (
        <div>
          <label className="block mb-2 font-medium">Region</label>
          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
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
        <label className="block mb-2 font-medium">Customer Name</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={customer.email || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={customer.address || ""}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium">Customer Type</label>
          <select
            name="customer_type"
            value={customer.customer_type}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="government">Government</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Credit Limit (KES)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="credit_limit"
            value={customer.credit_limit}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
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
          disabled={submitting}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>

    </form>
  );
}

export default CustomerForm;
