"use client";

import React, { useEffect } from 'react'
import { useState } from "react"
import { toast } from 'react-toastify';

interface FormData {
  processName: string;
  object: string;
  contractType: string;
  currentStage: string;
  schoolsImpacted: number;
  studentsImpacted: number;
  totalValue: string; 
  executedValue: string; 
  executionPercentage: number;
  serviceOrderDate: string;
  deadlineDate: string;
  commitmentDate: string; 
  commitmentNumber: string; 
  riskLevel: string;
  riskJustification: string;
  probability: string;
  impact: string;
  remainingTime: string;
  userIp?: string;
  userLocation?: string;
  userDevice?: string;
}

// Fora do componente ProcessForm
function calculateRemainingTime(startDateStr: string): string {
  try {
    const startDate = new Date(startDateStr);
    const currentDate = new Date();

    const differenceInTime = startDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (differenceInDays > 1) {
      return `${differenceInDays} dias restantes`;
    } else if (differenceInDays === 1) {
      return `1 dia restante`;
    } else if (differenceInDays === 0) {
      return `Hoje`;
    } else if (differenceInDays === -1) {
      return `Ontem`;
    } else if (differenceInDays < -1) {
      return `${Math.abs(differenceInDays)} dias decorridos`;
    } else {
      return "Data inválida";
    }
  } catch (error) {
    console.error("Erro ao calcular o tempo restante:", error);
    return "Erro ao calcular";
  }
}

