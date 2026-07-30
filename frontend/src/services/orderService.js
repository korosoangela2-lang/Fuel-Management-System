import api from "../api/axios";

export const fetchOrders = async (params = {}) => {
  const response = await api.get("/orders", { params });
  return response.data;
};

export const fetchOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const updateOrder = async (orderId, data) => {
  const response = await api.patch(`/orders/${orderId}`, data);
  return response.data;
};

export const approveOrder = async (orderId) => {
  const response = await api.post(`/orders/${orderId}/approve`);
  return response.data;
};

export const cancelOrder = async (orderId, reason) => {
  const response = await api.post(`/orders/${orderId}/cancel`, { reason });
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};
