import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import RiderPage from "./pages/RiderPage";
import DriverPage from "./pages/DriverPage";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import useStore from "./store/store";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./utils/axiosInstance";

const App = () => {
	const { setUser, loading, setLoading } = useStore();

	useEffect(() => {
		axiosInstance
			.get("/auth/me")
			.then((res) => setUser(res.data.user))
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, [setUser, setLoading]);

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth" element={<Login />} />
				<Route
					path="/rider"
					element={
						<ProtectedRoute>
							<RiderPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/driver"
					element={
						<ProtectedRoute>
							<DriverPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/booking" element={<BookingPage />} />
				<Route path="*" element={<Navigate to="/auth" replace />} />
			</Routes>
			<ToastContainer />
		</Router>
	);
};

export default App;
