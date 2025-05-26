import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserData {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
}

const UsersTable = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados dos usuários.");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log(password)
    return password;
  };

  const handlePasswordChange = async (userId: number) => {
    const newPassword = generateRandomPassword();

    try {
      console.log('Enviando requisição para alterar senha:', { userId, newPassword });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta do backend:", errorData);
        toast.error(`Erro ao alterar a senha do usuário: ${errorData.message || "Erro desconhecido"}`);
        throw new Error(errorData.message || "Erro ao alterar a senha do usuário.");
      }

      console.log('Senha alterada com sucesso para o usuário:', userId);
      try {
        await navigator.clipboard.writeText(newPassword);
        toast.success("Senha alterada com sucesso! Copiada para a área de transferência (Ctrl+V).");
      } catch (clipboardError) {
        console.error("Erro ao copiar para o clipboard:", clipboardError);
        toast.warn("Senha alterada com sucesso, mas não foi possível copiar para o clipboard.");
      }
    } catch (err) {
      console.error("Erro ao alterar a senha do usuário:", err);
      toast.error("Erro ao alterar a senha do usuário.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar o usuário.");
      }

      toast.success("Usuário deletado com sucesso!");

      // Remove the user from the UI
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao deletar o usuário.");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Tabela de Usuários</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Nome</th>
              <th className="px-6 py-3 border">Email</th>
              <th className="px-6 py-3 border">Nível de Acesso</th>
              <th className="px-6 py-3 border">Data de Criação</th>
              <th className="px-6 py-3 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-6 py-3 border">{user.id}</td>
                <td className="px-6 py-3 border">{user.name}</td>
                <td className="px-6 py-3 border">{user.email}</td>
                <td className="px-6 py-3 border">{user.role}</td>
                <td className="px-6 py-3 border">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-2 py-2 border flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handlePasswordChange(user.id)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Alterar Senha
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
