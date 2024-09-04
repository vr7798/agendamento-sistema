import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { atualizarPerfil, getPerfil } from "../api"; // Importa a função para buscar o perfil
import Navbar from "./Navbar"; // Importa a Navbar

const Perfil = () => {
  const [username, setUsername] = useState("");
  const [numeroTelefone, setNumeroTelefone] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const dadosUsuario = await getPerfil(); // Busca os dados do perfil pela API
        setUsername(dadosUsuario.username); // Preenche o nome de usuário
        setNumeroTelefone(dadosUsuario.numeroTelefone || ""); // Preenche o número de telefone (se houver)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar perfil. Tente novamente.");
      }
    };

    carregarPerfil(); // Chama a função de carregar perfil quando o componente monta
  }, []);

  const validarTelefone = (numero) => {
    const regex = /^\d{10,15}$/;
    return regex.test(numero);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !numeroTelefone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!validarTelefone(numeroTelefone)) {
      toast.error("Por favor, insira um número de telefone válido.");
      return;
    }

    if (novaSenha && !senhaAtual) {
      toast.error("Você deve fornecer a senha atual para alterar a senha.");
      return;
    }

    try {
      const userData = {
        username,
        numeroTelefone,
        senhaAtual,
        novaSenha,
      };

      await atualizarPerfil(userData); // Envia os dados para a API
      toast.success("Perfil atualizado com sucesso!");

      // Limpa os campos de senha após a atualização
      setSenhaAtual("");
      setNovaSenha("");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Inclui a Navbar no topo */}
      <Navbar />

      <div className="flex justify-center items-center pt-20">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Meu Perfil
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Nome de usuário"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Número de Telefone
              </label>
              <input
                type="tel"
                value={numeroTelefone}
                onChange={(e) => setNumeroTelefone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Número de telefone"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Senha Atual (se for alterar a senha)
              </label>
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Senha atual"
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nova Senha (opcional)
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Nova senha"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">
                Atualizar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
