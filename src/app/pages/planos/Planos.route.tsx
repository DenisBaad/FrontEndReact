import { Routes, Route, Navigate } from "react-router-dom";
import PlanosHome from "./PlanosHome";

const PlanosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<PlanosHome />} />
    </Routes>
  );
};

export default PlanosRoutes;