import type { EnumStatusFatura } from "../../../enums/EnumStatusFatura";

export interface ResponseFatura {
  items: ItemFatura[];
  totalCount: number;
}

export interface ItemFatura {
  _id?: string;
  clienteId: string;
  planoId: string;
  status: EnumStatusFatura;
  inicioVigencia: Date;
  fimVigencia: Date;
  dataPagamento: Date;
  dataVencimento: Date;
  valorTotal: number;
  valorDesconto: number;
  valorPagamento: number;
}