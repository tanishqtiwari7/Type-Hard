import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const saveResult = async (resultData) => {
  return await api.post("/results", resultData);
};

export const getLeaderboard = async () => {
  return await api.get("/leaderboard");
};

export const checkDailyLimit = async () => {
  return await api.get("/auth/check-limit");
};

export default api;
