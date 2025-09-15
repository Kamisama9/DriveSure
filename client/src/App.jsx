import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import useStore from "./store/store";
import LandingPage from "./pages/LandingPage";
import RiderPage from "./pages/RiderPage";
import DriverPage from "./pages/DriverPage";
import AdminPage from "./pages/AdminPage";
import BookingPage from "./pages/BookingPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthPage from "./auth/pages/AuthPage";

const App = () => {
  const setUser = useStore((s) => s.setUser);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(atob(token.split('.')[1]));
        setUser(user);
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Invalid token:', error);
      }
    }
  }, [setUser]);



  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/rider"
          element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={['rider', 'admin']}>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
