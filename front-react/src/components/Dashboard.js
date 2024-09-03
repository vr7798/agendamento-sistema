// src/components/Dashboard.js
import React from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Main Content */}
      <div className="pt-20 p-6 overflow-y-auto">
        <header className="mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">
            Bem-vindo ao AgendaProX™
          </h1>
        </header>
        <main className="bg-white shadow-lg rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            AgendaProX™
          </h2>
          <p className="text-gray-600">AgendaProX™.</p>{" "}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
