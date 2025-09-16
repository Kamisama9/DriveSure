import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:3000",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// // Add a request interceptor to include JWT token
// axiosInstance.interceptors.request.use(
// 	(config) => {
// 		const token = localStorage.getItem("token"); // or whatever key you're using
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );

export default axiosInstance;
