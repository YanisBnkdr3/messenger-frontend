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
      <div className="home-container">
        {/* NAVBAR */}
        <nav className="navbar">
          <h2 className="logo">
            <img
              src="/favicon.jpg"
              alt="Logo"
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            YB Chat
          </h2>
        </nav>

        {/* CONTENU */}
        <main className="home-main">
          <h1 className="home-title">Bienvenue sur YB Chat</h1>
          <p className="home-description">
            Discutez avec vos amis en toute simplicité. Ajoutez des contacts,
            échangez des messages privés et profitez d’une expérience fluide et
            moderne. 🌙 Mode sombre intégré pour un style élégant.
          </p>
          <div>
            <button
              onClick={() => {
                setPage("auth");
                setAuthMode("register");
              }}
              className="start-btn"
            >
              🚀 Commencer maintenant
            </button>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          © 2025 YB Chat – Créé par Yanis Benkeder
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
