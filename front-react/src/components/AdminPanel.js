import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import Navbar from "./Navbar";

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const usuariosResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users`,
          config
        );
        const agendamentosResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/agendamentos`,
          config
        );
        setUsuarios(usuariosResponse.data);
        setAgendamentos(agendamentosResponse.data);
        setLoading(false);
      } catch (error) {
        toast.error("Erro ao carregar dados.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const excluirUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/${id}`,
        config
      );
      setUsuarios(usuarios.filter((user) => user._id !== id));
      toast.success("Usuário excluído com sucesso.");
    } catch (error) {
      toast.error("Erro ao excluir usuário.");
    }
  };

  const excluirAgendamento = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/agendamentos/${id}`,
        config
      );
      setAgendamentos(
        agendamentos.filter((agendamento) => agendamento._id !== id)
      );
      toast.success("Agendamento excluído com sucesso.");
    } catch (error) {
      toast.error("Erro ao excluir agendamento.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-16"> {/* Ajuste o padding-top aqui */}
      <Navbar /> {/* Inclui o Navbar */}
      <div className="p-4 lg:p-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8 text-center lg:text-left">
          Painel Administrativo
        </h1>
        {loading ? (
          <p className="text-center text-lg">Carregando dados...</p>
        ) : (
          <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Seção de Usuários */}
            <section className="bg-white shadow-md rounded-lg p-4 lg:p-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-4 text-center lg:text-left">
                Usuários
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-sm lg:text-base">
                      <th className="py-2 px-3 text-left">Username</th>
                      <th className="py-2 px-3 text-left">Role</th>
                      <th className="py-2 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-100 transition-colors">
                        <td className="py-2 px-3 border-b">{user.username}</td>
                        <td className="py-2 px-3 border-b capitalize">
                          {user.role}
                        </td>
                        <td className="py-2 px-3 border-b text-center">
                          <button
                            onClick={() => excluirUsuario(user._id)}
                            className="bg-red-600 text-white py-1 px-2 lg:py-2 lg:px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md text-xs lg:text-sm">
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Seção de Agendamentos */}
            <section className="bg-white shadow-md rounded-lg p-4 lg:p-6">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-4 text-center lg:text-left">
                Agendamentos
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-200 text-sm lg:text-base">
                      <th className="py-2 px-3 text-left">Nome</th>
                      <th className="py-2 px-3 text-left">Sobrenome</th>
                      <th className="py-2 px-3 text-left">Número</th>
                      <th className="py-2 px-3 text-left">Data</th>
                      <th className="py-2 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((agendamento) => (
                      <tr
                        key={agendamento._id}
                        className="hover:bg-gray-100 transition-colors">
                        <td className="py-2 px-3 border-b">{agendamento.nome}</td>
                        <td className="py-2 px-3 border-b">
                          {agendamento.sobrenome}
                        </td>
                        <td className="py-2 px-3 border-b">
                          {agendamento.numero}
                        </td>
                        <td className="py-2 px-3 border-b">
                          {moment(agendamento.dia)
                            .tz("America/Sao_Paulo")
                            .format("DD/MM/YYYY")}{" "}
                          {/* Ajusta o fuso horário para São Paulo */}
                        </td>
                        <td className="py-2 px-3 border-b text-center">
                          <button
                            onClick={() => excluirAgendamento(agendamento._id)}
                            className="bg-red-600 text-white py-1 px-2 lg:py-2 lg:px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md text-xs lg:text-sm">
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
