import { create } from 'zustand';

const useVerificationStore = create((set) => ({
  verifications: [],
  loading: false,
  error: null,

  setVerifications: (verifications) => set({ verifications }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addVerification: (verification) =>
    set((state) => ({ verifications: [...state.verifications, verification] })),

  updateVerification: (id, updated) =>
    set((state) => ({
      verifications: state.verifications.map((v) =>
        v.verification_id === id ? updated : v
      ),
    })),

  deleteVerification: (id) =>
    set((state) => ({
      verifications: state.verifications.filter((v) => v.verification_id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default useVerificationStore;
