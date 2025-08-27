import { environment } from "../../environments/Environment.prod";
import Cookies from "js-cookie";
import type { ResponseFatura } from "../shared/models/interfaces/responses/faturas/ResponseFatura";
import axios from "axios";
import type { RequestFatura } from "../shared/models/interfaces/requests/faturas/RequestFatura";
import type { EnumStatusFatura } from "../shared/models/enums/EnumStatusFatura";

const URL = environment.Aquiles_URL;
const getHeaders = () => {
  const token = Cookies.get("USUARIO_INFORMACOES");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const get = async (): Promise<ResponseFatura[]> => {
  const { data } = await axios.get<ResponseFatura[]>(`${URL}/faturas`, { headers: getHeaders() });
  return data;
};

const create = async (request: RequestFatura): Promise<ResponseFatura> => {
  const { data } = await axios.post<ResponseFatura>(`${URL}/faturas`, request, { headers: getHeaders() });
  return data;
};

const update = async (id: string, request: RequestFatura): Promise<void> => {
  const { data } = await axios.put<void>(`${URL}/faturas/${id}`, request, { headers: getHeaders() });
  return data;
};

const getRelatorioFaturas = async (usuarioLogadoNome: string, dataAbertura: Date | string, dataFechamento: Date | string, status: EnumStatusFatura | null, clientesSelecionados: string[]): Promise<string> => {
  const clienteQuery = clientesSelecionados.map(id => `clienteId=${encodeURIComponent(id)}`).join("&");

  let urlRelatorio = `${URL}/faturas/gerar-relatorio-faturas-clientes?usuarioNome=${encodeURIComponent(usuarioLogadoNome)}`;

  if (clientesSelecionados.length > 0) urlRelatorio += `&${clienteQuery}`;
  if (dataAbertura) urlRelatorio += `&dataAbertura=${dataAbertura instanceof Date ? dataAbertura.toISOString() : dataAbertura}`;
  if (dataFechamento) urlRelatorio += `&dataFechamento=${dataFechamento instanceof Date ? dataFechamento.toISOString() : dataFechamento}`;
  if (status !== null && status !== undefined) urlRelatorio += `&status=${status}`;

  const response = await axios.get<Blob>(urlRelatorio, {
    headers: getHeaders(),
    responseType: "blob", 
  });

  const fileURL = window.URL.createObjectURL(response.data);
  return fileURL;
};

const FaturasService = { get, create, update, getRelatorioFaturas };

export default FaturasService;