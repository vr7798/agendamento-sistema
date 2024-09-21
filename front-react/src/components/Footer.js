import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} AgendaVisão. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
