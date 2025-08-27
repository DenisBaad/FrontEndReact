import axios from "axios";
import { environment } from "../../environments/Environment.prod";
import type { RequestUsuario } from "../shared/models/interfaces/requests/usuarios/RequestUsuario";
import type { ResponseUsuario } from "../shared/models/interfaces/responses/usuarios/ResponseUsuario";

const URL = environment.Aquiles_URL;

const create = async (request: RequestUsuario): Promise<ResponseUsuario> => {
  const { data } = await axios.post<ResponseUsuario>(`${URL}/usuarios`, request);
  return data;
};

const usuariosService = { create };

export default usuariosService;