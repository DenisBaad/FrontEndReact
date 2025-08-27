import { TablePagination } from "@mui/material";

interface PaginatorProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
}

const CustomPaginator = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }: PaginatorProps ) => {

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        component="div"
        labelRowsPerPage="Itens por página:" 
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      />
    </div>
  );
};

export default CustomPaginator;