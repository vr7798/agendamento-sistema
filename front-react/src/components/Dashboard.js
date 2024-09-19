import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getPerfil, getAgendamentosFiltrados, getAgendamentosTodos, atualizarEtapaAgendamento } from "../api"; // Importe a nova função
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { FaWhatsapp } from "react-icons/fa"; // Importando ícone do WhatsApp

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agendamentosGerais, setAgendamentosGerais] = useState([]);
  const [dataFiltroInicio, setDataFiltroInicio] = useState("");
  const [dataFiltroFim, setDataFiltroFim] = useState("");
  const [localFiltro, setLocalFiltro] = useState("");
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [periodoFiltro, setPeriodoFiltro] = useState("");
  const [locais, setLocais] = useState([]);
  const [etapas, setEtapas] = useState([]); // Novo estado para etapas

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
        setEtapas(agendamentos.map((agendamento) => agendamento.etapa || "Ainda não consultou")); // Define a etapa inicial
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
        inicio = hoje.clone().add(1, "month").startOf("month").format("YYYY-MM-DD");
        fim = hoje.clone().add(1, "month").endOf("month").format("YYYY-MM-DD");
        break;
      case "mesAnterior":
        inicio = hoje.clone().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
        fim = hoje.clone().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
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
    setDataFiltroInicio(inicio);
    setDataFiltroFim(fim);
    setPeriodoFiltro(periodo);
  };

  const copiarMensagem = (nome, horario, dia, local) => {
    const mensagem = `_*${nome}*_, seu agendamento foi confirmado para o dia _*${moment(dia).tz("America/Sao_Paulo").format("DD/MM/YYYY")}*_ às _*${horario}*_ na clínica *${local}*_. Qualquer dúvida, estamos à disposição!`;

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
      if (!dataFiltroInicio && !dataFiltroFim && !localFiltro && !nomeFiltro) {
        toast.error("Por favor, aplique pelo menos um filtro antes de buscar.");
        return;
      }

      const agendamentos = await getAgendamentosFiltrados(
        dataFiltroInicio || "",
        dataFiltroFim || "",
        localFiltro || "",
        nomeFiltro || ""
      );
      setAgendamentosGerais(agendamentos);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos filtrados.");
      console.error("Erro ao carregar agendamentos filtrados:", error);
    }
  };

  const limparFiltro = async () => {
    setDataFiltroInicio("");
    setDataFiltroFim("");
    setLocalFiltro("");
    setNomeFiltro("");
    setPeriodoFiltro("");

    try {
      const agendamentos = await getAgendamentosTodos();
      setAgendamentosGerais(agendamentos);
    } catch (error) {
      toast.error("Erro ao carregar agendamentos.");
    }
  };

  const alterarEtapa = async (id, index, novaEtapa) => {
    try {
      // Atualiza a etapa no banco de dados
      await atualizarEtapaAgendamento(id, novaEtapa);

      // Atualiza a etapa no estado local
      const novasEtapas = [...etapas];
      novasEtapas[index] = novaEtapa;
      setEtapas(novasEtapas);
    } catch (error) {
      toast.error("Erro ao alterar a etapa do agendamento.");
    }
  };

  // Função para retornar a cor da etapa
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo, {user.username}
          </h1>
          <p className="text-gray-500">Último acesso: {moment().format("DD/MM/YYYY [às] HH:mm")}</p>
        </header>

        <section className="bg-white shadow-lg rounded-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Agendamentos Gerais</h2>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
            <select
              value={periodoFiltro}
              onChange={(e) => ajustarDatasPorPeriodo(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
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
            <input
              type="date"
              value={dataFiltroInicio}
              onChange={(e) => setDataFiltroInicio(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
              placeholder="Data início"
            />
            <input
              type="date"
              value={dataFiltroFim}
              onChange={(e) => setDataFiltroFim(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
              placeholder="Data fim"
            />
            <select
              value={localFiltro}
              onChange={(e) => setLocalFiltro(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
            >
              <option value="">Todos os locais</option>
              {locais.map((local, index) => (
                <option key={index} value={local}>
                  {local}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
              className="w-full lg:w-auto p-3 border border-gray-300 rounded-md"
              placeholder="Nome"
            />
            <button
              onClick={filtrarAgendamentos}
              className="w-full lg:w-auto bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            >
              Filtrar
            </button>
            <button onClick={limparFiltro} className="w-full lg:w-auto bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400">
              Limpar filtros
            </button>
          </div>
          <div>
            {agendamentosGerais.length > 0 ? (
              <ul>
                {agendamentosGerais.map((agendamento, index) => (
                  <li key={agendamento._id} className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50 relative">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {agendamento.nome} {agendamento.sobrenome}
                    </h3>
                    <p>Data: {moment(agendamento.dia).tz("America/Sao_Paulo").format("DD/MM/YYYY")}</p>
                    <p>Horário: {agendamento.horario}</p>
                    <p>Local: {agendamento.local}</p>

                    {/* Indicador da etapa */}
                    <div className={`flex items-center absolute top-2 right-16 p-2 rounded-md ${getEtapaColor(etapas[index])}`}>
                      <span className="text-white font-semibold">{etapas[index]}</span>
                    </div>

                    <select
                      value={etapas[index]}
                      onChange={(e) => alterarEtapa(agendamento._id, index, e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Consultou">Consultou</option>
                      <option value="Ainda não consultou">Ainda não consultou</option>
                      <option value="Desistiu">Desistiu</option>
                    </select>

                    <button
                      onClick={() =>
                        copiarMensagem(agendamento.nome, agendamento.horario, agendamento.dia, agendamento.local)
                      }
                      className="flex items-center bg-green-500 text-white p-1 rounded-full hover:bg-green-600 absolute top-2 right-2"
                    >
                      <FaWhatsapp className="mr-1" size={16} />
                    </button>
                  </li>
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
