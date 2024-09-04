import React from "react";
import Navbar from "./Navbar";
import AgendamentoForm from "./AgendamentoForm";

const AdicionarAgendamento = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto flex justify-center items-center">
        <div className="w-full max-w-4xl">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              Adicionar Agendamento
            </h1>
            <p className="text-center text-gray-500">
              Preencha os campos abaixo para agendar sua consulta
            </p>
          </header>
          <AgendamentoForm />
        </div>
      </div>
    </div>
  );
};

export default AdicionarAgendamento;
