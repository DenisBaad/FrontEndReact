import "./PlanosTable.css";
import type { ResponsePlano } from "../../../shared/models/interfaces/responses/planos/ResponsePlano";
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

interface PlanosTableProps {
  planos: ResponsePlano[];
  loading: boolean;
  openFormEvent: (plano?: ResponsePlano) => void;
}

const PlanosTable = ({ planos, loading, openFormEvent }: PlanosTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const filteredData = planos.filter((plano) =>
    plano.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Pesquisar planos"
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
                <TableCell>Descrição</TableCell>
                <TableCell>Valor Plano</TableCell>
                <TableCell>Qtd Usuários</TableCell>
                <TableCell>Vigência Meses</TableCell>
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
                paginatedData.map((plano) => (
                  <TableRow key={plano._id}>
                    <TableCell>{plano.descricao}</TableCell>
                    <TableCell>{formatCurrency(plano.valorPlano)}</TableCell>
                    <TableCell>{plano.quantidadeUsuarios}</TableCell>
                    <TableCell>{plano.vigenciaMeses}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton size="medium" color="primary" onClick={() => openFormEvent(plano)}>
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

export default PlanosTable;