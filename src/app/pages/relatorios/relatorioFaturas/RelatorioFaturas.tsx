import "./RelatorioFaturas.css";
import { Button, CircularProgress, MenuItem, Select, TextField } from "@mui/material";
import { EnumStatusFatura } from "../../../shared/models/enums/EnumStatusFatura";
import FaturasService from "../../../services/FaturasService";
import { useEffect, useState } from "react";
import type { ResponseCliente } from "../../../shared/models/interfaces/responses/clientes/ResponseCliente";
import ClientesService from "../../../services/ClientesService";

const RelatorioFaturas = () => {
  const [clientes, setClientes] = useState<ResponseCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [formValues, setFormValues] = useState({
    dataAbertura: "",
    dataFechamento: "",
    status: "" as EnumStatusFatura | "",
    clientesSelecionados: [],
  });

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    getClientes();
  }, []);

  const getClientes = async () => {
    const data = await ClientesService.get();
    setClientes(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: "status" | "clientesSelecionados", value: EnumStatusFatura | "" | string[]) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { dataAbertura, dataFechamento, status, clientesSelecionados } = formValues;
    if (!dataAbertura || !dataFechamento) {
      alert("Preencha a data de abertura e a data de fechamento antes de gerar o relatório.");
      return;
    }

    setLoading(true);
    const usuarioNome = decodeURIComponent(getCookie("USUARIO_NOME") || "Usuário Desconhecido");

    try {
      const fileUrl = await FaturasService.getRelatorioFaturas(usuarioNome, dataAbertura, dataFechamento, status || null, clientesSelecionados);
      
      setPdfUrl(fileUrl);
      setLoading(false);

      if (isMobile) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "relatorio_faturas.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.open(fileUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-row">
        <Select
          name="status"
          value={formValues.status}
          onChange={(e) => handleSelectChange("status", e.target.value)}
          displayEmpty
          className="form-control"
          variant="filled"
          >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value={EnumStatusFatura.Aberto}>Aberto</MenuItem>
          <MenuItem value={EnumStatusFatura.Atrasado}>Atrasado</MenuItem>
          <MenuItem value={EnumStatusFatura.Pago}>Pago</MenuItem>
        </Select>

        <Select
          multiple
          name="clientesSelecionados"
          value={formValues.clientesSelecionados}
          variant="filled"
          onChange={(e) => handleSelectChange("clientesSelecionados", e.target.value as string[])}
          displayEmpty
          renderValue={(selected) => {
            if ((selected as string[]).length === 0) return "Clientes";
            return (selected as string[])
              .map((id) => {
                const cliente = clientes.find((c) => c._id === id);
                return cliente ? `${cliente.nome}` : id;
              })
              .join(", ");
          }}
          className="form-control-large"
        >
          {clientes.map((cliente) => (
            <MenuItem key={cliente._id} value={cliente._id}>
              {cliente.nome} {cliente.cpfCnpj}
            </MenuItem>
          ))}
        </Select>

        <TextField
          type="date"
          name="dataAbertura"
          label="Início Vigência"
          variant="filled"
          slotProps={{ inputLabel: { shrink: true } }}
          className="date-field"
          value={formValues.dataAbertura}
          onChange={handleChange}
        />

        <TextField
          type="date"
          name="dataFechamento"
          label="Fim Vigência"
          variant="filled"
          slotProps={{ inputLabel: { shrink: true } }}
          className="date-field"
          value={formValues.dataFechamento}
          onChange={handleChange}
        />

        <Button type="submit" variant="contained" color="primary" className="button-submit">
          Gerar relatório
        </Button>
      </form>

      {loading && <CircularProgress className="loading-spinner" />}

      {!loading && pdfUrl && (
        <iframe src={pdfUrl} width="100%" height="1000px" className="iframe-container"></iframe>
      )}
    </div>
  );
};

export default RelatorioFaturas;