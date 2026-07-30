import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const fetchRegistrationRegions = async () => {
  const response = await api.get("/auth/regions");
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post("/auth/password-reset/request", { email });
  return response.data;
};

export const confirmPasswordReset = async (token, newPassword) => {
  const response = await api.post("/auth/password-reset/confirm", {
    token,
    new_password: newPassword,
  });
  return response.data;
};
