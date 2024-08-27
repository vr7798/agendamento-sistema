// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("/api/usuarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsuarios(response.data);
      } catch (err) {
        toast.error("Erro ao carregar usuários");
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Usuário</th>
            <th className="py-2 px-4 border-b">Função</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td className="py-2 px-4 border-b">{usuario.username}</td>
              <td className="py-2 px-4 border-b">{usuario.role}</td>
              <td className="py-2 px-4 border-b">
                {/* Botões de ação para editar/excluir */}
                <button className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2">
                  Editar
                </button>
                <button className="bg-red-500 text-white py-1 px-3 rounded-md">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
