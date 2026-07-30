import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import CustomerForm from "../../components/forms/CustomerForm";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
} from "../../services/customerService";
import { fetchRegions } from "../../services/regionService";
import { useAuth } from "../../context/useAuth";
import { useDebounce } from "../../hooks/useDebounce";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Customers() {

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  function loadCustomers() {
    setLoading(true);
    const params = { page };
    if (debouncedSearch) params.search = debouncedSearch;

    return fetchCustomers(params)
      .then((result) => {
        setCustomers(result.items || []);
        setMeta(result.meta || null);
      })
      .catch((error) => toast.error(error.message || "Could not load customers."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadCustomers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page]);

  useEffect(() => {
    void Promise.resolve().then(() => setPage(1));
  }, [debouncedSearch]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchRegions({ per_page: 100 }).then((result) => setRegions(result.items || [])).catch(() => {});
    }
  }, [isSuperAdmin]);

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
            <p className="text-slate-400 mt-1">Manage customer accounts in your region.</p>
          </div>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowModal(true);
            }}
            className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700"
          >
            + Add Customer
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2 w-full"
          />
        </div>

        {loading ? (
          <Loader label="Loading customers..." />
        ) : (
          <div className="bg-slate-900 rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-800">
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
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-t border-slate-800">
                      <td className="px-6 py-4">{customer.name}</td>
                      <td className="px-6 py-4">{customer.phone}{customer.email ? ` • ${customer.email}` : ""}</td>
                      <td className="px-6 py-4">{titleCase(customer.customer_type)}</td>
                      <td className="px-6 py-4">{customer.order_count}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${customer.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                          {customer.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingCustomer(customer);
                            setShowModal(true);
                          }}
                          className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
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

            <Pagination meta={meta} onPageChange={setPage} />
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
