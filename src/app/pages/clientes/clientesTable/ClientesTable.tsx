import "./ClientesTable.css";
import { useState } from "react";
import type { ResponseCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";
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
  clientes: ResponseCliente[];
  loading: boolean;
  openFormEvent: (cliente?: ResponseCliente) => void;
  handleAtivarInativarEvent: (id: string) => void;
}

const ClientesTable = ({ clientes, loading, openFormEvent, handleAtivarInativarEvent }: ClientesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
  
  const filteredData = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Pesquisar clientes"
        fullWidth
        variant="filled"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
                paginatedData.map((cliente) => (
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
          count={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setPage(0);
          }}
        />
      </div>
    </div>
  );
}

export default ClientesTable;