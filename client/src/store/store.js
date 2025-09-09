import { create } from "zustand";

const useStore = create((set) => ({
  mode: "login",
  setMode: (mode) => set({ mode }),
  user: null,
  setUser: (user) => set({ user }),
  loading: true,
  setLoading: (flag) => set({ loading: flag }),
}));

export default useStore;
