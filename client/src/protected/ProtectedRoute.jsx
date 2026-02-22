import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./Auth";

const ProtectedRoute = ({ element }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;