import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, redirectPath = "/login" }) {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  if (loggedIn) {
    return children ? <>{children}</> : <Outlet />;
  }

  return <p>Loading...</p>;
}
