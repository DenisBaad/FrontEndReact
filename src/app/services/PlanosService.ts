import { environment } from "../../environments/Environment.prod";
import axios from "axios";
import type { ResponsePlano } from "../shared/models/interfaces/responses/planos/ResponsePlano";
import type { RequestPlano } from "../shared/models/interfaces/requests/planos/RequestPlano";
import Cookies from "js-cookie";

const URL = environment.Aquiles_URL;
const getHeaders = () => {
  const token = Cookies.get("USUARIO_INFORMACOES");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const get = async (): Promise<ResponsePlano[]> => {
  const { data } = await axios.get<ResponsePlano[]>(`${URL}/planos`, { headers: getHeaders() });
  return data;
};

const create = async (request: RequestPlano): Promise<ResponsePlano> => {
  const { data } = await axios.post<ResponsePlano>(`${URL}/planos`, request, { headers: getHeaders() });
  return data;
};

const update = async (id: string, request: RequestPlano): Promise<void> => {
  const { data } = await axios.put<void>(`${URL}/planos/${id}`, request, { headers: getHeaders() });
  return data;
};

const PlanosService = { get, create, update };

export default PlanosService;