import type { EnumStatusCliente } from "../../../enums/EnumStatusCliente";
import type { EnumTipoCliente } from "../../../enums/EnumTipoCliente";

export interface ResponseCliente {
  items: ItemCliente[];
  totalCount: number;
}

export interface ItemCliente {
  _id: string;
  codigo: number;
  tipo: EnumTipoCliente;
  cpfCnpj: string;
  status: EnumStatusCliente;
  nome: string;
  identidade?: string;
  orgaoExpedidor?: string;
  dataNascimento: Date;
  nomeFantasia?: string;
  contato: string;
}
