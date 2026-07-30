import { useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import UserLayout from "../../layouts/UserLayout";
import { useAuth } from "../../context/useAuth";
import { isAdminRole } from "../../utils/roles";
import { changePassword } from "../../services/profileService";

function Settings() {
  const { user } = useAuth();
  const Layout = isAdminRole(user?.role) ? AdminLayout : UserLayout;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed. Please sign in again next time with your new password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Could not change your password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>

      <div className="max-w-xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account security.</p>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block mb-2 font-medium text-sm">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-slate-700 rounded-lg px-4 py-2"
                autoComplete="current-password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-700 rounded-lg px-4 py-2"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-700 rounded-lg px-4 py-2"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Change Password"}
            </button>

          </form>

        </div>

      </div>

    </Layout>
  );
}

export default Settings;
