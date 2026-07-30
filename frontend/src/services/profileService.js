import api from "../api/axios";

export const fetchProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/profile", data);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("/profile/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};
