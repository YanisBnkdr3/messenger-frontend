import React, { useState } from "react";
import api from "../api";
import "../styles/AuthPage.css";

export default function AuthPage({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false); // 🔹 État de chargement

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 Démarre le chargement

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
    } finally {
      setLoading(false); // 🔹 Stop le chargement dans tous les cas
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
              disabled={loading} // 🔹 Désactivé pendant chargement
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="auth-input"
            disabled={loading}
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading} // 🔹 Empêche double clic
          >
            {loading
              ? "Chargement..."
              : isRegister
              ? "S'inscrire"
              : "Se connecter"}
          </button>
        </form>

        {loading && (
          <p className="loading-text">
            ⏳ Veuillez patienter, connexion en cours...
          </p>
        )}

        {!loading && (
          <p onClick={() => setIsRegister(!isRegister)} className="auth-toggle">
            {isRegister
              ? "Déjà un compte ? Connecte-toi"
              : "Pas de compte ? Inscris-toi"}
          </p>
        )}
      </div>
    </div>
  );
}
