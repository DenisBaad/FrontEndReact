import "./FaturasTable.css";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { formatCurrency } from "../../../shared/utils/UseCurrencyInput";
import { Button, IconButton, Tooltip, InputAdornment } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Paginator from "../../../shared/utils/Paginator";
import SearchIcon from '@mui/icons-material/Search';
import type { ResponseFatura } from "../../../shared/models/interfaces/responses/faturas/ResponseFatura";
import { EnumStatusFatura } from "../../../shared/models/enums/EnumStatusFatura";
import type { ResponsePlano } from "../../../shared/models/interfaces/responses/planos/ResponsePlano";
import type { ResponseCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";

interface FaturasTableProps {
  faturas: ResponseFatura[];
  planos: ResponsePlano[];
  clientes: ResponseCliente[];
  loading: boolean;
  openFormEvent: (fatura?: ResponseFatura) => void;
}

const FaturasTable = ({ faturas, planos, clientes, loading, openFormEvent }: FaturasTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tipoFatura = (tipo: EnumStatusFatura) => {
    const tipos = {
      [EnumStatusFatura.Aberto]: "Aberto",
      [EnumStatusFatura.Atrasado]: "Atrasado",
      [EnumStatusFatura.Pago]: "Pago"
    };
    return tipos[tipo];
  };

  const getClienteNome = (id: string) => clientes.find(c => c._id === id)?.nome ?? "";
  const getPlanoDescricao = (id: string) => planos.find(p => p._id === id)?.descricao ?? "";
  
  const filteredData = faturas.filter((fatura) =>
    getClienteNome(fatura.clienteId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Pesquisar faturas"
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
                <TableCell>Status</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Plano</TableCell>
                <TableCell>Início Vigência</TableCell>
                <TableCell>Fim Vigência</TableCell>
                <TableCell>Valor Total</TableCell>
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
                paginatedData.map((fatura) => (
                  <TableRow key={fatura._id}>
                    <TableCell>{tipoFatura(fatura.status)}</TableCell>
                    <TableCell>{getClienteNome(fatura.clienteId)}</TableCell>
                    <TableCell>{getPlanoDescricao(fatura.planoId)}</TableCell>
                    <TableCell>{new Date(fatura.inicioVigencia).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</TableCell>
                    <TableCell>{new Date(fatura.fimVigencia).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</TableCell>
                    <TableCell>{formatCurrency(fatura.valorTotal)}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton size="medium" color="primary" onClick={() => openFormEvent(fatura)}>
                          <EditIcon />
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

export default FaturasTable;