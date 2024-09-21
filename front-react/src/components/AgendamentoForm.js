import React, { useState } from "react";
import InputMask from "react-input-mask";
import { criarAgendamento } from "../api"; // Importando a função para criar agendamento
import { toast } from "react-toastify"; // Importando o toast para notificações
import moment from "moment"; // Importando Moment.js

const AgendamentoForm = () => {
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

  // Manipulador para atualizar o estado dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função de validação dos campos do formulário
  const validate = () => {
    let tempErrors = {};
    let valid = true;

    if (!formData.nome) {
      valid = false;
      tempErrors.nome = "Nome é obrigatório";
    }

    if (!formData.sobrenome) {
      valid = false;
      tempErrors.sobrenome = "Sobrenome é obrigatório";
    }

    const numeroLimpo = formData.numero.replace(/[^0-9]/g, "");
    if (!formData.numero || numeroLimpo.length !== 11) {
      valid = false;
      tempErrors.numero =
        "Número de contato é obrigatório e deve conter 11 dígitos";
    }

    if (!formData.horario) {
      valid = false;
      tempErrors.horario = "Horário é obrigatório";
    }

    if (!formData.dia) {
      valid = false;
      tempErrors.dia = "Dia é obrigatório";
    }

    if (!formData.local) {
      valid = false;
      tempErrors.local = "Local é obrigatório";
    }

    setErrors(tempErrors);
    return valid;
  };

  // Manipulador de submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // Converte a data para o formato ISO usando Moment.js
        const dataISO = moment(formData.dia).format("YYYY-MM-DD");

        const agendamentoData = {
          ...formData,
          dia: dataISO, // Substitui o campo "dia" com a versão formatada pelo Moment.js
        };

        await criarAgendamento(agendamentoData);
        toast.success("Agendamento salvo com sucesso!");
        // Limpa os campos do formulário após o sucesso
        setFormData({
          nome: "",
          sobrenome: "",
          numero: "",
          horario: "",
          dia: "",
          local: "",
          observacao: "",
        });
        setErrors({});
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || "Erro desconhecido"
          : "Erro de rede ou problema no servidor";
        toast.error(`Erro ao salvar o agendamento: ${errorMessage}`);
        console.error("Detalhes do erro:", error); // Log mais detalhado no console
      }
    } else {
      toast.error("Por favor, corrija os erros no formulário.");
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-md max-w-xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Agendamento</h2>
      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className="mb-4">
          <label className="block text-gray-700">Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full mt-2 p-3 border ${
              errors.nome ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Digite o nome..."
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        {/* Sobrenome */}
        <div className="mb-4">
          <label className="block text-gray-700">Sobrenome:</label>
          <input
            type="text"
            name="sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            className={`w-full mt-2 p-3 border ${
              errors.sobrenome ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Digite o sobrenome..."
          />
          {errors.sobrenome && (
            <p className="text-red-500 text-sm">{errors.sobrenome}</p>
          )}
        </div>

        {/* Número de Contato */}
        <div className="mb-4">
          <label className="block text-gray-700">Número de Contato:</label>
          <InputMask
            mask="(99) 99999-9999"
            maskChar={null}
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className={`w-full mt-2 p-3 border ${
                  errors.numero ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Digite o número..."
              />
            )}
          </InputMask>
          {errors.numero && (
            <p className="text-red-500 text-sm">{errors.numero}</p>
          )}
        </div>

        {/* Horário Desejado */}
        <div className="mb-4">
          <label className="block text-gray-700">Horário Desejado:</label>
          <input
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            className={`w-full mt-2 p-3 border ${
              errors.horario ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.horario && (
            <p className="text-red-500 text-sm">{errors.horario}</p>
          )}
        </div>

        {/* Dia do Exame */}
        <div className="mb-4">
          <label className="block text-gray-700">Dia do Exame:</label>
          <input
            type="date"
            name="dia"
            value={formData.dia}
            onChange={handleChange}
            className={`w-full mt-2 p-3 border ${
              errors.dia ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.dia && <p className="text-red-500 text-sm">{errors.dia}</p>}
        </div>

        {/* Local (Clínica) */}
        <div className="mb-4">
          <label className="block text-gray-700">Local (Clínica):</label>
          <select
            name="local"
            value={formData.local}
            onChange={handleChange}
            className={`w-full mt-2 p-3 border ${
              errors.local ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Selecione a clínica</option>
            <option value="Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves">
              Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves
            </option>
            <option value="Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 - Centro">
              Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 - Centro
            </option>
            <option value="Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro">
              Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro
            </option>
          </select>
          {errors.local && (
            <p className="text-red-500 text-sm">{errors.local}</p>
          )}
        </div>

        {/* Observação */}
        <div className="mb-6">
          <label className="block text-gray-700">Observação:</label>
          <textarea
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite alguma observação..."
            rows="4"
          ></textarea>
        </div>

        {/* Botão de Submissão */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Salvar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgendamentoForm;
