import "./SideBar.css";
import { useState, useEffect } from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Button, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CircleIcon from "@mui/icons-material/Circle";
import CustomToolbar from "../toolbar/Toolbar";
import AppRoutes from "../../../App.routes";
import { menuItems } from "../../models/interfaces/responses/Menu";
import { NavLink, useLocation } from "react-router-dom";
import ImageControl from "../imageControll/ImageControll";
import Cookies from "js-cookie";

export default function Sidebar() {
  const isSmallScreen = useMediaQuery("(max-width:800px)");
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(localStorage.getItem("imageUrl"));
  const [isRounded, setIsRounded] = useState<boolean>(JSON.parse(localStorage.getItem("isRounded") || "true"));
  const [menuTitle, setMenuTitle] = useState("");
  const usuarioLogado = Cookies.get("USUARIO_NOME") || "";
  const location = useLocation();
  const isLoginRoute = location.pathname.startsWith("/login");

  useEffect(() => {
    const pathname = location.pathname.split("/").filter(Boolean)[0] || "";
    const title = pathname.replace(/-/g, " ");
    setMenuTitle(title);
  }, [location.pathname]);

  useEffect(() => {
    if (isSmallScreen) {
      setSidenavOpen(false); 
    } else {
      setSidenavOpen(true); 
    }
  }, [isSmallScreen]);

  if (isLoginRoute) {
    return (
      <Box >
        <CustomToolbar hideLogout />
        <AppRoutes />
      </Box>
    );
  }

  const handleImageReady = (base64: string) => {
    localStorage.setItem("imageUrl", base64);
    setImageUrl(base64);
  };

  const toggleImageShape = () => {
    setIsRounded(!isRounded);
    localStorage.setItem("isRounded", JSON.stringify(!isRounded));
  };

  return (
    <div className="sidebar-layout">
      <Drawer variant={isSmallScreen ? "temporary" : "persistent"} open={sidenavOpen} onClose={() => setSidenavOpen(false)} className="drawer">
        
        <div className="avatar-container">
          <ImageControl width={163} height={163} imageUrl={imageUrl || undefined} isRounded={isRounded} onImageReady={handleImageReady} />

          <Button variant="contained" color="primary" onClick={toggleImageShape} startIcon={isRounded ? <CropSquareIcon /> : <CircleIcon />} sx={{ marginTop: 2 }}>
            Alternar Formato
          </Button>

          <div style={{ fontSize: "1.5rem", margin: "9px 0" }}>
            {usuarioLogado}
          </div>
        </div>

        <List sx={{ mt: 3 }} className="menu-list">
          {menuItems.map((item, i) => (
            <NavLink key={i} to={item.link} className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`} onClick={() => isSmallScreen && setSidenavOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton>
                <ListItemIcon>
                  <i className={`fa ${item.icon}`} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
      </Drawer>

      <IconButton onClick={() => setSidenavOpen(!sidenavOpen)} sx={{ position: "fixed", top: 70, left: isSmallScreen ? 10 : sidenavOpen ? 320 : 10,  width: 27, height: 27, backgroundColor: "gray", color: "white", zIndex: 1301, "&:hover": { backgroundColor: "gray" } }}>
        <MenuIcon sx={{ fontSize: 20 }} />
      </IconButton>
      
    <div className={`main-content ${!isSmallScreen && sidenavOpen && "pushed"}`}>
      <div className="header-main" style={{ padding: "32px" }}>
        <div style={{ fontSize: "2.125rem", marginTop: "40px" }}>{menuTitle}</div>
      </div>
      
      <CustomToolbar />
      
      <div className="routes-container">
        <AppRoutes />
      </div>
    </div>

  </div>
  );
}