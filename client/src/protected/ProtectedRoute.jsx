import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./Auth";
import NotLoggedIn from '../components/NotLoggedIn';

const ProtectedRoute = ({ element }) => {
  if (!isLoggedIn()) {
    return <NotLoggedIn/>
  }

  return element;
};

export default ProtectedRoute;