import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { loggedIn } = useAuth();

  // Redirect authenticated users away from public routes
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  // Allow access to unauthenticated users
  return children ? <>{children}</> : <Outlet />;
}
