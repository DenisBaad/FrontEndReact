import type { EnumStatusCliente } from "../../../enums/EnumStatusCliente";
import type { EnumTipoCliente } from "../../../enums/EnumTipoCliente";

export interface RequestCliente {
  codigo: number;
  tipo: EnumTipoCliente;
  cpfCnpj: string;
  status: EnumStatusCliente;
  nome: string;
  identidade?: string | null;
  orgaoExpedidor?: string | null;
  dataNascimento: Date | null;
  nomeFantasia?: string | null;
  contato: string;
}
