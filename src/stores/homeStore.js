import { create } from 'zustand';

const useHomeStore = create((set) => ({
  announcements: [],
  pairAnalysis: [],
  loading: false,
  error: null,

  setAnnouncements: (announcements) => set({ announcements }),
  setPairAnalysis: (analysis) => set({ pairAnalysis: analysis }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addAnnouncement: (announcement) =>
    set((state) => ({ announcements: [...state.announcements, announcement] })),

  updateAnnouncement: (id, updated) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.announcement_id === id ? updated : a
      ),
    })),

  deleteAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter((a) => a.announcement_id !== id),
    })),

  addAnalysis: (analysis) =>
    set((state) => ({ pairAnalysis: [...state.pairAnalysis, analysis] })),

  updateAnalysis: (id, updated) =>
    set((state) => ({
      pairAnalysis: state.pairAnalysis.map((a) =>
        a.analysis_id === id ? updated : a
      ),
    })),

  deleteAnalysis: (id) =>
    set((state) => ({
      pairAnalysis: state.pairAnalysis.filter((a) => a.analysis_id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default useHomeStore;
