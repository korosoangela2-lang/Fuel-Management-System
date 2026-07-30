import api from "../api/axios";

export const fetchCustomers = async (params = {}) => {
  const response = await api.get("/customers", { params });
  return response.data;
};

export const fetchCustomer = async (customerId) => {
  const response = await api.get(`/customers/${customerId}`);
  return response.data;
};

export const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data;
};

export const updateCustomer = async (customerId, data) => {
  const response = await api.patch(`/customers/${customerId}`, data);
  return response.data;
};

export const deactivateCustomer = async (customerId) => {
  const response = await api.delete(`/customers/${customerId}`);
  return response.data;
};
