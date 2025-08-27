import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./guards/PrivateRoutes";
import { Box, LinearProgress } from "@mui/material";

const Spinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', px: 2 }}>
    <Box sx={{ width: '50%' }}><LinearProgress sx={{ height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { borderRadius: 5, backgroundColor: '#1976d2'}}}/></Box>
  </Box>
);

const LoginRoutes = lazy(() => import("./pages/login/Login.route"));
const ClientesRoutes = lazy(() => import("./pages/clientes/Clientes.route"));
const PlanosRoutes = lazy(() => import("./pages/planos/Planos.route"));
const FaturasRoutes = lazy(() => import("./pages/faturas/Faturas.route"));
const RelatoriosFaturasRoutes = lazy(() => import("./pages/relatorios/relatorioFaturas/RelatorioFaturas.route"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/clientes/home" replace />} />
        <Route path="/login/*" element={<LoginRoutes />} />
        <Route path="/clientes/*" element={<PrivateRoute><ClientesRoutes /></PrivateRoute>} />
        <Route path="/planos/*" element={<PrivateRoute><PlanosRoutes /></PrivateRoute>} />
        <Route path="/faturas/*" element={<PrivateRoute><FaturasRoutes /></PrivateRoute>} />
        <Route path="/relatorios/*" element={<PrivateRoute><RelatoriosFaturasRoutes /></PrivateRoute>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;