import api from "./api";

export const QuoteService = {
  submit: async (content, source) => {
    return await api.post("/quotes/submit", { content, source });
  },

  getPending: async () => {
    return await api.get("/quotes/pending");
  },

  vote: async (id) => {
    return await api.post(`/quotes/${id}/vote`);
  },

  getLibrary: async () => {
    return await api.get("/quotes/library");
  },
};
