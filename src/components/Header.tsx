import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("respostas"); // Default to "Respostas Recebidas"
//console.log
  const handleNavigation = (page: string) => {
    setActivePage(page);
    if (page === "formulario") {
      navigate("/processos");
    } else if (page === "cadastrar") {
      navigate("/cadastrar-usuario");
    } else if (page === "respostas") {
      navigate("/visualizar-processos");
    } else if (page === "usuarios") {
      navigate("/visualizar-usuarios");
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold">
          Articuladores RENAPETI - Painel do {user.role === "admin" ? "Administrador" : "Usuário"}
        </h1>
        {user.role === "admin" && (
          <button
            onClick={() => handleNavigation("formulario")}
            className={`px-4 py-2 rounded transition ${
              activePage === "formulario"
                ? "bg-blue-800"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            Formulário
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user.role === "admin" && (
          <>
            <button
              onClick={() => handleNavigation("cadastrar")}
              className={`px-4 py-2 rounded transition ${
                activePage === "cadastrar"
                  ? "bg-blue-800"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              Cadastrar
            </button>
            <button
              onClick={() => handleNavigation("respostas")}
              className={`px-4 py-2 rounded transition ${
                activePage === "respostas"
                  ? "bg-blue-800"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              Respostas Recebidas
            </button>
            <button
              onClick={() => handleNavigation("usuarios")}
              className={`px-4 py-2 rounded transition ${
                activePage === "usuarios"
                  ? "bg-blue-800"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              Visualizar Usuários
            </button>
          </>
        )}
        <span>{user.name}</span>
        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
