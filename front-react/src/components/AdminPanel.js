import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar"; // Importa o Navbar

// Componente principal do Painel Administrativo
const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar usuários e agendamentos ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Recupera o token do localStorage

        // Configura os cabeçalhos com o token JWT
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Usar a URL completa aqui
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

  // Função para excluir usuário
  const excluirUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Recupera o token do localStorage

      // Configura os cabeçalhos com o token JWT
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

  // Função para excluir agendamento
  const excluirAgendamento = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Recupera o token do localStorage

      // Configura os cabeçalhos com o token JWT
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

  // Renderizar conteúdo do painel
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar /> {/* Inclui o Navbar */}
      <div className="p-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <div>
            <section>
              <h2 className="text-2xl font-semibold mb-4">Usuários</h2>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Role</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user._id}>
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => excluirUsuario(user._id)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Agendamentos</h2>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nome</th>
                    <th className="py-2 px-4 border-b">Sobrenome</th>
                    <th className="py-2 px-4 border-b">Número</th>
                    <th className="py-2 px-4 border-b">Data</th>
                    <th className="py-2 px-4 border-b">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((agendamento) => (
                    <tr key={agendamento._id}>
                      <td className="py-2 px-4 border-b">{agendamento.nome}</td>
                      <td className="py-2 px-4 border-b">
                        {agendamento.sobrenome}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {agendamento.numero}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(agendamento.dia).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => excluirAgendamento(agendamento._id)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700">
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
