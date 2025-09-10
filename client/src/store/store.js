import { create } from "zustand";

const useStore = create((set) => ({
  mode: "login", //property to track whether the user is in login or signup mode
  setMode: (mode) => set({ mode }), //function to update the mode
  user: null, //property to store user information
  setUser: (user) => set({ user }), //function to update user information
  loading: true, //property to indicate if the app is in a loading state
  setLoading: (flag) => set({ loading: flag }), //function to update loading state
}));

export default useStore;
