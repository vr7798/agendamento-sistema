import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import AdicionarAgendamento from "./components/AdicionarAgendamento";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel"; // Importar o AdminPanel
import Perfil from "./components/Perfil"; // Importar o componente Perfil
import Footer from "./components/Footer"; // Importar o componente Footer

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Flex container para manter o footer no final */}
        <ToastContainer />
        <div className="flex-grow">
          {" "}
          {/* Permite que o conteúdo cresça e empurre o footer para o final */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adicionar-agendamento"
              element={
                <ProtectedRoute>
                  <AdicionarAgendamento />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel /> {/* Renderiza o AdminPanel */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil /> {/* Renderiza o componente Perfil */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer /> {/* Inclui o Footer no final */}
      </div>
    </Router>
  );
}

export default App;
