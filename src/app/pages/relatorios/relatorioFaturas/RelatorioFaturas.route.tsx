import { Routes, Route, Navigate } from "react-router-dom";
import RelatorioFaturas from './RelatorioFaturas';

const RelatoriosFaturasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<RelatorioFaturas />} />
    </Routes>
  );
};

export default RelatoriosFaturasRoutes;