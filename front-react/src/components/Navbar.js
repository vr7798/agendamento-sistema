import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // Correção no import
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  CogIcon,
  CalendarIcon,
  UserIcon, // Ícone do usuário
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
    <nav className="bg-gray-900 fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-bold">AgendaProMax™</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <HomeIcon className="w-5 h-5 mr-2" />
              Painel
            </Link>
            <Link
              to="/adicionar-agendamento"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Adicionar Agendamento
            </Link>
            {userRole === "admin" && (
              <Link
                to="/admin-panel"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <CogIcon className="w-5 h-5 mr-2" />
                Painel Administrativo
              </Link>
            )}
            <Link
              to="/perfil"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Meu Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              Sair
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white">
              <span className="sr-only">Abrir menu principal</span>
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Dropdown para Mobile */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-900`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Painel
          </Link>
          <Link
            to="/adicionar-agendamento"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Adicionar Agendamento
          </Link>
          {userRole === "admin" && (
            <Link
              to="/admin-panel"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Painel Administrativo
            </Link>
          )}
          <Link
            to="/perfil"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Meu Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors mt-2">
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
