import api from "../api/axios";

export const fetchDashboardReport = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data;
};

export const fetchInventoryReport = async () => {
  const response = await api.get("/reports/inventory");
  return response.data;
};

export const fetchSalesReport = async (params = {}) => {
  const response = await api.get("/reports/sales", { params });
  return response.data;
};

export const fetchRevenueReport = async (params = {}) => {
  const response = await api.get("/reports/revenue", { params });
  return response.data;
};

export const fetchDeliveriesReport = async () => {
  const response = await api.get("/reports/deliveries");
  return response.data;
};

export const fetchTopCustomersReport = async () => {
  const response = await api.get("/reports/top-customers");
  return response.data;
};

export const fetchConsolidatedReport = async () => {
  const response = await api.get("/reports/consolidated");
  return response.data;
};