export default function ProcessForm() {
  const [formData, setFormData] = useState<FormData>({
    processName: "",
    object: "",
    contractType: "",
    currentStage: "",
    schoolsImpacted: 0,
    studentsImpacted: 0,
    totalValue: "",
    executedValue: "",
    executionPercentage: 0,
    serviceOrderDate: "",
    deadlineDate: "",
    commitmentDate: "", 
    commitmentNumber: "", 
    riskLevel: "",
    riskJustification: "",
    probability: "",
    impact: "",
    remainingTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Function to get user information
  const getUserInfo = async () => {
    try {
      // Get IP and location
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();

      const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const locationData = await locationResponse.json();

      // Get device information
      const userAgent = window.navigator.userAgent;
      const deviceInfo = {
        userAgent,
        platform: window.navigator.platform,
        language: window.navigator.language,
      };

      return {
        ip: ipData.ip,
        location: `${locationData.city}, ${locationData.region}`,
        device: `${deviceInfo.platform} - ${deviceInfo.userAgent}`,
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return {
        ip: 'Unknown',
        location: 'Unknown',
        device: window.navigator.userAgent,
      };
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };

      if (name === 'totalValue' || name === 'executedValue') {
        const total = parseFloat(newData.totalValue) || 0;
        const executed = parseFloat(newData.executedValue) || 0;
        const percentage = total > 0 ? (executed / total) * 100 : 0;
        newData.executionPercentage = Number(percentage.toFixed(2));
      }

      return newData;
    });
  };
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: Number(value) };

      // Calculate execution percentage when total or executed value changes
      if (name === 'totalValue' || name === 'executedValue') {
        const total = parseFloat(newData.totalValue) || 0;
        const executed = parseFloat(newData.executedValue) || 0;
        const percentage = total > 0 ? (executed / total) * 100 : 0;
        newData.executionPercentage = Number(percentage.toFixed(2));
      }

      return newData;
    });
  };

  useEffect(() => {
    if (formData.serviceOrderDate) {
      setFormData(prevData => ({
        ...prevData,
        remainingTime: calculateRemainingTime(prevData.serviceOrderDate),
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        remainingTime: "",
      }));
    }
  }, [formData.serviceOrderDate]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const validationErrors: { [key: string]: string } = {};

    // Validações básicas
    if (!formData.processName.trim()) {
      validationErrors.processName = "O nome do processo é obrigatório.";
    }
    if (!formData.object) {
      validationErrors.object = "Selecione o objeto.";
    }
    if (!formData.contractType) {
      validationErrors.contractType = "Selecione o tipo de contrato.";
    }
    if (!formData.currentStage) {
      validationErrors.currentStage = "Selecione a etapa atual.";
    }
    if (formData.schoolsImpacted < 0) {
      validationErrors.schoolsImpacted = "A abrangência não pode ser negativa.";
    }
    if (formData.studentsImpacted < 0) {
      validationErrors.studentsImpacted = "O número de estudantes não pode ser negativo.";
    }
    if (!formData.totalValue.trim()) {
      validationErrors.totalValue = "O valor total previsto é obrigatório.";
    } else if (isNaN(Number(formData.totalValue))) {
      validationErrors.totalValue = "O valor total previsto deve ser um número.";
    }
    if (!formData.executedValue.trim()) {
      validationErrors.executedValue = "O valor já executado é obrigatório.";
    } else if (isNaN(Number(formData.executedValue))) {
      validationErrors.executedValue = "O valor já executado deve ser um número.";
    }
    if (!formData.riskLevel) {
      validationErrors.riskLevel = "Selecione o nível de risco.";
    }
    if (!formData.probability) {
      validationErrors.probability = "Selecione a probabilidade.";
    }
    if (!formData.impact) {
      validationErrors.impact = "Selecione o impacto.";
    }
    if (formData.commitmentDate && formData.commitmentDate > "9999-09-09") {
      validationErrors.commitmentDate = "A data do empenho não pode ser maior que 09/09/9999.";
    }
    if (formData.deadlineDate && formData.deadlineDate > "9999-09-09") {
      validationErrors.deadlineDate = "O prazo final não pode ser maior que 09/09/9999.";
    }
    if (formData.serviceOrderDate && formData.serviceOrderDate > "9999-09-09") {
      validationErrors.serviceOrderDate = "A data da ordem de serviço não pode ser maior que 09/09/9999.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Get user information
        const userInfo = await getUserInfo();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/processos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomeProcesso: formData.processName,
            objeto: formData.object,
            tipoContrato: formData.contractType,
            etapaAtual: formData.currentStage,
            escolasImpactadas: formData.schoolsImpacted,
            estudantesImpactados: formData.studentsImpacted,
            valorTotal: formData.totalValue,
            valorExecutado: formData.executedValue,
            percentualExecucao: formData.executionPercentage / 100,
            dataOrdemServico: formData.serviceOrderDate,
            dataPrazoFinal: formData.deadlineDate,
            dataEmpenho: formData.commitmentDate,
            numeroEmpenho: formData.commitmentNumber,
            tempoRestante: formData.remainingTime,
            probabilidade: formData.probability,
            impacto: formData.impact,
            nivelRisco: formData.riskLevel,
            justificativaRisco: formData.riskJustification,
            userIp: userInfo.ip,
            userLocation: userInfo.location,
            userDevice: userInfo.device,
          }),
        });

        if (response.ok) {
          toast.success("Processo cadastrado com sucesso!");
          setFormData({ // Reset form
            processName: "",
            object: "",
            contractType: "",
            currentStage: "",
            schoolsImpacted: 0,
            studentsImpacted: 0,
            totalValue: "",
            executedValue: "",
            executionPercentage: 0,
            serviceOrderDate: "",
            deadlineDate: "",
            commitmentDate: "", 
            commitmentNumber: "", 
            remainingTime: "",
            probability: "",
            impact: "",
            riskLevel: "",
            riskJustification: "",

          });
          setErrors({});
        } else {
          const errorData = await response.json();
          toast.error("Erro ao cadastrar o processo: " + (errorData.message || "Erro desconhecido"));
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
        toast.error("Erro ao enviar os dados.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Formulário de Processo</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do processo */}
        <div className="space-y-2">
          <label htmlFor="processName" className="block text-sm font-medium text-gray-700">
            Nome do processo
          </label>
          <input
            type="text"
            id="processName"
            name="processName"
            value={formData.processName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o nome do processo"
          />
          {errors.processName && (
            <p className="text-red-500 text-sm">{errors.processName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objeto */}
          <div className="space-y-2">
            <label htmlFor="object" className="block text-sm font-medium text-gray-700">
              Setor
            </label>
            <select
              id="object"
              name="object"
              value={formData.object}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="Obra">Obra</option>
              <option value="TI">TI</option>
              <option value="Mobiliário">Mobiliário</option>
              <option value="Serviço">Serviço</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {/* Tipo de contrato */}
          <div className="space-y-2">
            <label htmlFor="contractType" className="block text-sm font-medium text-gray-700">
              Tipo de contrato
            </label>
            <select
              id="contractType"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="Pregão">Pregão</option>
              <option value="Contratação Direta">Contratação Direta</option>
              <option value="Inexigibilidade">Inexigibilidade</option>
              <option value="Adesão a ATA">Adesão a ATA</option>
              <option value="Adesão a ATA">Termo de Ajuste</option>
              <option value="Adesão a ATA">Apostilamento</option>
              <option value="Adesão a ATA">Convê</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Etapa atual */}
          <div className="space-y-2">
            <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700">
              Etapa atual
            </label>
            <select
              id="currentStage"
              name="currentStage"
              value={formData.currentStage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="Planejamento">Planejamento</option>
              <option value="Licitação">Licitação</option>
              <option value="Execução">Execução</option>
              <option value="Formalização de Demanda">Formalização de Demanda</option>
              <option value="Instrumentos ETP - TR">Instrumentos ETP - TR</option>
              <option value="Orçamento e Contratos">Orçamento e Contratos</option>
              <option value="Setor de Licitações">Setor de Licitações</option>
              <option value="Controle Interno">Controle Interno</option>
              <option value="Procuradoria">Procuradoria</option>
              <option value="Empenho">Empenho</option>
              <option value="Assinatura e Publicação">Assinatura e Publicação</option>
              <option value="Fiscalização de Contrato">Fiscalização de Contrato</option>
              <option value="Liquidação">Liquidação</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {/* Abrangência */}
          <div className="space-y-2">
            <label htmlFor="schoolsImpacted" className="block text-sm font-medium text-gray-700">
              Abrangência - número de escolas impactadas
            </label>
            <input
              type="number"
              id="schoolsImpacted"
              name="schoolsImpacted"
              min="0"
              value={formData.schoolsImpacted}
              onChange={handleNumberChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.schoolsImpacted && (
              <p className="text-red-500 text-sm">{errors.schoolsImpacted}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Número estimado de estudantes impactados */}
          <div className="space-y-2">
            <label htmlFor="studentsImpacted" className="block text-sm font-medium text-gray-700">
              Número estimado de estudantes impactados
            </label>
            <input
              type="number"
              id="studentsImpacted"
              name="studentsImpacted"
              min="0"
              value={formData.studentsImpacted}
              onChange={handleNumberChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {errors.studentsImpacted && (
              <p className="text-red-500 text-sm">{errors.studentsImpacted}</p>
            )}
          </div>

          {/* Valor total previsto */}
          <div className="space-y-2">
            <label htmlFor="totalValue" className="block text-sm font-medium text-gray-700">
              Valor total previsto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">R$</span>
              </div>
              <input
                type="text"
                id="totalValue"
                name="totalValue"
                value={formData.totalValue}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
            {errors.totalValue && (
              <p className="text-red-500 text-sm">{errors.totalValue}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor já executado */}
          <div className="space-y-2">
            <label htmlFor="executedValue" className="block text-sm font-medium text-gray-700">
              Valor já executado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">R$</span>
              </div>
              <input
                type="text"
                id="executedValue"
                name="executedValue"
                value={formData.executedValue}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,00"
              />
            </div>
            {errors.executedValue && (
              <p className="text-red-500 text-sm">{errors.executedValue}</p>
            )}
          </div>

          {/* Percentual de execução */}
          <div className="space-y-2">
            <label htmlFor="executionPercentage" className="block text-sm font-medium text-gray-700">
              Percentual de execução: {formData.executionPercentage.toFixed(2)}%
            </label>
            <input
              type="range"
              id="executionPercentage"
              name="executionPercentage"
              min="0"
              max="100"
              step="0.01"
              value={formData.executionPercentage}
              disabled
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data da ordem de serviço */}
          <div className="space-y-2">
            <label htmlFor="serviceOrderDate" className="block text-sm font-medium text-gray-700">
              Data da ordem de serviço/Fornecimento
            </label>
            <input
              type="date"
              id="serviceOrderDate"
              name="serviceOrderDate"
              value={formData.serviceOrderDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.serviceOrderDate && (
              <p className="text-red-500 text-sm">{errors.serviceOrderDate}</p>
            )}
          </div>

          {/* Prazo final previsto */}
          <div className="space-y-2">
            <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700">
              Prazo final previsto
            </label>
            <input
              type="date"
              id="deadlineDate"
              name="deadlineDate"
              value={formData.deadlineDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.deadlineDate && (
              <p className="text-red-500 text-sm">{errors.deadlineDate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data do empenho */}
          <div className="space-y-2">
            <label htmlFor="commitmentDate" className="block text-sm font-medium text-gray-700">
              Data do empenho
            </label>
            <input
              type="date"
              id="commitmentDate"
              name="commitmentDate"
              value={formData.commitmentDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.commitmentDate && (
              <p className="text-red-500 text-sm">{errors.commitmentDate}</p>
            )}
          </div>

          {/* Número do empenho */}
          <div className="space-y-2">
            <label htmlFor="commitmentNumber" className="block text-sm font-medium text-gray-700">
              Número do empenho
            </label>
            <input
              type="text"
              id="commitmentNumber"
              name="commitmentNumber"
              value={formData.commitmentNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o número do empenho"
            />
          </div>
        </div>

        {/* Tempo Restante */}
        <div className="space-y-2">
          <label htmlFor="remainingTime" className="block text-sm font-medium text-gray-700">
            Tempo Restante
          </label>
          <input
            type="text"
            id="remainingTime"
            name="remainingTime"
            value={formData.remainingTime}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        {/* Nível de risco */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nível de risco na sua percepção</label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="riskLow"
                name="riskLevel"
                value="Baixo"
                checked={formData.riskLevel === "Baixo"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="riskLow" className="ml-2 text-sm text-gray-700">
                Baixo
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="riskMedium"
                name="riskLevel"
                value="Médio"
                checked={formData.riskLevel === "Médio"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="riskMedium" className="ml-2 text-sm text-gray-700">
                Médio
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="riskHigh"
                name="riskLevel"
                value="Alto"
                checked={formData.riskLevel === "Alto"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="riskHigh" className="ml-2 text-sm text-gray-700">
                Alto
              </label>
            </div>
          </div>
          {errors.riskLevel && (
            <p className="text-red-500 text-sm">{errors.riskLevel}</p>
          )}
        </div>

        {/* Probabilidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="probability" className="block text-sm font-medium text-gray-700">
              Probabilidade
            </label>
            <select
              id="probability"
              name="probability"
              value={formData.probability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="Raro">Raro</option>
              <option value="Pouco Provável">Pouco Provável</option>
              <option value="Provável">Provável</option>
              <option value="Muito Provável">Muito Provável</option>
              <option value="Praticamente Certo">Praticamente Certo</option>
            </select>
            {errors.probability && (
              <p className="text-red-500 text-sm">{errors.probability}</p>
            )}
          </div>

        {/* Impacto */}
          <div className="space-y-2">
            <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
              Impacto
            </label>
            <select
              id="impact"
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione uma opção</option>
              <option value="Muito Baixo">Muito Baixo</option>
              <option value="Baixo">Baixo</option>
              <option value="Médio">Médio</option>
              <option value="Alto">Alto</option>
              <option value="Muito Alto">Muito Alto</option>
            </select>
            {errors.impact && (
              <p className="text-red-500 text-sm">{errors.impact}</p>
            )}
          </div>
        </div>
      
        {/* Justificativa do risco */}
        <div className="space-y-2">
          <label htmlFor="riskJustification" className="block text-sm font-medium text-gray-700">
            Justificativa do risco
          </label>
          <textarea
            id="riskJustification"
            name="riskJustification"
            value={formData.riskJustification}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva a justificativa do risco..."
          ></textarea>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
