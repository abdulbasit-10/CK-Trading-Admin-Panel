import { create } from 'zustand';

const useRoleStore = create((set) => ({
  roles: [],
  loading: false,
  error: null,

  setRoles: (roles) => set({ roles }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addRole: (role) =>
    set((state) => ({ roles: [...state.roles, role] })),

  updateRole: (id, updated) =>
    set((state) => ({
      roles: state.roles.map((r) =>
        r.role_id === id ? updated : r
      ),
    })),

  deleteRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((r) => r.role_id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default useRoleStore;
