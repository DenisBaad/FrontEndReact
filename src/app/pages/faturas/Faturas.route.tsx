import { Routes, Route, Navigate } from "react-router-dom";
import FaturasHome from "./FaturasHome";

const FaturasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<FaturasHome />} />
    </Routes>
  );
};

export default FaturasRoutes;