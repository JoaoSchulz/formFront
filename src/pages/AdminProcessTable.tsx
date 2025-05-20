import { useEffect, useState } from "react";

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
  dataRegistro: string;
}

const AdminProcessTable = () => {
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch("http://localhost:8080/processos");
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos processos.");
        }
        const data = await response.json();

        const formattedData = data.map((item: any) => item.props);
        setProcesses(formattedData);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Tabela de Processos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nome do Processo</th>
              <th className="px-4 py-2 border">Objeto</th>
              <th className="px-4 py-2 border">Tipo de Contrato</th>
              <th className="px-4 py-2 border">Etapa Atual</th>
              <th className="px-4 py-2 border">Escolas Impactadas</th>
              <th className="px-4 py-2 border">Estudantes Impactados</th>
              <th className="px-4 py-2 border">Valor Total</th>
              <th className="px-4 py-2 border">Valor Executado</th>
              <th className="px-4 py-2 border">Percentual Execução</th>
              <th className="px-4 py-2 border">Data Registro</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id || index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{process.id || "N/A"}</td>
                <td className="px-4 py-2 border">{process.nomeProcesso || "N/A"}</td>
                <td className="px-4 py-2 border">{process.objeto || "N/A"}</td>
                <td className="px-4 py-2 border">{process.tipoContrato || "N/A"}</td>
                <td className="px-4 py-2 border">{process.etapaAtual || "N/A"}</td>
                <td className="px-4 py-2 border">{process.escolasImpactadas ?? "N/A"}</td>
                <td className="px-4 py-2 border">{process.estudantesImpactados ?? "N/A"}</td>
                <td className="px-4 py-2 border">
                  {process.valorTotal !== undefined ? `R$ ${process.valorTotal.toFixed(2)}` : "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {process.valorExecutado !== undefined ? `R$ ${process.valorExecutado.toFixed(2)}` : "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {process.percentualExecucao !== undefined ? `${process.percentualExecucao.toFixed(2)}%` : "N/A"}
                </td>
                <td className="px-4 py-2 border">
                  {process.dataRegistro ? new Date(process.dataRegistro).toLocaleDateString("pt-BR") : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProcessTable;
