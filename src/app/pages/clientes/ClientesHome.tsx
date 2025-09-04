import { useEffect, useState } from "react";
import type { ItemCliente } from "../../shared/models/interfaces/responses/clientes/ResponseCliente";
import ClientesService from "../../services/ClientesService";
import { Dialog, DialogContent } from "@mui/material";
import MySnackbar from "../../shared/utils/SnackBar";
import ClientesTable from "./clientesTable/ClientesTable";
import ClientesForm from "./clientesForm/ClientesForm";
import type { AxiosError } from "axios";
import type { RequestCliente } from "../../shared/models/interfaces/requests/clientes/RequestCliente";

const ClientesHome = () => {
  const [clientes, setClientes] = useState<ItemCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ItemCliente | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
    
  useEffect(() => {
    getClientes();
  }, [pageNumber, pageSize, searchValue])
    
  const getClientes = async () => {
    try {
      setLoading(true)
      const data = await ClientesService.get(pageNumber + 1, pageSize, searchValue);
      setClientes(data.items);
      setTotalCount(data.totalCount);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const onSearch = (value: string) => {
    setSearchValue(value);
    setPageNumber(0);
  };

  const onPageChange = (newPage: number, newRowsPerPage: number) => {
    setPageNumber(newPage);
    setPageSize(newRowsPerPage);
  };
    
  const handleClienteEvent = (cliente?: ItemCliente) => {
    setSelectedCliente(cliente ?? null);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (formData: Omit<RequestCliente, "_id">, id?: string) => {
    try {
      if (id) {
        await ClientesService.update(id, formData);
        setSnackbar("Cliente atualizado com sucesso!");
      } else {
        await ClientesService.create(formData);
        setSnackbar("Cliente criado com sucesso!");
      } 
            
      await getClientes();
      setOpenDialog(false); 
      } catch (error: unknown) {
      console.error(error);
      const message = getErrorMessage(error as AxiosError<{ errors?: string[] | string }>);
      setSnackbar(message);
    }
  };

  const getErrorMessage = (err: AxiosError<{ errors?: string[] | string }>): string => {
    const data = err.response?.data;

    if (data?.errors && Array.isArray(data.errors)) {
      const lista = data.errors.map((el: string) => `• ${el}`).join("\n");
      return "Erros encontrados:\n" + lista;
    } else if (data?.errors) {
      return String(data.errors); 
    }
    return "Erro desconhecido. Detalhes indisponíveis.";
  };

  const handleAtivarInativarEvent = async (id: string) => {
    try {
      await ClientesService.ativarInativar(id);
      setSnackbar("Status do cliente alterado com sucesso!");
      await getClientes(); 
    } catch (error) {
      console.error(error);
      setSnackbar("Erro ao alterar status do cliente.");
    }
  };

  return(
    <div className="margem">
        <ClientesTable 
        clientes={clientes} 
        loading={loading} 
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onSearchChange={onSearch}
        openFormEvent={handleClienteEvent} 
        handleAtivarInativarEvent={handleAtivarInativarEvent} />
            
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
          <DialogContent>
            <ClientesForm item={selectedCliente} handleClose={() => setOpenDialog(false)} handleFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
          
        <MySnackbar message={snackbar} />
    </div>
  )
}

export default ClientesHome;