// src/components/Dashboard.js

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import {
  getPerfil,
  getAgendamentosFiltrados,
  getAgendamentosTodos,
  atualizarEtapaAgendamento,
  adicionarOcorrencia as apiAdicionarOcorrencia,
} from "../api";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FaWhatsapp, FaPhone, FaEllipsisH } from "react-icons/fa";
import PropTypes from "prop-types";

// Função para obter a cor da etapa
const getEtapaColor = (etapa) => {
  switch (etapa) {
    case "Consultou - Comprou":
      return "bg-green-400";
    case "Consultou - Comprou em Outra Ótica":
      return "bg-blue-400";
    case "Consultou - Não Comprou":
      return "bg-yellow-400";
    case "Não Consultou ainda":
      return "bg-gray-400";
    case "Desistiu":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};

// Componente Modal para Adicionar Ocorrências
const ModalOcorrencia = ({
  isVisible,
  onClose,
  onEnviar,
  mensagem,
  setMensagem,
  usuario,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Adicionar Ocorrência</h2>

        <p className="mb-2">
          <strong>Usuário:</strong> {usuario.username}
        </p>

        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Informe a mensagem"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Voltar
          </button>
          <button
            onClick={onEnviar}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalOcorrencia.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnviar: PropTypes.func.isRequired,
  mensagem: PropTypes.string.isRequired,
  setMensagem: PropTypes.func.isRequired,
  usuario: PropTypes.object.isRequired,
};

// Componente de Filtros de Agendamentos
const FiltroAgendamentos = ({
  filtros,
  setFiltros,
  locais,
  ajustarDatasPorPeriodo,
  filtrarAgendamentos,
  limparFiltro,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="bg-white shadow-lg rounded-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Filtros de Agendamentos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Campo Período */}
        <div>
          <label className="block text-gray-700 mb-1">Período</label>
          <select
            name="periodo"
            value={filtros.periodo}
            onChange={(e) => ajustarDatasPorPeriodo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecionar período</option>
            <option value="hoje">Hoje</option>
            <option value="ontem">Ontem</option>
            <option value="amanha">Amanhã</option>
            <option value="ultimos7dias">Últimos 7 dias</option>
            <option value="ultimos30dias">Últimos 30 dias</option>
            <option value="esteMes">Este mês</option>
            <option value="proximoMes">Próximo mês</option>
            <option value="mesAnterior">Mês anterior</option>
            <option value="esteAno">Este ano</option>
          </select>
        </div>

        {/* Campo Data Início */}
        <div>
          <label className="block text-gray-700 mb-1">Data Início</label>
          <input
            type="date"
            name="dataInicio"
            value={filtros.dataInicio}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Campo Data Fim */}
        <div>
          <label className="block text-gray-700 mb-1">Data Fim</label>
          <input
            type="date"
            name="dataFim"
            value={filtros.dataFim}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Campo Local */}
        <div>
          <label className="block text-gray-700 mb-1">Local</label>
          <select
            name="local"
            value={filtros.local}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os locais</option>
            {locais.map((local, index) => (
              <option key={index} value={local}>
                {local}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Etapa */}
        <div>
          <label className="block text-gray-700 mb-1">Etapa</label>
          <select
            name="etapa"
            value={filtros.etapa}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as etapas</option>
            <option value="Consultou - Comprou">Consultou - Comprou</option>
            <option value="Consultou - Comprou em Outra Ótica">
              Consultou - Comprou em Outra Ótica
            </option>
            <option value="Consultou - Não Comprou">Consultou - Não Comprou</option>
            <option value="Não Consultou ainda">Não Consultou ainda</option>
            <option value="Desistiu">Desistiu</option>
          </select>
        </div>

        {/* Campo Nome */}
        <div>
          <label className="block text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={filtros.nome}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={filtrarAgendamentos}
          className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Filtrar
        </button>
        <button
          onClick={limparFiltro}
          className="w-full sm:w-auto bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
};

FiltroAgendamentos.propTypes = {
  filtros: PropTypes.object.isRequired,
  setFiltros: PropTypes.func.isRequired,
  locais: PropTypes.array.isRequired,
  ajustarDatasPorPeriodo: PropTypes.func.isRequired,
  filtrarAgendamentos: PropTypes.func.isRequired,
  limparFiltro: PropTypes.func.isRequired,
};

// Componente Card de Agendamento (modificado)
const CardAgendamento = ({
  agendamento,
  etapa,
  index,
  alterarEtapa,
  copiarMensagem,
  abrirModalOcorrencia,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar o dropdown de ocorrências
  const [etapaOpen, setEtapaOpen] = useState(false); // Estado para controlar o dropdown de alterar etapa
  const [mensagemSelectOpen, setMensagemSelectOpen] = useState(false); // Estado para controlar o dropdown de mensagem
  const [tipoMensagem, setTipoMensagem] = useState("default"); // Estado para armazenar o tipo de mensagem selecionada

  // Função para gerar a mensagem com base no tipo selecionado
  const gerarMensagem = () => {
    const nome = agendamento.nome;
    const horario = agendamento.horario;
    const dia = agendamento.dia;
    const local = agendamento.local;

    if (tipoMensagem === "lembrandoAgendamento") {
      return `Olá, *${nome}!* Este é um lembrete do seu agendamento no dia *${moment(
        dia
      )
        .tz("America/Sao_Paulo")
        .format(
          "DD/MM/YYYY"
        )}* às *${horario}* na clínica *${local}*. Se precisar alterar ou cancelar, por favor, nos avise. Agradecemos!`;
    }

    // Mensagem padrão (confirmação de agendamento)
    return `_*${nome}*_, seu agendamento foi confirmado para o dia _*${moment(
      dia
    )
      .tz("America/Sao_Paulo")
      .format(
        "DD/MM/YYYY"
      )}*_ às _*${horario}*_ na clínica *${local}*_. Qualquer dúvida, estamos à disposição!`;
  };

  return (
    <li className="p-6 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow mb-6">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {agendamento.nome} {agendamento.sobrenome}
          </h3>
          <p className="mt-2 text-gray-600">
            <span className="font-medium">Data:</span>{" "}
            {moment(agendamento.dia)
              .tz("America/Sao_Paulo")
              .format("DD/MM/YYYY")}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Horário:</span> {agendamento.horario}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Local:</span> {agendamento.local}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Número:</span>{" "}
            <span className="flex items-center">
              <FaPhone className="mr-1" /> {agendamento.numero}
            </span>
          </p>

          {agendamento.observacao && (
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Observação:</span>{" "}
              {agendamento.observacao}
            </p>
          )}
        </div>

        {/* Indicador da etapa (modificado) */}
        <div
          className={`flex items-center mt-4 md:mt-0 w-40 h-6 ${getEtapaColor(
            etapa
          )} rounded-full justify-center`}
        >
          <span className="text-white text-xs truncate">{etapa}</span>
        </div>
      </div>

      {/* Botões alinhados lado a lado */}
      <div className="flex flex-col sm:flex-row mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Botão Alterar Etapa */}
        <div className="relative w-full sm:w-64">
          {" "}
          {/* Defina uma largura maior aqui */}
          <button
            onClick={() => setEtapaOpen(!etapaOpen)}
            className="w-full sm:w-64 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
          >
            Alterar Etapa
          </button>
          {etapaOpen && (
            <div className="absolute left-0 mt-2 w-full sm:w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  alterarEtapa(agendamento._id, index, "Consultou - Comprou");
                  setEtapaOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Consultou - Comprou
              </button>
              <button
                onClick={() => {
                  alterarEtapa(
                    agendamento._id,
                    index,
                    "Consultou - Comprou em Outra Ótica"
                  );
                  setEtapaOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Consultou - Comprou em Outra Ótica
              </button>
              <button
                onClick={() => {
                  alterarEtapa(
                    agendamento._id,
                    index,
                    "Consultou - Não Comprou"
                  );
                  setEtapaOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Consultou - Não Comprou
              </button>
              <button
                onClick={() => {
                  alterarEtapa(agendamento._id, index, "Não Consultou ainda");
                  setEtapaOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Não Consultou ainda
              </button>
              <button
                onClick={() => {
                  alterarEtapa(agendamento._id, index, "Desistiu");
                  setEtapaOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
              >
                Desistiu
              </button>
            </div>
          )}
        </div>

        {/* Botão Escolher Mensagem */}
        <div className="relative w-full sm:w-64">
          <button
            onClick={() => setMensagemSelectOpen(!mensagemSelectOpen)}
            className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
          >
            Escolher Mensagem
          </button>
          {mensagemSelectOpen && (
            <div className="absolute left-0 mt-2 w-full sm:w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              <select
                onChange={(e) => {
                  setTipoMensagem(e.target.value);
                  setMensagemSelectOpen(false);
                }}
                defaultValue="default"
                className="w-full px-4 py-2 text-sm text-gray-700 bg-white border-none focus:outline-none"
              >
                <option value="default" disabled>
                  Selecione uma mensagem
                </option>
                <option value="confirmacaoAgendamento">
                  Mensagem de Confirmação de Agendamento
                </option>
                <option value="lembrandoAgendamento">
                  Mensagem de Lembrete de Agendamento
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Botão Copiar Mensagem (WhatsApp) */}
        <button
          onClick={() => {
            if (tipoMensagem === "default") {
              toast.error("Por favor, escolha um tipo de mensagem primeiro.");
              return;
            }
            copiarMensagem(gerarMensagem());
          }}
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
          title="Copiar mensagem para WhatsApp"
        >
          <FaWhatsapp size={18} className="mr-2" /> WhatsApp
        </button>

        {/* Botão Adicionar Ocorrência */}
        <button
          onClick={() => abrirModalOcorrencia(agendamento._id)}
          className="w-full sm:w-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
        >
          Adicionar Ocorrência
        </button>
      </div>

      {/* Botão para Toggle do Dropdown de Ocorrências */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="mt-6 w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-200 flex items-center justify-center"
      >
        {dropdownOpen ? "Ocultar Ocorrências" : "Ver Ocorrências"}
        <FaEllipsisH className="ml-2" />
      </button>

      {/* Renderização Condicional das Ocorrências */}
      {dropdownOpen && (
        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-2">Ocorrências:</h4>
          {agendamento.ocorrencias && agendamento.ocorrencias.length > 0 ? (
            <ul className="list-disc list-inside">
              {agendamento.ocorrencias.map((ocorrencia, idx) => (
                <li key={idx} className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">{ocorrencia.nomeUsuario}:</span>{" "}
                  {ocorrencia.mensagem} -{" "}
                  {moment(ocorrencia.data).format("DD/MM/YYYY HH:mm")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma ocorrência registrada.</p>
          )}
        </div>
      )}
    </li>
  );
};

CardAgendamento.propTypes = {
  agendamento: PropTypes.object.isRequired,
  etapa: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  alterarEtapa: PropTypes.func.isRequired,
  copiarMensagem: PropTypes.func.isRequired,
  abrirModalOcorrencia: PropTypes.func.isRequired,
};

// Componente Dashboard
const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agendamentosGerais, setAgendamentosGerais] = useState([]);
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    local: "",
    nome: "",
    periodo: "",
    etapa: "", // Nova propriedade adicionada
  });
  const [locais, setLocais] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagemOcorrencia, setMensagemOcorrencia] = useState("");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar Perfil, Locais e Agendamentos
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const [perfil, agendamentos] = await Promise.all([
          getPerfil(),
          getAgendamentosTodos(),
        ]);
        setUser(perfil);
        setAgendamentosGerais(agendamentos);
        setEtapas(
          agendamentos.map(
            (agendamento) => agendamento.etapa || "Não Consultou ainda"
          )
        );
        setLocais([
          "Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves",
          "Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 - Centro",
          "Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro",
        ]);
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  // Função para ajustar datas com base no período selecionado
  const ajustarDatasPorPeriodo = useCallback((periodo) => {
    let inicio, fim;
    const hoje = moment().startOf("day");
    switch (periodo) {
      case "hoje":
        inicio = hoje.format("YYYY-MM-DD");
        fim = hoje.format("YYYY-MM-DD");
        break;
      case "ontem":
        inicio = hoje.clone().subtract(1, "day").format("YYYY-MM-DD");
        fim = hoje.clone().subtract(1, "day").format("YYYY-MM-DD");
        break;
      case "amanha":
        inicio = hoje.clone().add(1, "day").format("YYYY-MM-DD");
        fim = hoje.clone().add(1, "day").format("YYYY-MM-DD");
        break;
      case "ultimos7dias":
        inicio = hoje.clone().subtract(7, "days").format("YYYY-MM-DD");
        fim = hoje.format("YYYY-MM-DD");
        break;
      case "ultimos30dias":
        inicio = hoje.clone().subtract(30, "days").format("YYYY-MM-DD");
        fim = hoje.format("YYYY-MM-DD");
        break;
      case "esteMes":
        inicio = hoje.clone().startOf("month").format("YYYY-MM-DD");
        fim = hoje.clone().endOf("month").format("YYYY-MM-DD");
        break;
      case "proximoMes":
        inicio = hoje
          .clone()
          .add(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        fim = hoje.clone().add(1, "month").endOf("month").format("YYYY-MM-DD");
        break;
      case "mesAnterior":
        inicio = hoje
          .clone()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        fim = hoje
          .clone()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        break;
      case "esteAno":
        inicio = hoje.clone().startOf("year").format("YYYY-MM-DD");
        fim = hoje.clone().endOf("year").format("YYYY-MM-DD");
        break;
      default:
        inicio = "";
        fim = "";
        break;
    }
    setFiltros((prev) => ({
      ...prev,
      dataInicio: inicio,
      dataFim: fim,
      periodo: periodo,
    }));
  }, []);

  // Função para copiar mensagem para o WhatsApp
  const copiarMensagem = useCallback((mensagem) => {
    if (!mensagem) {
      toast.error("Mensagem inválida.");
      return;
    }

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
  }, []);

  // Função para filtrar agendamentos
  const filtrarAgendamentos = useCallback(async () => {
    try {
      const { dataInicio, dataFim, local, nome, etapa } = filtros;
      if (!dataInicio && !dataFim && !local && !nome && !etapa) {
        toast.error("Por favor, aplique pelo menos um filtro antes de buscar.");
        return;
      }

      setIsLoading(true);
      const agendamentos = await getAgendamentosFiltrados(
        dataInicio || "",
        dataFim || "",
        local || "",
        nome || "",
        etapa || "" // Envia o novo parâmetro 'etapa'
      );
      setAgendamentosGerais(agendamentos);
      setEtapas(
        agendamentos.map(
          (agendamento) => agendamento.etapa || "Não Consultou ainda"
        )
      );
      toast.success("Agendamentos filtrados com sucesso!");
    } catch (error) {
      toast.error("Erro ao carregar agendamentos filtrados.");
      console.error("Erro ao carregar agendamentos filtrados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  // Função para limpar filtros
  const limparFiltro = useCallback(async () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      local: "",
      nome: "",
      periodo: "",
      etapa: "", // Limpa o filtro 'etapa'
    });

    try {
      setIsLoading(true);
      const agendamentos = await getAgendamentosTodos();
      setAgendamentosGerais(agendamentos);
      setEtapas(
        agendamentos.map(
          (agendamento) => agendamento.etapa || "Não Consultou ainda"
        )
      );
      toast.success("Filtros limpos e agendamentos recarregados.");
    } catch (error) {
      toast.error("Erro ao carregar agendamentos.");
      console.error("Erro ao carregar agendamentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para alterar a etapa de um agendamento
  const alterarEtapa = useCallback(async (id, index, novaEtapa) => {
    try {
      await atualizarEtapaAgendamento(id, novaEtapa);
      setEtapas((prev) => {
        const novasEtapas = [...prev];
        novasEtapas[index] = novaEtapa;
        return novasEtapas;
      });
      toast.success(`Etapa alterada para "${novaEtapa}".`);
    } catch (error) {
      toast.error("Erro ao alterar etapa.");
      console.error("Erro ao alterar etapa:", error);
    }
  }, []);

  // Função para abrir a modal de ocorrência
  const abrirModalOcorrencia = useCallback((idAgendamento) => {
    setAgendamentoSelecionado(idAgendamento);
    setModalVisible(true);
  }, []);

  // Função para enviar a ocorrência
  const enviarOcorrencia = useCallback(async () => {
    if (mensagemOcorrencia.trim() === "") {
      toast.error("Por favor, informe a mensagem.");
      return;
    }

    try {
      await apiAdicionarOcorrencia(agendamentoSelecionado, {
        mensagem: mensagemOcorrencia,
        nomeUsuario: user.username,
      });

      // Recarregar agendamentos para refletir a nova ocorrência
      const agendamentos = await getAgendamentosTodos();
      setAgendamentosGerais(agendamentos);
      setEtapas(
        agendamentos.map(
          (agendamento) => agendamento.etapa || "Não Consultou ainda"
        )
      );

      setModalVisible(false);
      setMensagemOcorrencia("");
      setAgendamentoSelecionado(null);
      toast.success("Ocorrência adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar ocorrência.");
      console.error("Erro ao adicionar ocorrência:", error);
    }
  }, [agendamentoSelecionado, mensagemOcorrencia, user.username]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 pt-20 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo(a) ao AgendaVisão, {user.username || "Usuário"}!
          </h1>
          <p className="text-gray-500 mt-2">
            Último acesso: {moment().format("DD/MM/YYYY [às] HH:mm")}
          </p>
        </header>

        {/* Componente de Filtros */}
        <FiltroAgendamentos
          filtros={filtros}
          setFiltros={setFiltros}
          locais={locais}
          ajustarDatasPorPeriodo={ajustarDatasPorPeriodo}
          filtrarAgendamentos={filtrarAgendamentos}
          limparFiltro={limparFiltro}
        />

        <section className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Agendamentos Gerais
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : agendamentosGerais.length > 0 ? (
            <ul>
              {agendamentosGerais.map((agendamento, index) => (
                <CardAgendamento
                  key={agendamento._id}
                  agendamento={agendamento}
                  etapa={etapas[index]}
                  index={index}
                  alterarEtapa={alterarEtapa}
                  copiarMensagem={copiarMensagem}
                  abrirModalOcorrencia={abrirModalOcorrencia}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          )}
        </section>
      </div>

      {/* Modal para Adicionar Ocorrência */}
      <ModalOcorrencia
        isVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setMensagemOcorrencia("");
          setAgendamentoSelecionado(null);
        }}
        onEnviar={enviarOcorrencia}
        mensagem={mensagemOcorrencia}
        setMensagem={setMensagemOcorrencia}
        usuario={user}
      />
    </div>
  );
};

export default Dashboard;
