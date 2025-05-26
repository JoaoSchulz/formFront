import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import ProcessForm from './pages/ProcessForm.tsx';
import RegisterUser from './pages/RegisterUser.tsx';
import AdminProcessTable from './pages/AdminProcessTable.tsx';
import UsersTable from './pages/UsersTable.tsx';
import Header from './components/Header.tsx';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
        } else {
          console.error("Conteúdo inválido para 'user' no localStorage:", storedUser);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Erro ao analisar 'user' do localStorage como JSON:", error);
        console.error("Conteúdo problemático:", storedUser);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLogin = (user) => {
    setUser(user);
    if (user.role === "admin") {
      navigate("/respostas-recebidas"); // Redirect admin to "Respostas Recebidas"
    } else {
      navigate("/processos"); // Redirect other users to "Processos"
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <Header user={user} onLogout={handleLogout} />
          <div className="p-4">
            <Routes>
              <Route path="/processos" element={<ProcessForm />} />
              <Route path="/cadastrar-usuario" element={<RegisterUser />} />
              <Route path="/visualizar-processos" element={<AdminProcessTable />} /> {/* Respostas Recebidas */}
              <Route path="/visualizar-usuarios" element={<UsersTable />} /> {/* Visualizar Usuários */}
              <Route path="*" element={<Navigate to="/processos" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage setUser={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
