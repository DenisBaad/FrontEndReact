import { useEffect, useState } from "react";
import MySnackbar from "../../shared/utils/SnackBar";
import { Dialog, DialogContent } from "@mui/material";
import type { ItemFatura } from "../../shared/models/interfaces/responses/faturas/ResponseFatura";
import FaturasService from "../../services/FaturasService";
import FaturasTable from "./faturasTable/FaturasTable";
import FaturasForm from "./faturasForm/FaturasForm";
import type { RequestFatura } from "../../shared/models/interfaces/requests/faturas/RequestFatura";
import type { ItemCliente } from "../../shared/models/interfaces/responses/clientes/ResponseCliente";
import type { ItemPlano } from "../../shared/models/interfaces/responses/planos/ResponsePlano";
import PlanosService from "../../services/PlanosService";
import ClientesService from "../../services/ClientesService";
import type { AxiosError } from "axios";

const FaturasHome = () => {
  const [faturas, setFaturas] = useState<ItemFatura[]>([]);
  const [planos, setPlanos] = useState<ItemPlano[]>([]);
  const [clientes, setClientes] = useState<ItemCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<ItemFatura | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getPlanos();
    getClientes();
    getFaturas();
  }, [pageNumber, pageSize]);

  const getFaturas = async () => {
    try {
      setLoading(true)
      const data = await FaturasService.get(pageNumber, pageSize);
      setFaturas(data.items);
      setTotalCount(data.totalCount);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const getPlanos = async () => {
    try {
      const data = await PlanosService.get(1, 1000000, '');
      setPlanos(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const getClientes = async () => {
    try {
      const data = await ClientesService.get(1, 1000000, '');
      setClientes(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const onPageChange = (newPage: number, newRowsPerPage: number) => {
    setPageNumber(newPage);
    setPageSize(newRowsPerPage);
  };

  const handleFaturaEvent = (fatura?: ItemFatura) => {
    setSelectedFatura(fatura ?? null);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (formData: Omit<RequestFatura, "_id">, id?: string) => {
    try {
      if (id) {
        await FaturasService.update(id, formData);
        setSnackbar("Fatura atualizada com sucesso!");
      } else {
        await FaturasService.create(formData);
        setSnackbar("Fatura criada com sucesso!");
      } 
        
      await getFaturas();
      setOpenDialog(false); 
    } catch (error: unknown) {
      console.error(error);
      const message = getErrorMessage(error as AxiosError<{ errors?: string[] }>);
      setSnackbar(message);
    }
  };

  const getErrorMessage = (err: AxiosError<{ errors?: string[] }>): string => {
    const lista = err.response?.data?.errors?.map(el => `• ${el}`).join('\n');
    return lista ? `Erros encontrados:\n${lista}` : 'Erro desconhecido. Detalhes indisponíveis.';
  };

  return(
      <div className="margem">
        <FaturasTable 
        faturas={faturas} 
        planos={planos} 
        clientes={clientes} 
        loading={loading} 
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={onPageChange}
        openFormEvent={handleFaturaEvent} 
        />
        
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
          <DialogContent>
            <FaturasForm item={selectedFatura} planos={planos} clientes={clientes} handleClose={() => setOpenDialog(false)} handleFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      
      <MySnackbar message={snackbar} />
    </div>
  )
}

export default FaturasHome;