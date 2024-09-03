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

function App() {
  return (
    <Router>
      <div>
        <ToastContainer />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
