import api from "./api";

export const AuthService = {
  loginGoogle: async (userData) => {
    const response = await api.post("/auth/google", userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: () => {
    // Backend logout if needed (e.g. invalidate token),
    // mostly client side handled by removing token.
  },
};
