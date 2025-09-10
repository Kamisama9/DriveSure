import { Navigate, Outlet } from "react-router-dom";
import useStore from "../../store/store";
const ProtectedRoute = ({ children }) => {
  const user = useStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Option A: render children
  if (children) {
    return children;
  }
}
export default ProtectedRoute;
