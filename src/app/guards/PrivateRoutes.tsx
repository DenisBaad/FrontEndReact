import { Navigate } from "react-router-dom";
import loginService from "../services/LoginService";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const loggedIn = loginService.isLoggedIn();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;