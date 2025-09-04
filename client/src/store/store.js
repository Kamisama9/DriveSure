import { create } from "zustand";

const useStore = create((set) => ({
	mode: "login",
	setMode: (mode) => set({ mode }),
}));

export default useStore;
