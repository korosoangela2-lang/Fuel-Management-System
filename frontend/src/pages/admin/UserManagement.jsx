import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import { fetchUsers, createUser, updateUser, deactivateUser } from "../../services/userService";
import { fetchRegions } from "../../services/regionService";

const ROLES = ["super_admin", "regional_admin", "user"];

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const emptyForm = { username: "", email: "", password: "", role: "user", region_id: "" };

function UserManagement() {

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  function loadUsers() {
    setLoading(true);
    return fetchUsers()
      .then((result) => setUsers(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load users."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadUsers);
    fetchRegions().then((result) => setRegions(result.items || [])).catch(() => {});
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) =>
      user.username.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(user) {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      region_id: user.region_id || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const regionId = form.role === "super_admin" ? null : (form.region_id ? Number(form.region_id) : null);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          email: form.email,
          role: form.role,
          region_id: regionId,
        });
        toast.success("User updated.");
      } else {
        await createUser({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
          region_id: regionId,
        });
        toast.success("User created.");
      }
      setShowModal(false);
      await loadUsers();
    } catch (error) {
      toast.error(error.message || "Could not save this user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setSaving(true);
    try {
      await deactivateUser(deactivateTarget.id);
      toast.success(`${deactivateTarget.username} deactivated.`);
      setDeactivateTarget(null);
      await loadUsers();
    } catch (error) {
      toast.error(error.message || "Could not deactivate this user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-slate-400 mt-1">Manage staff accounts and their access roles.</p>
          </div>

          <button
            onClick={openCreate}
            className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700"
          >
            + Add User
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-4">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2 w-full"
          />
        </div>

        {loading ? (
          <Loader label="Loading users..." />
        ) : (
          <div className="bg-slate-900 rounded-xl shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Region</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-800">
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{titleCase(user.role)}</td>
                      <td className="px-6 py-4">
                        {regions.find((r) => r.id === user.region_id)?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.is_active ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEdit(user)}
                          className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeactivateTarget(user)}
                          disabled={!user.is_active}
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
        title={editingUser ? `Edit ${editingUser.username}` : "Add User"}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={!!editingUser}
            className="w-full border border-slate-700 rounded-lg p-3 disabled:bg-slate-800"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-700 rounded-lg p-3"
            required
          />

          {!editingUser && (
            <input
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-slate-700 rounded-lg p-3"
              required
            />
          )}

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-slate-700 rounded-lg p-3"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>{titleCase(role)}</option>
            ))}
          </select>

          {form.role !== "super_admin" && (
            <select
              value={form.region_id}
              onChange={(e) => setForm({ ...form, region_id: e.target.value })}
              className="w-full border border-slate-700 rounded-lg p-3"
              required
            >
              <option value="" disabled>Select region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 border border-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : editingUser ? "Save Changes" : "Add User"}
            </button>
          </div>

        </form>
      </Modal>

      {deactivateTarget && (
        <ConfirmModal
          title="Deactivate User"
          message={`Are you sure you want to deactivate ${deactivateTarget.username}?`}
          onConfirm={handleDeactivate}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}

    </AdminLayout>
  );
}

export default UserManagement;
