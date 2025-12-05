import { create } from 'zustand';

const useSubscriptionStore = create((set) => ({
  subscriptions: [],
  loading: false,
  error: null,

  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addSubscription: (subscription) =>
    set((state) => ({ subscriptions: [...state.subscriptions, subscription] })),

  updateSubscription: (id, updated) =>
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.subscription_id === id ? updated : s
      ),
    })),

  deleteSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.subscription_id !== id),
    })),

  clearError: () => set({ error: null }),
}));

export default useSubscriptionStore;
