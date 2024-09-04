import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AgendaProX™. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
