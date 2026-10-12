import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../shared/ui/Loader";

// Wrap a page in <RequireAuth> to send logged-out visitors to the login page.
// After logging in they come straight back here.
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Loader label="Checking your login" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

export default RequireAuth;
