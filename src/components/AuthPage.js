import React, { useState } from "react";
import api from "../api";
import "../styles/AuthPage.css"; // 🔹 Import du fichier CSS séparé

export default function AuthPage({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await api.post("/auth/register", form);
        alert("Inscription réussie, connecte-toi !");
        setIsRegister(false);
      } else {
        const res = await api.post("/auth/login", form);
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isRegister ? "Inscription" : "Connexion"}
        </h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Nom"
              value={form.name}
              onChange={handleChange}
              className="auth-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="auth-toggle">
          {isRegister
            ? "Déjà un compte ? Connecte-toi"
            : "Pas de compte ? Inscris-toi"}
        </p>
      </div>
    </div>
  );
}
