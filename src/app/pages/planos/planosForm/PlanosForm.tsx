import "./PlanosForm.css"
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import type { ResponsePlano } from "../../../shared/models/interfaces/responses/planos/ResponsePlano";
import { useCurrencyInput } from "../../../shared/utils/UseCurrencyInput";
import type { RequestPlano } from "../../../shared/models/interfaces/requests/planos/RequestPlano";

interface PlanosFormProps {
  item: ResponsePlano | null;
  handleClose: () => void;
  handleFormSubmit: (formData: Omit<RequestPlano, "_id">, id?: string) => void;
}

const PlanosForm = ({ item, handleClose, handleFormSubmit }: PlanosFormProps) => {
  const [formValues, setFormValues] = useState({
    descricao: item?.descricao ?? "",
    valorPlano: item?.valorPlano ?? 0,
    quantidadeUsuarios: item?.quantidadeUsuarios ?? 0,
    vigenciaMeses: item?.vigenciaMeses ?? 0,
  });

  const handleResetForm = () => {
    if (item) {
      setFormValues({
        descricao: item.descricao,
        valorPlano: item.valorPlano,
        quantidadeUsuarios: item.quantidadeUsuarios,
        vigenciaMeses: item.vigenciaMeses,
      });
    } else {
      setFormValues({
        descricao: "",
        valorPlano: 0,
        quantidadeUsuarios: 0,
        vigenciaMeses: 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFormSubmit(formValues, item?._id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "descricao" ? value : Number(value),
    }));
  };

  const { inputValue: valorPlanoInput, handleInputChange: handleValorPlanoChange } = useCurrencyInput(
    formValues.valorPlano,
    (val) => setFormValues((prev) => ({ 
      ...prev,
       valorPlano: val ?? 0
     }))
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="title-text">
          {item ? "Editar Plano" : "Criar Plano"}
        </div>

        <div className="flex-wrap-container">
          <TextField
            label="Descrição"
            name="descricao"
            value={formValues.descricao}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "100%" }, mt: 2, }}
          />

          <TextField
            label="Valor Plano"
            name="valorPlano"
            type="text"
            value={valorPlanoInput} 
            onChange={handleValorPlanoChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            label="Quantidade Usuários"
            name="quantidadeUsuarios"
            type="number"
            value={formValues.quantidadeUsuarios}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />

          <TextField
            label="Vigência Meses"
            name="vigenciaMeses"
            type="number"
            value={formValues.vigenciaMeses}
            onChange={handleChange}
            variant="filled"
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" } }}
          />
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

export default PlanosForm;