import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import FuelTable from "../../components/tables/FuelTable";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import FuelForm from "../../components/forms/FuelForm";
import {
  fetchFuels,
  createFuel,
  updateFuel,
  addFuelStock,
  deactivateFuel,
} from "../../services/fuelService";
import { fetchRegions } from "../../services/regionService";
import { useAuth } from "../../context/useAuth";

function statusFor(fuel) {
  if (!fuel.is_active) return "Inactive";
  if (Number(fuel.quantity_available) <= 0) return "Out of Stock";
  if (fuel.is_low_stock) return "Low Stock";
  return "Available";
}

function FuelInventory() {

  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fuels, setFuels] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingFuel, setEditingFuel] = useState(null);
  const [stockFuel, setStockFuel] = useState(null);
  const [stockAmount, setStockAmount] = useState("");
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  function loadFuels() {
    setLoading(true);
    return fetchFuels({ per_page: 100 })
      .then((result) => setFuels(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load fuel inventory."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadFuels);
    if (isSuperAdmin) {
      fetchRegions({ per_page: 100 }).then((result) => setRegions(result.items || [])).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFuels = useMemo(() => {

    return fuels.filter((fuel) => {

      const matchesSearch = fuel.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFor(fuel) === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [fuels, search, statusFilter]);

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (editingFuel) {
        await updateFuel(editingFuel.id, data);
        toast.success("Fuel product updated.");
      } else {
        await createFuel(data);
        toast.success("Fuel product added.");
      }
      setShowModal(false);
      setEditingFuel(null);
      await loadFuels();
    } catch (error) {
      toast.error(error.message || "Could not save this fuel product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddStock(event) {
    event.preventDefault();
    if (!stockAmount || Number(stockAmount) <= 0) {
      toast.error("Enter a valid quantity to add.");
      return;
    }

    setSaving(true);
    try {
      await addFuelStock(stockFuel.id, stockAmount);
      toast.success(`Added ${stockAmount} ${stockFuel.unit_of_measure} to ${stockFuel.name}.`);
      setStockFuel(null);
      setStockAmount("");
      await loadFuels();
    } catch (error) {
      toast.error(error.message || "Could not add stock.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setSaving(true);
    try {
      await deactivateFuel(deactivateTarget.id);
      toast.success(`${deactivateTarget.name} deactivated.`);
      setDeactivateTarget(null);
      await loadFuels();
    } catch (error) {
      toast.error(error.message || "Could not deactivate this fuel product.");
    } finally {
      setSaving(false);
    }
  }

  return (

    <AdminLayout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Fuel Inventory
            </h1>

            <p className="text-slate-400 mt-1">
              Manage all fuel products.
            </p>

          </div>

          <button
            onClick={() => {
              setEditingFuel(null);
              setShowModal(true);
            }}
            className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700"
          >
            + Add Fuel
          </button>

        </div>

        {/* Search + Filter */}

        <div className="bg-slate-900 rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search fuel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2 flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2"
          >

            <option>All</option>
            <option>Available</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
            <option>Inactive</option>

          </select>

        </div>

        {/* Fuel Table */}

        {loading ? (
          <Loader label="Loading fuel inventory..." />
        ) : (
          <FuelTable
            fuels={filteredFuels}
            onEdit={(fuel) => {
              setEditingFuel(fuel);
              setShowModal(true);
            }}
            onAddStock={(fuel) => setStockFuel(fuel)}
            onDeactivate={(fuel) => setDeactivateTarget(fuel)}
          />
        )}

      </div>

      {/* Add / Edit Fuel Modal */}

      <Modal
        isOpen={showModal}
        title={editingFuel ? `Edit ${editingFuel.name}` : "Add Fuel"}
        onClose={() => {
          setShowModal(false);
          setEditingFuel(null);
        }}
      >

        <FuelForm
          key={editingFuel?.id || "new"}
          initialData={
            editingFuel
              ? {
                  name: editingFuel.name,
                  fuel_type: editingFuel.fuel_type || "",
                  unit_price: editingFuel.unit_price,
                  quantity_available: editingFuel.quantity_available,
                  unit_of_measure: editingFuel.unit_of_measure,
                  reorder_level: editingFuel.reorder_level,
                }
              : undefined
          }
          isEditing={!!editingFuel}
          regions={regions}
          requireRegion={isSuperAdmin}
          submitLabel={editingFuel ? "Save Changes" : "Add Fuel"}
          submitting={saving}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingFuel(null);
          }}
        />

      </Modal>

      {/* Add Stock Modal */}

      {stockFuel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl shadow-xl w-full max-w-sm p-6">

            <h2 className="text-xl font-bold mb-4">
              Add Stock — {stockFuel.name}
            </h2>

            <form onSubmit={handleAddStock} className="space-y-4">

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder={`Quantity to add (${stockFuel.unit_of_measure})`}
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
                className="w-full border border-slate-700 rounded-lg px-4 py-2"
                autoFocus
                required
              />

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setStockFuel(null);
                    setStockAmount("");
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Adding..." : "Add Stock"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* Deactivate Confirmation */}

      {deactivateTarget && (
        <ConfirmModal
          title="Deactivate Fuel Product"
          message={`Are you sure you want to deactivate ${deactivateTarget.name}? It will no longer be available for new orders.`}
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}

    </AdminLayout>

  );
}

export default FuelInventory;
