import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/useAuth";
import { isAdminRole } from "../../utils/roles";
import { fetchProfile, updateProfile } from "../../services/profileService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Profile() {
  const { user, login, token } = useAuth();
  const Layout = isAdminRole(user?.role) ? AdminLayout : UserLayout;

  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setProfile(data);
        setEmail(data.email);
      })
      .catch((error) => toast.error(error.message || "Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile({ email });
      setProfile(updated);
      login({ ...user, email: updated.email }, token);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <Loader label="Loading your profile..." />
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-slate-400 mt-1">Your account details.</p>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-6 space-y-4">

          <div>
            <p className="text-sm text-slate-400">Username</p>
            <p className="font-semibold">{profile?.username}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Role</p>
            <p className="font-semibold">{titleCase(profile?.role || "")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block mb-2 font-medium text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-700 rounded-lg px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>

        </div>

      </div>

    </Layout>
  );
}

export default Profile;
