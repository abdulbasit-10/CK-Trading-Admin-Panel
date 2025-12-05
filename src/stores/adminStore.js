import { create } from 'zustand';

const useAdminStore = create((set) => ({
  admins: [],
  loading: false,
  error: null,
  currentAdmin: null,

  setAdmins: (admins) => set({ admins }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentAdmin: (admin) => set({ currentAdmin: admin }),

  addAdmin: (admin) => set((state) => ({ admins: [...state.admins, admin] })),

  updateAdmin: (id, updatedAdmin) =>
    set((state) => ({
      admins: state.admins.map((admin) => (admin.id === id ? updatedAdmin : admin)),
    })),

  deleteAdmin: (id) =>
    set((state) => ({
      admins: state.admins.filter((admin) => admin.id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default useAdminStore;
