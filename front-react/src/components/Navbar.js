// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {jwtDecode }from "jwt-decode";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  CogIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/outline";

const Navbar = () => {
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
    <nav className="bg-gray-900 fixed w-full z-50 top-0 left-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              AgendaProMax™
            </h1>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Painel
              </Link>
              <Link
                to="/adicionar-agendamento"
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Adicionar Agendamento
              </Link>
              {userRole === "admin" && (
                <Link
                  to="/admin-panel"
                  className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center"
                >
                  <CogIcon className="w-5 h-5 mr-2" />
                  Painel Administrativo
                </Link>
              )}
              <Link
                to="/perfil"
                className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
              >
                Sair
              </button>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 transition-transform ease-in-out duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-lg text-base font-medium"
            >
              Painel
            </Link>
            <Link
              to="/adicionar-agendamento"
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-lg text-base font-medium"
            >
              Adicionar Agendamento
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin-panel"
                className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-lg text-base font-medium"
              >
                Painel Administrativo
              </Link>
            )}
            <Link
              to="/perfil"
              className="text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-lg text-base font-medium"
            >
              Meu Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors mt-2"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
