import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  getPerfil,
  getAgendamentosFiltrados,
  getAgendamentosTodos,
  atualizarEtapaAgendamento,
} from "../api";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FaWhatsapp, FaPhone } from "react-icons/fa"; // Importando ícones adicionais

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agendamentosGerais, setAgendamentosGerais] = useState([]);
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    local: "",
    nome: "",
    periodo: "",
  });
  const [locais, setLocais] = useState([]);
  const [etapas, setEtapas] = useState([]);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const perfil = await getPerfil();
        setUser(perfil);
      } catch (error) {
        toast.error("Erro ao carregar o perfil");
      }
    };

    const carregarLocais = () => {
      setLocais([
        "Dra. Iara Negreiros - Av. São Sebastião, 1176 - Tancredo Neves",
        "Dr. Joselito - Clínica Saúde & Vida - Av. Ville Roy, 5623 - Centro",
        "Dra. Imery Sampaio - Av. Maj. Williams, 2067 - Centro",
      ]);
    };

    const carregarAgendamentos = async () => {
      try {
        const agendamentos = await getAgendamentosTodos();
        setAgendamentosGerais(agendamentos);
        setEtapas(
          agendamentos.map(
            (agendamento) => agendamento.etapa || "Ainda não consultou"
          )
        );
      } catch (error) {
        toast.error("Erro ao carregar agendamentos.");
      }
    };

    carregarPerfil();
    carregarLocais();
    carregarAgendamentos();
  }, []);

  const ajustarDatasPorPeriodo = (periodo) => {
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
  };

  const copiarMensagem = (nome, horario, dia, local) => {
    const mensagem = `_*${nome}*_, seu agendamento foi confirmado para o dia _*${moment(
      dia
    )
      .tz("America/Sao_Paulo")
      .format("DD/MM/YYYY")}*_ às _*${horario}*_ na clínica *${local}*_. Qualquer dúvida, estamos à disposição!`;

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
      const { dataInicio, dataFim, local, nome } = filtros;
      if (!dataInicio && !dataFim && !local && !nome) {
        toast.error("Por favor, aplique pelo menos um filtro antes de buscar.");
        return;
      }

      const agendamentos = await getAgendamentosFiltrados(
        dataInicio || "",
        dataFim || "",
        local || "",
        nome || ""
      );
      setAgendamentosGerais(agendamentos);
      setEtapas(
        agendamentos.map(
          (agendamento) => agendamento.etapa || "Ainda não consultou"
        )
      );
    } catch (error) {
      toast.error("Erro ao carregar agendamentos filtrados.");
      console.error("Erro ao carregar agendamentos filtrados:", error);
    }
  };

  const limparFiltro = async () => {
    setFiltros({
      dataInicio: "",
      dataFim: "",
      local: "",
      nome: "",
      periodo: "",
    });

    try {
      const agendamentos = await getAgendamentosTodos();
      setAgendamentosGerais(agendamentos);
      setEtapas(
        agendamentos.map(
          (agendamento) => agendamento.etapa || "Ainda não consultou"
        )
      );
    } catch (error) {
      toast.error("Erro ao carregar agendamentos.");
    }
  };

  const alterarEtapa = async (id, index, novaEtapa) => {
    try {
      await atualizarEtapaAgendamento(id, novaEtapa);
      const novasEtapas = [...etapas];
      novasEtapas[index] = novaEtapa;
      setEtapas(novasEtapas);
    } catch (error) {
      toast.error("Erro ao alterar a etapa do agendamento.");
    }
  };

  const getEtapaColor = (etapa) => {
    switch (etapa) {
      case "Consultou":
        return "bg-green-500";
      case "Ainda não consultou":
        return "bg-yellow-500";
      case "Desistiu":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Componente Interno para Filtros
  const FiltroAgendamentos = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Período</label>
            <select
              name="periodo"
              value={filtros.periodo}
              onChange={(e) => ajustarDatasPorPeriodo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
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

          <div>
            <label className="block text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Local</label>
            <select
              name="local"
              value={filtros.local}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos os locais</option>
              {locais.map((local, index) => (
                <option key={index} value={local}>
                  {local}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={filtros.nome}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nome"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={filtrarAgendamentos}
            className="flex-1 sm:flex-none bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Filtrar
          </button>
          <button
            onClick={limparFiltro}
            className="flex-1 sm:flex-none bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400"
          >
            Limpar filtros
          </button>
        </div>
      </section>
    );
  };

  // Componente Interno para cada Card de Agendamento
  const CardAgendamento = ({ agendamento, etapa, index }) => {
    return (
      <li className="p-4 border border-gray-300 rounded-md bg-gray-50 relative">
        <h3 className="text-lg font-semibold text-gray-800">
          {agendamento.nome} {agendamento.sobrenome}
        </h3>
        <p className="mt-1">
          <span className="font-medium">Data:</span>{" "}
          {moment(agendamento.dia)
            .tz("America/Sao_Paulo")
            .format("DD/MM/YYYY")}
        </p>
        <p>
          <span className="font-medium">Horário:</span> {agendamento.horario}
        </p>
        <p>
          <span className="font-medium">Local:</span> {agendamento.local}
        </p>
        <p>
          <span className="font-medium">Número:</span>{" "}
          <a
            href={`tel:${agendamento.numero}`}
            className="text-blue-500 hover:underline flex items-center"
          >
            <FaPhone className="mr-1" /> {agendamento.numero}
          </a>
        </p>
        {agendamento.observacao && (
          <p className="mt-1">
            <span className="font-medium">Observação:</span>{" "}
            {agendamento.observacao}
          </p>
        )}

        {/* Indicador da etapa */}
        <div
          className={`flex items-center absolute top-2 right-16 p-2 rounded-md ${getEtapaColor(
            etapa
          )}`}
        >
          <span className="text-white font-semibold text-xs">{etapa}</span>
        </div>

        {/* Dropdown para alterar etapa */}
        <select
          value={etapas[index]}
          onChange={(e) =>
            alterarEtapa(agendamento._id, index, e.target.value)
          }
          className="mt-2 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="Consultou">Consultou</option>
          <option value="Ainda não consultou">Ainda não consultou</option>
          <option value="Desistiu">Desistiu</option>
        </select>

        {/* Botão de copiar mensagem */}
        <button
          onClick={() =>
            copiarMensagem(
              agendamento.nome,
              agendamento.horario,
              agendamento.dia,
              agendamento.local
            )
          }
          className="flex items-center bg-green-500 text-white p-2 rounded-full hover:bg-green-600 absolute top-2 right-2"
          title="Copiar mensagem para WhatsApp"
        >
          <FaWhatsapp size={16} />
        </button>
      </li>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo, {user.username}
          </h1>
          <p className="text-gray-500 mt-2 md:mt-0">
            Último acesso:{" "}
            {moment().format("DD/MM/YYYY [às] HH:mm")}
          </p>
        </header>

        {/* Componente de Filtros */}
        <FiltroAgendamentos />

        <section className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Agendamentos Gerais
          </h2>
          <div>
            {agendamentosGerais.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agendamentosGerais.map((agendamento, index) => (
                  <CardAgendamento
                    key={agendamento._id}
                    agendamento={agendamento}
                    etapa={etapas[index]}
                    index={index}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum agendamento encontrado.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
