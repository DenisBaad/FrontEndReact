export interface ResponsePlano {
  items: ItemPlano[];
  totalCount: number;
}

export interface ItemPlano {
  _id: string;
  descricao: string;
  valorPlano: number;
  quantidadeUsuarios: number;
  vigenciaMeses: number;
}
