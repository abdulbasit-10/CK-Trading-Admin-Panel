import { create } from 'zustand';

const usePartnerStore = create((set) => ({
  partners: [],
  loading: false,
  error: null,

  setPartners: (partners) => set({ partners }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addPartner: (partner) =>
    set((state) => ({ partners: [...state.partners, partner] })),

  updatePartner: (id, updated) =>
    set((state) => ({
      partners: state.partners.map((p) =>
        p.partner_id === id ? updated : p
      ),
    })),

  deletePartner: (id) =>
    set((state) => ({
      partners: state.partners.filter((p) => p.partner_id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default usePartnerStore;
