import api from "./api";

export const UserService = {
  getProfile: async (username) => {
    const res = await api.get(`/users/${username}`);
    return res.data;
  },

  getHistory: async (username) => {
    const res = await api.get(`/users/${username}/history`);
    return res.data;
  },
};
