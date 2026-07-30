import api from "../api/axios";

export const fetchRegions = async (params = {}) => {
  const response = await api.get("/regions", { params });
  return response.data;
};

export const createRegion = async (data) => {
  const response = await api.post("/regions", data);
  return response.data;
};

export const updateRegion = async (regionId, data) => {
  const response = await api.patch(`/regions/${regionId}`, data);
  return response.data;
};

export const deactivateRegion = async (regionId) => {
  const response = await api.delete(`/regions/${regionId}`);
  return response.data;
};
