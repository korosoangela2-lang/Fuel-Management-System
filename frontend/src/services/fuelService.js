import api from "../api/axios";

export const fetchFuels = async (params = {}) => {
  const response = await api.get("/fuels", { params });
  return response.data;
};

export const fetchFuel = async (fuelId) => {
  const response = await api.get(`/fuels/${fuelId}`);
  return response.data;
};

export const createFuel = async (data) => {
  const response = await api.post("/fuels", data);
  return response.data;
};

export const updateFuel = async (fuelId, data) => {
  const response = await api.patch(`/fuels/${fuelId}`, data);
  return response.data;
};

export const addFuelStock = async (fuelId, quantity) => {
  const response = await api.post(`/fuels/${fuelId}/stock/add`, { quantity });
  return response.data;
};

export const deactivateFuel = async (fuelId) => {
  const response = await api.delete(`/fuels/${fuelId}`);
  return response.data;
};
