import React, { useState } from "react";
import { FormEvent } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Adiciona estado para mensagem de sucesso

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Limpa mensagem de sucesso ao submeter novamente
    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        setSuccess("Login realizado com sucesso!"); // Define mensagem de sucesso
      } else if (data.statusCode === 401) {
        setError("Email ou senha inválidos.");
      } else {
        setError("Erro ao realizar login.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 12 }}>{error}</div>
        )}
        {success && (
          <div style={{ color: "green", marginTop: 12 }}>{success}</div>
        )}
        <button type="submit" style={{ marginTop: 16, width: "100%" }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
