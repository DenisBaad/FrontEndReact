import { Routes, Route, Navigate } from "react-router-dom";
import LoginHome from "./LoginHome";

const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<LoginHome />} />
    </Routes>
  );
};

export default LoginRoutes;