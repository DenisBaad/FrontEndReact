import "./ClientesTable.css";
import { useState } from "react";
import type { ItemCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";
import { Button, CircularProgress, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Paginator from "../../../shared/utils/Paginator";
import { EnumTipoCliente } from "../../../shared/models/enums/EnumTipoCliente";
import { EnumStatusCliente } from "../../../shared/models/enums/EnumStatusCliente";
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';

interface ClientesTableProps {
  clientes: ItemCliente[];
  loading: boolean;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  onPageChange: (pageNumber: number, pageSize: number) => void;
  onSearchChange: (value: string) => void;
  openFormEvent: (cliente?: ItemCliente) => void;
  handleAtivarInativarEvent: (id: string) => void;
}

const ClientesTable = ({ clientes, loading, totalCount, pageNumber, pageSize, onPageChange, onSearchChange, openFormEvent, handleAtivarInativarEvent }: ClientesTableProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);     
    onSearchChange(value);      
  }

  const tipoCliente = (tipo: EnumTipoCliente) => {
    const tipos = {
      [EnumTipoCliente.Fisica]: "Física",
      [EnumTipoCliente.Juridica]: "Jurídica",
    };
    return tipos[tipo];
  };

  const statusCliente = (status: EnumStatusCliente) => {
    const statuss = {
      [EnumStatusCliente.Ativo]: "Ativo",
      [EnumStatusCliente.Inativo]: "Inativo",
    };
    return statuss[status] ?? "Outro";
  };

  return (
    <div>
      <TextField
        label="Pesquisar clientes"
        fullWidth
        variant="filled"
        value={searchValue}
        onChange={handleSearchChange}
        className="text-field-search"
        sx={{ mb: 2, borderRadius: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Tooltip title="Adicionar">
        <Button sx={{ mb: 2 }} variant="contained" startIcon={<AddIcon />} onClick={() => openFormEvent()}>
          Adicionar
        </Button>
      </Tooltip>

      <div className="table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow key={cliente._id}>
                    <TableCell>{cliente.codigo}</TableCell>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{tipoCliente(cliente.tipo)}</TableCell>
                    <TableCell>{cliente.cpfCnpj}</TableCell>
                    <TableCell>{statusCliente(cliente.status)}</TableCell>
                    <TableCell>{cliente.contato}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton size="medium" color="primary" onClick={() => openFormEvent(cliente)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={cliente.status === EnumStatusCliente.Ativo ? "Inativar" : "Ativar"}>
                        <IconButton size="medium" color={cliente.status === EnumStatusCliente.Ativo ? "error" : "success"} onClick={() => handleAtivarInativarEvent(cliente._id)}>
                          {cliente.status === EnumStatusCliente.Ativo ? <BlockIcon /> : <CheckIcon />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paginator
          count={totalCount}
          page={pageNumber}
          rowsPerPage={pageSize}
          onPageChange={(newPage) => onPageChange(newPage, pageSize)}
          onRowsPerPageChange={(newRows) => onPageChange(0, newRows)}
        />
      </div>
    </div>
  );
}

export default ClientesTable;