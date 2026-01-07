import api from "./api";

export const GameService = {
  saveResult: async (resultData) => {
    return await api.post("/results", resultData);
  },

  getLeaderboard: async (params = {}) => {
    // Supports query params like limit, type (15s, 60s)
    return await api.get("/leaderboard", { params });
  },

  getUserStats: async (userId) => {
    return await api.get(`/users/${userId}/stats`);
  },
};
