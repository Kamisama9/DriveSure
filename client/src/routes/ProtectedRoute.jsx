import { Navigate } from "react-router-dom";
import useStore from "../store/store";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useStore((s) => s.user);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If roles are specified and user's role is not in allowed roles, redirect to appropriate page
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their role-specific page
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}

export default ProtectedRoute;
