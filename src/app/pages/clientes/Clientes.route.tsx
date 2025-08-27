import { Routes, Route, Navigate } from "react-router-dom";
import ClientesHome from "./ClientesHome";

const ClientesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<ClientesHome />} />
    </Routes>
  );
};

export default ClientesRoutes;