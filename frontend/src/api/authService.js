import api from "./axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};