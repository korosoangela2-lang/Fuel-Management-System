import api from "./api";

export const loginUser = (credentials) => {
  return api.post("/login", credentials);
};

export const registerUser = (userData) => {
  return api.post("/register", userData);
};

export const forgotPassword = (email) => {
  return api.post("/forgot-password", email);
};