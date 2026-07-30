import api from "../api/axios";

export const fetchUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const fetchUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.patch(`/users/${userId}`, data);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
