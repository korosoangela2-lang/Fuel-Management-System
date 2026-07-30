import api from "../api/axios";

export const fetchRefineries = async (params = {}) => {
  const response = await api.get("/refineries", { params });
  return response.data;
};

export const createRefinery = async (data) => {
  const response = await api.post("/refineries", data);
  return response.data;
};

export const updateRefinery = async (refineryId, data) => {
  const response = await api.patch(`/refineries/${refineryId}`, data);
  return response.data;
};

export const deactivateRefinery = async (refineryId) => {
  const response = await api.delete(`/refineries/${refineryId}`);
  return response.data;
};
