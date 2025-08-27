import "./Toolbar.css";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Tooltip, Switch, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FactoryIcon from "@mui/icons-material/Factory";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CustomToolbar = ({ hideLogout = false }: { hideLogout?: boolean }) => {
  const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem("darkMode") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("theme-dark", darkMode);
    document.body.classList.toggle("theme-light", !darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleLogout = () => {
    Cookies.remove("USUARIO_NOME");
    Cookies.remove("USUARIO_INFORMACOES");
    navigate("/login");
  };

  return (
    <AppBar position="fixed" className={`toolbar-menu`} style={{ background: 'linear-gradient(135deg, #686565, #000000)' }}>
      <Toolbar>
        <div className="logo">
          <FactoryIcon/>
          <div style={{ fontSize: "1.25rem", fontWeight: 500 }}>
            Hélios
          </div>
        </div>

        <div className="content-center">
          <Tooltip title={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}>
            <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} color="default"/>
          </Tooltip>
          <span >Dark Mode</span>
        </div>

        {!hideLogout && (
          <Button variant="contained" color="error" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ marginLeft: "20px", padding: "8px 20px" }}>
            Sair
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomToolbar;