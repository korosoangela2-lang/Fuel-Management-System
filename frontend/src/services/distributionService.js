import api from "../api/axios";

export const fetchDistributions = async (params = {}) => {
  const response = await api.get("/distributions", { params });
  return response.data;
};

export const fetchDistribution = async (distributionId) => {
  const response = await api.get(`/distributions/${distributionId}`);
  return response.data;
};

export const scheduleDistribution = async (data) => {
  const response = await api.post("/distributions", data);
  return response.data;
};

export const updateDistribution = async (distributionId, data) => {
  const response = await api.patch(`/distributions/${distributionId}`, data);
  return response.data;
};

export const changeDistributionStatus = async (distributionId, status, notes) => {
  const response = await api.patch(`/distributions/${distributionId}/status`, {
    status,
    notes,
  });
  return response.data;
};

export const trackOrderDelivery = async (orderNumber) => {
  const response = await api.get(`/distributions/track/${orderNumber}`);
  return response.data;
};
