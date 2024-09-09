import React, { useState } from "react";
import InputMask from "react-input-mask";
import { criarAgendamento } from "../api"; // Importando a função para criar agendamento
import { toast } from "react-toastify"; // Importando o toast para notificações
import moment from "moment"; // Importando Moment.js
const AgendamentoForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    numero: "",
    horario: "",
    dia: "",
    local: "",
    observacao: "",
  });
  const [errors, setErrors] = useState({});

  const nextStep = () => {
    if (validate()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => setStep((prevStep) => prevStep - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    let valid = true;

    if (step === 1) {
      if (!formData.nome) {
        valid = false;
        tempErrors.nome = "Nome é obrigatório";
      }
      if (!formData.sobrenome) {
        valid = false;
        tempErrors.sobrenome = "Sobrenome é obrigatório";
      }
    }

    if (step === 2) {
      const numeroLimpo = formData.numero.replace(/[^0-9]/g, "");
      if (!formData.numero || numeroLimpo.length !== 11) {
        valid = false;
        tempErrors.numero =
          "Número de contato é obrigatório e deve conter 11 dígitos";
      }
    }

    if (step === 3 && !formData.horario) {
      valid = false;
      tempErrors.horario = "Horário é obrigatório";
    }

    if (step === 4 && !formData.dia) {
      valid = false;
      tempErrors.dia = "Dia é obrigatório";
    }

    if (step === 5 && !formData.local) {
      valid = false;
      tempErrors.local = "Local é obrigatório";
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Converta a data para o formato ISO usando Moment.js
        const dataISO = moment(formData.dia).format("YYYY-MM-DD");

        const agendamentoData = {
          ...formData,
          dia: dataISO, // Substitui o campo "dia" com a versão formatada pelo Moment.js
        };

        await criarAgendamento(agendamentoData);
        toast.success("Agendamento salvo com sucesso!");
        setFormData({
          nome: "",
          sobrenome: "",
          numero: "",
          horario: "",
          dia: "",
          local: "",
          observacao: "",
        });
        setStep(1);
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || "Erro desconhecido"
          : "Erro de rede ou problema no servidor";
        toast.error(`Erro ao salvar o agendamento: ${errorMessage}`);
        console.error("Detalhes do erro:", error); // Log mais detalhado no console
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label className="block text-gray-700">Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome..."
            />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome}</p>
            )}
            <label className="block text-gray-700 mt-4">Sobrenome:</label>
            <input
              type="text"
              name="sobrenome"
              value={formData.sobrenome}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o sobrenome..."
            />
            {errors.sobrenome && (
              <p className="text-red-500 text-sm">{errors.sobrenome}</p>
            )}
            <div className="flex justify-between mt-6">
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label className="block text-gray-700">Número de Contato:</label>
            <InputMask
              mask="(99) 99999-9999"
              maskChar={null}
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o número..."
            />
            {errors.numero && (
              <p className="text-red-500 text-sm">{errors.numero}</p>
            )}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block text-gray-700">Horário Desejado:</label>
            <input
              type="time"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.horario && (
              <p className="text-red-500 text-sm">{errors.horario}</p>
            )}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <label className="block text-gray-700">Dia do Exame:</label>
            <input
              type="date"
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dia && <p className="text-red-500 text-sm">{errors.dia}</p>}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <label className="block text-gray-700">Local (Clínica):</label>
            <select
              name="local"
              value={formData.local}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecione a clínica</option>
              <option value="Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves">
                Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves
              </option>
              <option value="Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 - Centro">
                Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 -
                Centro
              </option>
              <option value="Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro">
                Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro
              </option>
            </select>

            {errors.local && (
              <p className="text-red-500 text-sm">{errors.local}</p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <label className="block text-gray-700">Observação:</label>
            <textarea
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite alguma observação..."></textarea>
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Próximo
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Resumo do Agendamento
            </h3>
            <p>
              <strong>Nome:</strong> {formData.nome} {formData.sobrenome}
            </p>
            <p>
              <strong>Número de Contato:</strong> {formData.numero}
            </p>
            <p>
              <strong>Horário:</strong> {formData.horario}
            </p>
            <p>
              <strong>Dia:</strong> {formData.dia}
            </p>
            <p>
              <strong>Local:</strong> {formData.local}
            </p>
            <p>
              <strong>Observação:</strong> {formData.observacao}
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors shadow-md">
                Anterior
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                Salvar Agendamento
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md max-w-xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Agendamento</h2>
      <form onSubmit={handleSubmit}>{renderStep()}</form>
    </div>
  );
};

export default AgendamentoForm;
