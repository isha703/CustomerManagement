import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/store/hooks";
import { selectUser } from "../../features/auth/authSlice";

const ProtectedRoute: React.FC = () => {
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;