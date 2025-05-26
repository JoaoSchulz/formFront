import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ProcessData {
  id: string;
  nomeProcesso: string;
  objeto: string;
  tipoContrato: string;
  etapaAtual: string;
  escolasImpactadas: number;
  estudantesImpactados: number;
  valorTotal?: number;
  valorExecutado?: number;
  percentualExecucao?: number;
  dataOrdemServico: string;
  dataRegistro: string;
  dataPrazoFinal: string;
  dataEmpenho: string;
  numeroEmpenho: string;
  tempoRestante: string;
  nivelRisco: string;
  probabilidade: string;
  impacto: string;
  userLocation: string;
}

const AdminProcessTable = () => {
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/processos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 502) {
            throw new Error("Erro 502: Bad Gateway. Verifique o servidor backend.");
          }
          if (response.status === 403 || response.status === 401) {
            throw new Error("Erro de autenticação. Verifique suas credenciais.");
          }
          throw new Error("Erro ao buscar os dados dos processos.");
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Resposta da API não é um JSON válido.");
        }

        const data = await response.json();
        const formattedData = data.map((item: any) => item.props);
        setProcesses(formattedData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  const exportToExcel = () => {
    const headers = [
      "ID",
      "Nome do Processo",
      "Objeto",
      "Tipo de Contrato",
      "Etapa Atual",
      "Escolas Impactadas",
      "Estudantes Impactados",
      "Valor Total",
      "Valor Executado",
      "Percentual Execução",
      "Data Ordem de Serviço",
      "Data Registro",
      "Data Prazo Final",
      "Data Empenho",
      "Numero Empenho",
      "Tempo Restante",
      "Nivel de Risco",
      "Probabilidade",
      "Impacto",
      "Local do Usuário",
    ];

    const dataWithHeaders = [
      headers,
      ...processes.map((process) => [
        process.id || "N/A",
        process.nomeProcesso || "N/A",
        process.objeto || "N/A",
        process.tipoContrato || "N/A",
        process.etapaAtual || "N/A",
        process.escolasImpactadas ?? "N/A",
        process.estudantesImpactados ?? "N/A",
        process.valorTotal !== undefined ? `R$ ${process.valorTotal.toFixed(2)}` : "N/A",
        process.valorExecutado !== undefined ? `R$ ${process.valorExecutado.toFixed(2)}` : "N/A",
        process.percentualExecucao !== undefined ? `${process.percentualExecucao.toFixed(2)}%` : "N/A",
        process.dataOrdemServico ? new Date(process.dataOrdemServico).toLocaleDateString("pt-BR") : "-",
        process.dataRegistro ? new Date(process.dataRegistro).toLocaleDateString("pt-BR") : "-",
        process.dataPrazoFinal ? new Date(process.dataPrazoFinal).toLocaleDateString("pt-BR") : "-",
        process.dataEmpenho ? new Date(process.dataEmpenho).toLocaleDateString("pt-BR") : "-",
        process.numeroEmpenho ?? "N/A",
        process.tempoRestante ?? "N/A",
        process.nivelRisco ?? "N/A",
        process.probabilidade ?? "N/A",
        process.impacto ?? "N/A",
        process.userLocation ?? "N/A",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Respostas");
    XLSX.writeFile(workbook, "respostas_recebidas.xlsx");
  };

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Tabela de Processos</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Exportar tudo para Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Nome do Processo</th>
              <th className="px-6 py-3 border">Objeto</th>
              <th className="px-6 py-3 border">Tipo de Contrato</th>
              <th className="px-6 py-3 border">Etapa Atual</th>
              <th className="px-6 py-3 border">Escolas Impactadas</th>
              <th className="px-6 py-3 border">Estudantes Impactados</th>
              <th className="px-6 py-3 border">Valor Total</th>
              <th className="px-6 py-3 border">Valor Executado</th>
              <th className="px-6 py-3 border">Percentual Execução</th>
              <th className="px-6 py-3 border">Data Ordem de Serviço</th>
              <th className="px-6 py-3 border">Data Registro</th>
              <th className="px-6 py-3 border">Data Prazo Final</th>
              <th className="px-6 py-3 border">Data Empenho</th>
              <th className="px-6 py-3 border">Numero Empenho</th>
              <th className="px-6 py-3 border">Tempo Restante</th>
              <th className="px-6 py-3 border">Nivel de Risco</th>
              <th className="px-6 py-3 border">Probabilidade</th>
              <th className="px-6 py-3 border">Impacto</th>
              <th className="px-6 py-3 border">Local do Usuário</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id || index} className="hover:bg-gray-100">
                <td className="px-6 py-3 border">{process.id || "N/A"}</td>
                <td className="px-6 py-3 border">{process.nomeProcesso || "N/A"}</td>
                <td className="px-6 py-3 border">{process.objeto || "N/A"}</td>
                <td className="px-6 py-3 border">{process.tipoContrato || "N/A"}</td>
                <td className="px-6 py-3 border">{process.etapaAtual || "N/A"}</td>
                <td className="px-6 py-3 border">{process.escolasImpactadas ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.estudantesImpactados ?? "N/A"}</td>
                <td className="px-6 py-3 border">
                  {process.valorTotal !== undefined ? `R$ ${process.valorTotal.toFixed(2)}` : "N/A"}
                </td>
                <td className="px-6 py-3 border">
                  {process.valorExecutado !== undefined ? `R$ ${process.valorExecutado.toFixed(2)}` : "N/A"}
                </td>
                <td className="px-6 py-3 border">
                  {process.percentualExecucao !== undefined ? `${process.percentualExecucao.toFixed(2)}%` : "N/A"}
                </td>
                <td className="px-6 py-3 border">
                  {process.dataOrdemServico ? new Date(process.dataOrdemServico).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-6 py-3 border">
                  {process.dataRegistro ? new Date(process.dataRegistro).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-6 py-3 border">
                  {process.dataPrazoFinal ? new Date(process.dataPrazoFinal).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-6 py-3 border">
                  {process.dataEmpenho ? new Date(process.dataEmpenho).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-6 py-3 border">{process.numeroEmpenho ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.tempoRestante ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.nivelRisco ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.probabilidade ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.impacto ?? "N/A"}</td>
                <td className="px-6 py-3 border">{process.userLocation ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProcessTable;
