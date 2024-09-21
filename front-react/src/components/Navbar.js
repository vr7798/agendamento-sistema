import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
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
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        toast.success("Logout realizado com sucesso!");
        navigate("/login");
      }
    }
  }, [navigate]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const menuItems = [
    {
      to: "/dashboard",
      label: "Painel",
      icon: <HomeIcon className="w-5 h-5 mr-2" />,
    },
    {
      to: "/adicionar-agendamento",
      label: "Adicionar Agendamento",
      icon: <CalendarIcon className="w-5 h-5 mr-2" />,
    },
    {
      to: "/admin-panel",
      label: "Painel Administrativo",
      icon: <CogIcon className="w-5 h-5 mr-2" />,
      roles: ["admin"],
    },
    {
      to: "/perfil",
      label: "Meu Perfil",
      icon: <UserIcon className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <nav className="bg-gray-800 fixed w-full z-50 top-0 left-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Links Principais */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white text-2xl font-extrabold tracking-tight"
            >
              AgendaVisão
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              {menuItems.map((item) => {
                if (item.roles && !item.roles.includes(userRole)) return null;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition 
                      ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
          {/* Botão de Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Menu"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 transition ease-out duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => {
              if (item.roles && !item.roles.includes(userRole)) return null;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition 
                    ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-red-700 transition"
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
