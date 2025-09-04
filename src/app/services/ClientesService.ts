import { environment } from "../../environments/Environment.prod";
import axios from "axios";
import Cookies from "js-cookie";
import type { ResponseCliente } from "../shared/models/interfaces/responses/clientes/ResponseCliente";
import type { RequestCliente } from "../shared/models/interfaces/requests/clientes/RequestCliente";

const URL = environment.Aquiles_URL;
const getHeaders = () => {
  const token = Cookies.get("USUARIO_INFORMACOES");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const get = async (pageNumber: number, pageSize: number, search: string = ""): Promise<ResponseCliente> => {
  const { data } = await axios.get<ResponseCliente>(`${URL}/clientes?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`, { headers: getHeaders() });
  return data;
};

const create = async (request: RequestCliente): Promise<ResponseCliente> => {
  const { data } = await axios.post<ResponseCliente>(`${URL}/clientes`, request, { headers: getHeaders() });
  return data;
};

const update = async (id: string, request: RequestCliente): Promise<void> => {
  const { data } = await axios.put<void>(`${URL}/clientes/${id}`, request, { headers: getHeaders() });
  return data;
};

const ativarInativar = async (id: string): Promise<void> => {
  await axios.patch(`${URL}/clientes/${id}`, {}, { headers: getHeaders() });
};

const ClientesService = { get, create, update, ativarInativar };

export default ClientesService;