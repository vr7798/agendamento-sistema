import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getPerfil, getAgendamentosHoje } from "../api"; // Funções da API
import { toast } from "react-toastify";
import { ClipboardIcon, ChatIcon } from "@heroicons/react/outline"; // Ícones

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const perfil = await getPerfil();
        setUser(perfil);
      } catch (error) {
        toast.error("Erro ao carregar o perfil");
      }
    };

    const carregarAgendamentos = async () => {
      try {
        const agendamentos = await getAgendamentosHoje();
        setAgendamentosHoje(agendamentos);
      } catch (error) {
        toast.error("Erro ao carregar agendamentos");
      }
    };

    carregarPerfil();
    carregarAgendamentos();
  }, []);

  const copiarMensagem = (nome, horario, dia, local) => {
    const mensagem = `Olá ${nome}, seu agendamento foi confirmado para o dia ${new Date(
      dia
    ).toLocaleDateString()} às ${horario} na clínica ${local}. Qualquer dúvida, estamos à disposição!`;
    navigator.clipboard.writeText(mensagem);
    toast.success("Mensagem copiada para o WhatsApp!");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo, {user.username}
          </h1>
          <p className="text-gray-500">
            Último acesso: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Agendamentos de Hoje
          </h2>
          {agendamentosHoje.map((agendamento) => (
            <div
              key={agendamento._id}
              className="flex justify-between items-center bg-gray-50 p-4 mb-3 rounded-lg shadow-sm">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {agendamento.nome} {agendamento.sobrenome}
                </p>
                <p className="text-gray-600">Horário: {agendamento.horario}</p>
                <p className="text-gray-600">
                  Data: {new Date(agendamento.dia).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Local: {agendamento.local}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    copiarMensagem(
                      agendamento.nome,
                      agendamento.horario,
                      agendamento.dia,
                      agendamento.local
                    )
                  }
                  className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition-colors">
                  <ChatIcon className="w-5 h-5 mr-2" />
                  Copiar Mensagem
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
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                  <ClipboardIcon className="w-5 h-5 mr-2" />
                  Copiar para Clipboard
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
