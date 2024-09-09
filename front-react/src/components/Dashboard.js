import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  getPerfil,
  getAgendamentosHoje,
  getAgendamentosFiltrados,
  getMedicos,
} from "../api"; // Adicionei getMedicos
import { toast } from "react-toastify";
import {
  ClipboardIcon,
  ChatIcon,
  FilterIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import moment from "moment-timezone";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);
  const [agendamentosGerais, setAgendamentosGerais] = useState([]);
  const [dataFiltro, setDataFiltro] = useState("");
  const [medicoFiltro, setMedicoFiltro] = useState("");
  const [medicos, setMedicos] = useState([]); // Estado para armazenar a lista de médicos

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const perfil = await getPerfil();
        setUser(perfil);
      } catch (error) {
        toast.error("Erro ao carregar o perfil");
      }
    };

    const carregarAgendamentosHoje = async () => {
      try {
        const agendamentos = await getAgendamentosHoje();
        setAgendamentosHoje(agendamentos);
      } catch (error) {
        toast.error("Erro ao carregar agendamentos de hoje");
      }
    };

    const carregarMedicos = async () => {
      try {
        const listaMedicos = await getMedicos(); // Nova função para buscar médicos
        setMedicos(listaMedicos); // Preenche o estado com a lista de médicos
      } catch (error) {
        toast.error("Erro ao carregar lista de médicos");
      }
    };

    carregarPerfil();
    carregarAgendamentosHoje();
    carregarMedicos(); // Chama a função para carregar médicos
  }, []);

  const copiarMensagem = (nome, horario, dia, local) => {
    const mensagem = `_*${nome}*_, seu agendamento foi confirmado para o dia _*${moment(
      dia
    )
      .tz("America/Sao_Paulo")
      .format(
        "DD/MM/YYYY"
      )}*_ às _*${horario}* na clínica *${local}*_. Qualquer dúvida, estamos à disposição!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(mensagem)
        .then(() => {
          toast.success("Mensagem copiada para o WhatsApp!");
        })
        .catch((err) => {
          toast.error("Erro ao copiar a mensagem");
          console.error("Erro ao copiar: ", err);
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = mensagem;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast.success("Mensagem copiada para o WhatsApp!");
      } catch (err) {
        toast.error("Erro ao copiar a mensagem");
        console.error("Erro ao copiar: ", err);
      }
      document.body.removeChild(textarea);
    }
  };

  const filtrarAgendamentos = async () => {
    try {
      // Verificar se não há nenhum filtro aplicado
      if (!dataFiltro && !medicoFiltro) {
        toast.error("Por favor, aplique algum filtro antes de buscar.");
        setAgendamentosGerais([]); // Limpar a lista de agendamentos gerais
        return; // Sai da função se não houver filtros
      }

      console.log("Filtros aplicados:", { dataFiltro, medicoFiltro }); // Log para verificar os filtros

      const agendamentos = await getAgendamentosFiltrados(
        dataFiltro,
        medicoFiltro
      );
      console.log("Agendamentos filtrados:", agendamentos); // Verificar o retorno

      setAgendamentosGerais(agendamentos); // Atualizar a lista de agendamentos filtrados
    } catch (error) {
      toast.error("Erro ao carregar agendamentos filtrados.");
    }
  };

  const limparFiltro = () => {
    // Limpar os valores dos filtros
    setDataFiltro("");
    setMedicoFiltro("");
    setAgendamentosGerais([]); // Limpar a lista de agendamentos ao limpar o filtro
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo, {user.username}
          </h1>
          <p className="text-gray-500">
            Último acesso: {moment().format("DD/MM/YYYY [às] HH:mm")}
          </p>
        </header>

        {/* Filtros e Agendamentos Gerais */}
        <section className="bg-white shadow-lg rounded-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Agendamentos Gerais
          </h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
            <input
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
              placeholder="Filtrar por data"
            />
            <select
              value={medicoFiltro}
              onChange={(e) => setMedicoFiltro(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md">
              <option value="">Todos os médicos</option>
              {medicos.map((medico, index) => (
                <option key={index} value={medico}>
                  {medico}
                </option>
              ))}
            </select>
            <button
              onClick={filtrarAgendamentos}
              className="bg-blue-500 text-white py-3 px-6 rounded-md flex items-center hover:bg-blue-600 transition-colors">
              <FilterIcon className="w-5 h-5 mr-2" />
              Filtrar
            </button>
            <button
              onClick={limparFiltro}
              className="bg-gray-400 text-white py-3 px-6 rounded-md flex items-center hover:bg-gray-500 transition-colors">
              <RefreshIcon className="w-5 h-5 mr-2" />
              Limpar Filtro
            </button>
          </div>

          {/* Lista de Agendamentos Gerais */}
          {agendamentosGerais.length === 0 ? (
            <p className="text-gray-600">Nenhum agendamento encontrado.</p>
          ) : (
            agendamentosGerais.map((agendamento) => (
              <div
                key={agendamento._id}
                className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between items-start lg:items-center bg-gray-50 p-4 mb-3 rounded-lg shadow-sm">
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Nome: {agendamento.nome} {agendamento.sobrenome}
                  </p>
                  <p className="text-gray-600">Número: {agendamento.numero}</p>
                  <p className="text-gray-600">
                    Horário: {agendamento.horario}
                  </p>
                  <p className="text-gray-600">
                    Data:{" "}
                    {moment(agendamento.dia)
                      .tz("America/Sao_Paulo")
                      .format("DD/MM/YYYY")}
                  </p>
                  <p className="text-gray-600">Local: {agendamento.local}</p>
                  <p className="text-gray-600">
                    Observação: {agendamento.observacao || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-3">
                  <button
                    onClick={() =>
                      copiarMensagem(
                        agendamento.nome,
                        agendamento.horario,
                        agendamento.dia,
                        agendamento.local
                      )
                    }
                    className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition-colors shadow-md">
                    <ChatIcon className="w-5 h-5 mr-2" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      copiarMensagem(
                        agendamento.nome,
                        agendamento.horario,
                        agendamento.dia,
                        agendamento.local
                      )
                    }
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors shadow-md">
                    <ClipboardIcon className="w-5 h-5 mr-2" />
                    Clipboard
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Agendamentos de Hoje */}
        <section className="bg-white shadow-lg rounded-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Agendamentos de Hoje
          </h2>
          {agendamentosHoje.length === 0 ? (
            <p className="text-gray-600">Nenhum agendamento para hoje.</p>
          ) : (
            agendamentosHoje.map((agendamento) => (
              <div
                key={agendamento._id}
                className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row justify-between items-start lg:items-center bg-gray-50 p-4 mb-3 rounded-lg shadow-sm">
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    Nome: {agendamento.nome} {agendamento.sobrenome}
                  </p>
                  <p className="text-gray-600">Número: {agendamento.numero}</p>
                  <p className="text-gray-600">
                    Horário: {agendamento.horario}
                  </p>
                  <p className="text-gray-600">
                    Data:
                    {moment(agendamento.dia)
                      .tz("America/Sao_Paulo")
                      .format("DD/MM/YYYY")}
                  </p>
                  <p className="text-gray-600">Local: {agendamento.local}</p>
                  <p className="text-gray-600">
                    Observação: {agendamento.observacao || "N/A"}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:space-x-3">
                  <button
                    onClick={() =>
                      copiarMensagem(
                        agendamento.nome,
                        agendamento.horario,
                        agendamento.dia,
                        agendamento.local
                      )
                    }
                    className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition-colors shadow-md">
                    <ChatIcon className="w-5 h-5 mr-2" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      copiarMensagem(
                        agendamento.nome,
                        agendamento.horario,
                        agendamento.dia,
                        agendamento.local
                      )
                    }
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors shadow-md">
                    <ClipboardIcon className="w-5 h-5 mr-2" />
                    Clipboard
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
