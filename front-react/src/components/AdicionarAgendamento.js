import React from "react";
import Navbar from "./Navbar";
import AgendamentoForm from "./AgendamentoForm";

const AdicionarAgendamento = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            Adicionar Agendamento
          </h1>
        </header>
        <AgendamentoForm />
      </div>
    </div>
  );
};

export default AdicionarAgendamento;
