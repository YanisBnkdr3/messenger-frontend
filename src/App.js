import React, { useState } from "react";
import AuthPage from "./components/AuthPage";
import ChatPage from "./components/ChatPage";
import FriendsPage from "./components/FriendsPage";
import ProfilePage from "./components/ProfilePage";
import "./App.css"; // 🔹 Import CSS

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");

  // 🔹 Si utilisateur connecté
  if (user) {
    return (
      <div className="app-container">
        <nav className="navbar">
          <h2 className="logo">💬 YB Chat</h2>
          <div className="nav-buttons">
            <button onClick={() => setPage("chat")} className="nav-btn">
              🗨️ Chat
            </button>
            <button onClick={() => setPage("friends")} className="nav-btn">
              👥 Amis
            </button>
            <button onClick={() => setPage("profile")} className="nav-btn">
              👤 Profil
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("token");
                setUser(null);
                setPage("home");
              }}
              className="nav-btn logout-btn"
            >
              Déconnexion
            </button>
          </div>
        </nav>

        <div className="page-content">
          {page === "chat" && <ChatPage user={user} setUser={setUser} />}
          {page === "friends" && <FriendsPage user={user} />}
          {page === "profile" && <ProfilePage user={user} setUser={setUser} />}
        </div>
      </div>
    );
  }

  // 🔹 Page Home
  if (page === "home") {
    return (
      <div className="home-wrapper">
        <div className="animated-bg"></div>{" "}
        {/* Arrière-plan animé opotionnel */}
        <nav className="navbar-glass">
          <div className="logo-container">
            <img src="/favicon.jpg" alt="Logo" className="logo-img" />
            <span className="logo-text">YB Chat</span>
          </div>
        </nav>
        <main className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Connectez. Partagez. Créez.</h1>
            <p className="hero-subtitle">
              YB Chat : L'application de messagerie nouvelle génération pour des
              conversations fluides et sécurisées.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="icon-circle">🌙</div>
                <h3>Mode Sombre Élégant</h3>
                <p>Conçu pour le confort de vos yeux.</p>
              </div>

              <div className="feature-card active-card">
                <div className="icon-circle">🚀</div>
                <button
                  onClick={() => {
                    setPage("auth");
                    setAuthMode("register");
                  }}
                  className="hero-btn"
                >
                  Commencez l'aventure
                </button>
              </div>

              <div className="feature-card">
                <div className="icon-circle">🛡️</div>
                <h3>Discussions Sécurisées</h3>
                <p>Vos données restent privées.</p>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer-modern">
          <p>© 2025 YB Chat – Design par Yanis Benkeder</p>
        </footer>
      </div>
    );
  }

  // 🔹 Page Auth
  if (page === "auth") {
    return <AuthPage setUser={setUser} mode={authMode} setPage={setPage} />;
  }

  return null;
}

export default App;
