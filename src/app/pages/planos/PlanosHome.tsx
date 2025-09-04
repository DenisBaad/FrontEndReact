import { useEffect, useState } from "react";
import type { ItemPlano } from "../../shared/models/interfaces/responses/planos/ResponsePlano";
import PlanosTable from "./planosTable/PlanosTable";
import PlanosService from "../../services/PlanosService";
import MySnackbar from "../../shared/utils/SnackBar";
import { Dialog, DialogContent } from "@mui/material";
import PlanosForm from "./planosForm/PlanosForm";
import type { AxiosError } from "axios";
import type { RequestPlano } from "../../shared/models/interfaces/requests/planos/RequestPlano";

const PlanosHome = () => {
  const [planos, setPlanos] = useState<ItemPlano[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState<ItemPlano | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getPlanos();
  }, [pageNumber, pageSize, searchValue]);

  const getPlanos = async () => {
    try {
      setLoading(true)
      const data = await PlanosService.get(pageNumber + 1, pageSize, searchValue);
      setPlanos(data.items);
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

  const handlePlanoEvent = (plano?: ItemPlano) => {
    setSelectedPlano(plano ?? null);
    setOpenDialog(true);
  };

  const handleFormSubmit = async (formData: Omit<RequestPlano, "_id">, id?: string) => {
    try {
      if (id) {
        await PlanosService.update(id, formData);
        setSnackbar("Plano atualizado com sucesso!");
      } else {
        await PlanosService.create(formData);
        setSnackbar("Plano criado com sucesso!");
      } 
        
      await getPlanos();
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
        <PlanosTable
        planos={planos}
        loading={loading}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onSearchChange={onSearch}
        openFormEvent={handlePlanoEvent}
        />
        
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
          <DialogContent>
            <PlanosForm item={selectedPlano} handleClose={() => setOpenDialog(false)} handleFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      
      <MySnackbar message={snackbar} />
    </div>
  )
}

export default PlanosHome;