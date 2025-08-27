import "./FaturasForm.css";
import React, { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { useCurrencyInput } from "../../../shared/utils/UseCurrencyInput";
import type { ResponseFatura } from "../../../shared/models/interfaces/responses/faturas/ResponseFatura";
import { EnumStatusFatura } from "../../../shared/models/enums/EnumStatusFatura";
import type { RequestFatura } from "../../../shared/models/interfaces/requests/faturas/RequestFatura";
import type { ResponseCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";
import type { ResponsePlano } from "../../../shared/models/interfaces/responses/planos/ResponsePlano";

interface FaturasFormProps {
  item: ResponseFatura | null;
  planos: ResponsePlano[];
  clientes: ResponseCliente[];
  handleClose: () => void;
  handleFormSubmit: (formData: Omit<RequestFatura, "_id">, id?: string) => void;
}

const FaturasForm = ({ item, planos, clientes, handleClose, handleFormSubmit }: FaturasFormProps) => {
  const [formValues, setFormValues] = useState({
    status: item?.status ?? EnumStatusFatura.Aberto,
    inicioVigencia: formatDateForInput(item?.inicioVigencia),
    fimVigencia: formatDateForInput(item?.fimVigencia),
    dataVencimento: formatDateForInput(item?.dataVencimento),
    valorTotal: item?.valorTotal ?? 0,
    planoId: item?.planoId ?? "",
    clienteId: item?.clienteId ?? ""
  });

  const handleResetForm = () => {
    if (item) {
      setFormValues({
        status: item.status,
        inicioVigencia: formatDateForInput(item.inicioVigencia),
        fimVigencia: formatDateForInput(item.fimVigencia),
        dataVencimento: formatDateForInput(item.dataVencimento),
        valorTotal: item.valorTotal,
        planoId: item.planoId,
        clienteId: item.clienteId,
      });
    } else {
      setFormValues({
        status: EnumStatusFatura.Aberto,
        inicioVigencia: "",
        fimVigencia: "",
        dataVencimento: "",
        valorTotal: 0,
        planoId: "",
        clienteId: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<RequestFatura, "_id"> = { ...formValues };
    await handleFormSubmit(payload, item?._id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "valorTotal" ? Number(value) : value,
    }))
  };

  const { inputValue: valorTotalInput, handleInputChange: handleValorTotalChange } = useCurrencyInput(
    formValues.valorTotal,
    (val) => setFormValues((prev) => ({ 
      ...prev,
       valorTotal: val ?? 0 
    }))
  );

  function formatDateForInput(date?: string | Date): string {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="title-text">{item ? "Editar Fatura" : "Criar Fatura"}</div>

        <div className="flex-wrap-container">
          <TextField
            select
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "100%" }, mt: 2 }}
          >
            <MenuItem value={EnumStatusFatura.Aberto}>Aberto</MenuItem>
            <MenuItem value={EnumStatusFatura.Atrasado}>Atrasado</MenuItem>
            <MenuItem value={EnumStatusFatura.Pago}>Pago</MenuItem>
          </TextField>

          <TextField
            label="Início Vigência"
            name="inicioVigencia"
            type="date"
            value={formValues.inicioVigencia}
            onChange={handleChange}
            variant="filled"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            label="Fim Vigência"
            name="fimVigencia"
            type="date"
            value={formValues.fimVigencia}
            onChange={handleChange}
            variant="filled"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            label="Data Vencimento"
            name="dataVencimento"
            type="date"
            value={formValues.dataVencimento}
            onChange={handleChange}
            variant="filled"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            label="Valor Total"
            name="valorTotal"
            type="text"
            value={valorTotalInput}
            onChange={handleValorTotalChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            select
            label="Plano"
            name="planoId"
            value={formValues.planoId}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          >
            {planos.map((plano) => (
              <MenuItem key={plano._id} value={plano._id}>
                {plano.descricao} 
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Cliente"
            name="clienteId"
            value={formValues.clienteId}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente._id} value={cliente._id}>
                {cliente.nome}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button variant="contained" color="error" onClick={handleClose}>
            Fechar
          </Button>

          <Button variant="contained" color="secondary" onClick={handleResetForm}>
            {item ? "Carregar" : "Limpar"}
          </Button>

          <Button type="submit" variant="contained">
            {item ? "Alterar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FaturasForm;