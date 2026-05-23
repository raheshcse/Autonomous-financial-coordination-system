import axios from "axios";

const API_BASE_URL = "https://autonomous-financial-coordination.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const unwrapList = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

export const runFinancialWorkflow = async (transactionId) => {
  const response = await api.post(`/run-financial-coordination/${transactionId}`);
  return response.data;
};
export const getRiskSummary = async () => {
  const response = await api.get("/analytics/risk-summary");
  return unwrapList(response.data, ["risk_summary", "summary"]);
};

export const getDepartmentSpend = async () => {
  const response = await api.get("/analytics/department-spend");
  return unwrapList(response.data, ["department_spend", "spend"]);
};

export const getStatusSummary = async () => {
  const response = await api.get("/analytics/status-summary");
  return unwrapList(response.data, ["status_summary", "summary"]);
};

export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return unwrapList(response.data, ["transactions"]);
};
