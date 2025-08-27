import { useEffect, useState } from "react";
import MySnackbar from "../../shared/utils/SnackBar";
import { Dialog, DialogContent } from "@mui/material";
import type { ResponseFatura } from "../../shared/models/interfaces/responses/faturas/ResponseFatura";
import FaturasService from "../../services/FaturasService";
import FaturasTable from "./faturasTable/FaturasTable";
import FaturasForm from "./faturasForm/FaturasForm";
import type { RequestFatura } from "../../shared/models/interfaces/requests/faturas/RequestFatura";
import type { ResponseCliente } from "../../shared/models/interfaces/responses/clientes/ResponseCliente";
import type { ResponsePlano } from "../../shared/models/interfaces/responses/planos/ResponsePlano";
import PlanosService from "../../services/PlanosService";
import ClientesService from "../../services/ClientesService";
import type { AxiosError } from "axios";

const FaturasHome = () => {
  const [faturas, setFaturas] = useState<ResponseFatura[]>([]);
  const [planos, setPlanos] = useState<ResponsePlano[]>([]);
  const [clientes, setClientes] = useState<ResponseCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<ResponseFatura | null>(null);

  useEffect(() => {
    getPlanos();
    getClientes();
    getFaturas();
  }, []);

  const getFaturas = async () => {
    setLoading(true)
    const data = await FaturasService.get();
    setFaturas(data);
    setLoading(false)
  }

  const getPlanos = async () => {
    const data = await PlanosService.get();
    setPlanos(data);
  };

  const getClientes = async () => {
    const data = await ClientesService.get();
    setClientes(data);
  };

  const handleFaturaEvent = (fatura?: ResponseFatura) => {
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

  return(
      <div className="margem">
        <FaturasTable faturas={faturas} planos={planos} clientes={clientes} loading={loading} openFormEvent={handleFaturaEvent} />
        
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