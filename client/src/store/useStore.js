import { create } from "zustand";

const useStore = create((set) => ({
  // Auth State
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Legacy setter for partial updates if needed
  setUser: (user) => set({ user }),

  // Game State
  isTyping: false,
  setIsTyping: (status) => set({ isTyping: status }),

  // Test Configuration
  config: {
    mode: "time", // time, words, quote
    duration: 30,
    punctuation: false,
    numbers: false,
  },
  setConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),

  // Live Stats
  stats: {
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
  },
  updateStats: (newStats) =>
    set((state) => ({ stats: { ...state.stats, ...newStats } })),
  resetStats: () =>
    set({
      stats: { wpm: 0, accuracy: 100, correctChars: 0, incorrectChars: 0 },
    }),
}));

export default useStore;
