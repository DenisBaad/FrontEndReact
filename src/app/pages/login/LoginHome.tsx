import './LoginHome.css';
import React, { useState, useEffect } from "react";
import { Button, TextField, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import usuariosService from "../../services/UsuarioService";
import loginService from "../../services/LoginService";
import Cookies from "js-cookie";
import MySnackbar from "../../shared/utils/SnackBar";
import type { AxiosError } from 'axios';

const LoginHome = () => {
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState<string>(""); 
  const [isCadastroMode, setIsCadastroMode] = useState(false);
  const [hideSenha, setHideSenha] = useState(true);
  const [formValues, setFormValues] = useState({
    nome: "",
    email: "",
    senha: "",
    lembrarEmail: false,
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setFormValues((prev) => ({ ...prev, email: savedEmail, lembrarEmail: true }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCadastroMode) {
        await usuariosService.create({
          nome: formValues.nome,
          email: formValues.email,
          senha: formValues.senha,
        });
        
        setSnackbarMessage("Usuário cadastrado com sucesso!");
        setIsCadastroMode(prev => !prev);
        setFormValues({ nome: "", email: "", senha: "", lembrarEmail: false });
      } else {
        const response = await loginService.login({
          email: formValues.email,
          senha: formValues.senha,
        });

        Cookies.set("USUARIO_INFORMACOES", response.token);
        Cookies.set("USUARIO_NOME", response.nome);

        if (formValues.lembrarEmail) {
          localStorage.setItem("savedEmail", formValues.email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        navigate("/clientes");
      }
    } catch (error: unknown) {
      console.error(error);
      const message = getErrorMessage(error as AxiosError<{ errors?: string[] }>);
      setSnackbarMessage(message);
    }
  };

  const getErrorMessage = (err: AxiosError<{ errors?: string[] }>): string => {
    const lista = err.response?.data?.errors?.map(el => `• ${el}`).join('\n');
    return lista ? `Erros encontrados:\n${lista}` : 'Erro desconhecido. Detalhes indisponíveis.';
  };

  return (
    <div className="grid">
      <div className="login-card" >        
        <div className="title-text">
          {isCadastroMode ? "Criar conta" : "Login"}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="box-column">
            {isCadastroMode && (
              <TextField
                label="Nome"
                name="nome"
                value={formValues.nome}
                onChange={handleChange}
                fullWidth
                variant="filled"
                required
              />
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              fullWidth
              variant="filled"
              required
            />

            <div style={{ position: "relative" }}>
              <TextField
                label="Senha"
                name="senha"
                type={hideSenha ? "password" : "text"}
                value={formValues.senha}
                onChange={handleChange}
                fullWidth
                variant="filled"
                required
              />
              
              <IconButton onClick={() => setHideSenha(prev => !prev)} sx={{ position: "absolute", right: 8, top: "30%" }}>
                {hideSenha ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
          </div>

          <FormControlLabel style={{padding: "10px"}} control={<Checkbox checked={formValues.lembrarEmail} onChange={handleChange} name="lembrarEmail"/>} label="Lembrar meu e-mail"/>

          <div className="box-column">
            <Button type="submit" variant="contained" color="primary">
              {isCadastroMode ? "Cadastrar" : "Login"}
            </Button>
            
            <Button variant="outlined" onClick={() => setIsCadastroMode(prev => !prev)}>
              {isCadastroMode ? "Já tenho uma conta" : "Cadastrar usuário"}
            </Button>
          </div>
        </form>
      </div>
      <MySnackbar message={snackbarMessage} />
    </div>
  );
};

export default LoginHome;