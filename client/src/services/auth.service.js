import api from "./api";

export const AuthService = {
  register: async (username, email, password) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

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
