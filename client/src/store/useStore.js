import { create } from "zustand";

const useStore = create((set) => ({
  // Auth State
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

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
