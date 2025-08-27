import axios from "axios";
import { environment } from "../../environments/Environment.prod";
import type { ResponseLogin } from "../shared/models/interfaces/responses/login/ResponseLogin";
import type { RequestLogin } from "../shared/models/interfaces/requests/login/RequestLogin";
import Cookies from "js-cookie";

const URL = environment.Aquiles_URL;

const login = async (request: RequestLogin): Promise<ResponseLogin> => {
  const { data } = await axios.post<ResponseLogin>(`${URL}/login`, request);
  return data;
};

const isLoggedIn = (): boolean => {
  const JWT_TOKEN = Cookies.get("USUARIO_INFORMACOES");
  return !!JWT_TOKEN;
};

const loginService = { login, isLoggedIn };

export default loginService;