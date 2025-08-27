import type { EnumStatusFatura } from "../../../enums/EnumStatusFatura";

export interface RequestFatura {
  status: EnumStatusFatura;
  inicioVigencia: Date | string;
  fimVigencia: Date | string;
  dataVencimento: Date | string;
  valorTotal: number;
  planoId: string;
  clienteId: string;
}