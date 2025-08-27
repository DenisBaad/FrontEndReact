import "./ClientesForm.css"
import { useState } from "react";
import type { ResponseCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";
import { Button, MenuItem, TextField } from "@mui/material";
import { EnumTipoCliente } from "../../../shared/models/enums/EnumTipoCliente";
import { EnumStatusCliente } from "../../../shared/models/enums/EnumStatusCliente";
import type { RequestCliente } from "../../../shared/models/interfaces/requests/clientes/RequestCliente";

interface ClientesFormProps {
  item: ResponseCliente | null;
  handleClose: () => void;
  handleFormSubmit: (formData: Omit<RequestCliente, "_id">, id?: string) => void;
}

const ClientesForm = ({ item, handleClose, handleFormSubmit }: ClientesFormProps) => {
  const [contatoOuTelefone, setContatoOuTelefone] = useState<boolean | null>(null);
  const [formValues, setFormValues] = useState({
    codigo: item?.codigo ?? 0,
    tipo: item?.tipo ?? EnumTipoCliente.Fisica,
    cpfCnpj: item?.cpfCnpj ?? "",
    status: item?.status ?? EnumStatusCliente.Ativo,
    nome: item?.nome ?? "",
    identidade: item?.identidade ?? "",
    dataNascimento: formatDateForInput(item?.dataNascimento),
    orgaoExpedidor: item?.orgaoExpedidor ?? "",
    nomeFantasia: item?.nomeFantasia ?? "",
    contato: item?.contato ?? "",
  });

  const handleResetForm = () => {
    if (item) {
      setFormValues({
        codigo: item.codigo,
        tipo: item.tipo,
        cpfCnpj: item.cpfCnpj,
        status: item.status,
        nome: item.nome,
        identidade: item.identidade ?? "",
        orgaoExpedidor: item.orgaoExpedidor ?? "",
        dataNascimento: formatDateForInput(item?.dataNascimento),
        nomeFantasia: item.nomeFantasia ?? "",
        contato: item.contato,
      });
    } else {
      setFormValues({
        codigo: 0,
        tipo: EnumTipoCliente.Fisica,
        cpfCnpj: "",
        status: EnumStatusCliente.Ativo,
        nome: "",
        identidade: "",
        orgaoExpedidor: "",
        dataNascimento: "",
        nomeFantasia: "",
        contato: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formValues, contato: contatoOuTelefone ? formValues.contato.replace(/\D/g, "") : formValues.contato };
    await handleFormSubmit(payload, item?._id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const novoValor = processaContatoOuTelefone(name, value);

    setFormValues((prev) => ({
      ...prev,
      [name]: novoValor
    }));
  };

  const processaContatoOuTelefone = (name: string, value: string) => {
    if (name !== "contato") return value;

    if (value === "") {
      setContatoOuTelefone(null);
      return "";
    }

    let isTelefone = contatoOuTelefone;
    if (contatoOuTelefone === null && value.length > 0) {
      isTelefone = /^\d/.test(value); 
      setContatoOuTelefone(isTelefone);
    }

    if (isTelefone) {
      const digits = value.replace(/\D/g, "").slice(0, 11); 
      if (digits.length <= 2) return `(${digits}`;
      if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    return value;
  };

  function formatDateForInput(date?: string | Date): string {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="title-text">
          {item ? "Editar Cliente" : "Criar Cliente"}
        </div>
        
        <div className="flex-wrap-container">
          <TextField
            label="Código"
            name="codigo"
            type="number"
            value={formValues.codigo}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "20%" }, mt: 2, }}
          />

          <TextField
            select
            label="Tipo"
            name="tipo"
            value={formValues.tipo}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "20%" }, mt: 2, }}
          >
            <MenuItem value={EnumTipoCliente.Fisica}>Física</MenuItem>
            <MenuItem value={EnumTipoCliente.Juridica}>Jurídica</MenuItem>
          </TextField>

          <TextField
            label="CPF/CNPJ"
            name="cpfCnpj"
            value={formValues.cpfCnpj}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "20%" }, mt: 2, }}
          />

          <TextField
            select
            label="Status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "20%" }, mt: 2, }}
          >
            <MenuItem value={EnumStatusCliente.Ativo}>Ativo</MenuItem>
            <MenuItem value={EnumStatusCliente.Inativo}>Inativo</MenuItem>
          </TextField>

          <TextField
            label="Nome"
            name="nome"
            value={formValues.nome}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2, }}
          />

          <TextField
            label="Identidade"
            name="identidade"
            value={formValues.identidade}
            onChange={handleChange}
            variant="filled"
            fullWidth
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2, }}
          />

          <TextField
            label="Órgão Expedidor"
            name="orgaoExpedidor"
            value={formValues.orgaoExpedidor}
            onChange={handleChange}
            variant="filled"
            fullWidth
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2, }}
          />

          <TextField
            label="Data de Nascimento"
            name="dataNascimento"
            type="date"
            value={formValues.dataNascimento}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2 }}
          />

          <TextField
            label="Nome Fantasia"
            name="nomeFantasia"
            value={formValues.nomeFantasia}
            onChange={handleChange}
            variant="filled"
            fullWidth
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2, }}
          />

          <TextField
            label="Contato (E-mail ou Telefone)"
            name="contato"
            value={formValues.contato}
            onChange={handleChange}
            variant="filled"
            fullWidth
            required
            sx={{ flex: { xs: "100%", sm: "100%", lg: "25%" }, mt: 2, }}
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

export default ClientesForm;