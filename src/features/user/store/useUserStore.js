// Store para usuarios (usando Zustand como en otros features)
import { create } from 'zustand';

const useUserStore = create((set) => ({
  users: [],
  userDetail: null,
  loading: false,
  error: null,
  setUsers: (users) => set({ users }),
  setUserDetail: (userDetail) => set({ userDetail }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useUserStore;
