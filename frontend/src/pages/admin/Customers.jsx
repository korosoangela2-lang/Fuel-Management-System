import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import CustomerForm from "../../components/forms/CustomerForm";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "../../services/customerService";
import { fetchRegions } from "../../services/regionService";
import { useAuth } from "../../context/useAuth";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Customers() {

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  function loadCustomers() {
    setLoading(true);
    return fetchCustomers()
      .then((result) => setCustomers(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load customers."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadCustomers);
    if (isSuperAdmin) {
      fetchRegions().then((result) => setRegions(result.items || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase();
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(term) ||
      (customer.phone || "").toLowerCase().includes(term) ||
      (customer.email || "").toLowerCase().includes(term)
    );
  }, [customers, search]);

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        toast.success("Customer updated.");
      } else {
        await createCustomer(data);
        toast.success("Customer added.");
      }
      setShowModal(false);
      setEditingCustomer(null);
      await loadCustomers();
    } catch (error) {
      toast.error(error.message || "Could not save this customer.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setSaving(true);
    try {
      await deactivateCustomer(deactivateTarget.id);
      toast.success(`${deactivateTarget.name} deactivated.`);
      setDeactivateTarget(null);
      await loadCustomers();
    } catch (error) {
      toast.error(error.message || "Could not deactivate this customer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-gray-500 mt-1">Manage customer accounts in your region.</p>
          </div>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Customer
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        {loading ? (
          <Loader label="Loading customers..." />
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Orders</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-t">
                      <td className="px-6 py-4">{customer.name}</td>
                      <td className="px-6 py-4">{customer.phone}{customer.email ? ` • ${customer.email}` : ""}</td>
                      <td className="px-6 py-4">{titleCase(customer.customer_type)}</td>
                      <td className="px-6 py-4">{customer.order_count}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${customer.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                          {customer.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingCustomer(customer);
                            setShowModal(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeactivateTarget(customer)}
                          disabled={!customer.is_active}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <Modal
        isOpen={showModal}
        title={editingCustomer ? `Edit ${editingCustomer.name}` : "Add Customer"}
        onClose={() => {
          setShowModal(false);
          setEditingCustomer(null);
        }}
      >
        <CustomerForm
          key={editingCustomer?.id || "new"}
          initialData={editingCustomer || undefined}
          isEditing={!!editingCustomer}
          regions={regions}
          requireRegion={isSuperAdmin}
          submitLabel={editingCustomer ? "Save Changes" : "Add Customer"}
          submitting={saving}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingCustomer(null);
          }}
        />
      </Modal>

      {deactivateTarget && (
        <ConfirmModal
          title="Deactivate Customer"
          message={`Are you sure you want to deactivate ${deactivateTarget.name}?`}
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}

    </AdminLayout>
  );
}

export default Customers;
