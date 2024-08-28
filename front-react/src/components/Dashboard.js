// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block fixed lg:relative z-20 lg:z-auto bg-white shadow-lg lg:w-64 w-3/4 h-full transition-transform duration-200 ease-in-out`}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <nav className="mt-6">
            <Link
              to="/dashboard"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              Painel
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin-panel"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
                Painel Administrativo
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-6 bg-white shadow-lg">
          <button className="text-gray-800 lg:hidden" onClick={toggleMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Bem-vindo ao Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
            Logout
          </button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Painel Principal</h2>
          {/* Conteúdo principal do Dashboard */}
          <p>Este é o conteúdo do Dashboard.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
