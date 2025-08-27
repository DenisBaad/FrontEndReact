import type { EnumStatusFatura } from "../../../enums/EnumStatusFatura";

export interface RequestFatura {
  status: EnumStatusFatura;
  inicioVigencia: Date | null;
  fimVigencia: Date | null;
  dataVencimento: Date | null;
  valorTotal: number;
  planoId: string;
  clienteId: string;
}