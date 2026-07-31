import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import {
  fetchRegions,
  createRegion,
  updateRegion,
  deactivateRegion,
} from "../../services/regionService";
import {
  fetchRefineries,
  createRefinery,
  updateRefinery,
  deactivateRefinery,
} from "../../services/refineryService";

function SystemSettings() {
  const [regions, setRegions] = useState([]);
  const [refineries, setRefineries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [regionForm, setRegionForm] = useState({ name: "", code: "" });
  const [refineryForm, setRefineryForm] = useState({ name: "", location: "", capacity: "", region_id: "" });

  function loadAll() {
    setLoading(true);
    return Promise.all([fetchRegions({ per_page: 100 }), fetchRefineries({ per_page: 100 })])
      .then(([regionResult, refineryResult]) => {
        setRegions(regionResult.items || []);
        setRefineries(refineryResult.items || []);
      })
      .catch((error) => toast.error(error.message || "Could not load system settings."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadAll);
  }, []);

  async function handleAddRegion(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await createRegion(regionForm);
      toast.success("Region added.");
      setRegionForm({ name: "", code: "" });
      await loadAll();
    } catch (error) {
      toast.error(error.message || "Could not add region.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleRegion(region) {
    setSaving(true);
    try {
      if (region.is_active) {
        await deactivateRegion(region.id);
      } else {
        await updateRegion(region.id, { is_active: true });
      }
      await loadAll();
    } catch (error) {
      toast.error(error.message || "Could not update this region.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddRefinery(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await createRefinery({
        name: refineryForm.name,
        location: refineryForm.location || null,
        capacity: refineryForm.capacity,
        region_id: refineryForm.region_id ? Number(refineryForm.region_id) : null,
      });
      toast.success("Refinery added.");
      setRefineryForm({ name: "", location: "", capacity: "", region_id: "" });
      await loadAll();
    } catch (error) {
      toast.error(error.message || "Could not add refinery.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleRefinery(refinery) {
    setSaving(true);
    try {
      if (refinery.is_active) {
        await deactivateRefinery(refinery.id);
      } else {
        await updateRefinery(refinery.id, { is_active: true });
      }
      await loadAll();
    } catch (error) {
      toast.error(error.message || "Could not update this refinery.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loader label="Loading system settings..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-slate-400 mt-1">Manage regions and refineries across the platform.</p>
        </div>

        {/* Regions */}
        <div className="bg-slate-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Regions</h2>

          <form onSubmit={handleAddRegion} className="flex flex-wrap gap-3 mb-6">
            <input
              placeholder="Region name"
              value={regionForm.name}
              onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2"
              required
            />
            <input
              placeholder="Code (e.g. NRB)"
              value={regionForm.code}
              onChange={(e) => setRegionForm({ ...regionForm, code: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2 w-40"
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-60"
            >
              Add Region
            </button>
          </form>

          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400">
                <th className="py-2">Name</th>
                <th className="py-2">Code</th>
                <th className="py-2">Users</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-t border-slate-800">
                  <td className="py-3">{region.name}</td>
                  <td className="py-3">{region.code}</td>
                  <td className="py-3">{region.user_count}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${region.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                      {region.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleToggleRegion(region)}
                      disabled={saving}
                      className="text-amber-600 text-sm font-medium hover:underline disabled:opacity-50"
                    >
                      {region.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Refineries */}
        <div className="bg-slate-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Refineries</h2>

          <form onSubmit={handleAddRefinery} className="flex flex-wrap gap-3 mb-6">
            <input
              placeholder="Refinery name"
              value={refineryForm.name}
              onChange={(e) => setRefineryForm({ ...refineryForm, name: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2"
              required
            />
            <input
              placeholder="Location"
              value={refineryForm.location}
              onChange={(e) => setRefineryForm({ ...refineryForm, location: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Capacity"
              value={refineryForm.capacity}
              onChange={(e) => setRefineryForm({ ...refineryForm, capacity: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2 w-32"
              required
            />
            <select
              value={refineryForm.region_id}
              onChange={(e) => setRefineryForm({ ...refineryForm, region_id: e.target.value })}
              className="border border-slate-700 rounded-lg px-4 py-2 bg-slate-900 text-slate-100"
              required
            >
              <option value="" disabled>Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-60"
            >
              Add Refinery
            </button>
          </form>

          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400">
                <th className="py-2">Name</th>
                <th className="py-2">Location</th>
                <th className="py-2">Capacity</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refineries.map((refinery) => (
                <tr key={refinery.id} className="border-t border-slate-800">
                  <td className="py-3">{refinery.name}</td>
                  <td className="py-3">{refinery.location || "—"}</td>
                  <td className="py-3">{Number(refinery.capacity).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${refinery.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                      {refinery.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleToggleRefinery(refinery)}
                      disabled={saving}
                      className="text-amber-600 text-sm font-medium hover:underline disabled:opacity-50"
                    >
                      {refinery.is_active ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </AdminLayout>
  );
}

export default SystemSettings;
