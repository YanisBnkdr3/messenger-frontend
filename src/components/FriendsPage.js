import React, { useEffect, useState } from "react";
import api from "../api";
import "../styles/FriendsPage.css"; // 🔹 Import CSS

export default function FriendsPage({ user }) {
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // Charger tous les utilisateurs et mes demandes reçues
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔹 Récupérer tous les utilisateurs
        const resUsers = await api.get("/auth/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(resUsers.data.filter((u) => u._id !== user.id));

        // 🔹 Récupérer mes demandes d’amis
        const resFriends = await api.get("/friends/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPendingRequests(resFriends.data.received || []);
      } catch (err) {
        console.error("❌ Erreur fetch friends:", err);
      }
    };
    fetchData();
  }, [user]);

  const sendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/friends/add/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Demande envoyée !");
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur envoi demande");
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/friends/accept/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests((prev) =>
        prev.filter((f) => f.friendId._id !== friendId)
      );
    } catch (err) {
      alert("Erreur acceptation");
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/friends/reject/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests((prev) =>
        prev.filter((f) => f.friendId._id !== friendId)
      );
    } catch (err) {
      alert("Erreur refus");
    }
  };

  return (
    <div className="friends-container">
      <h2 className="friends-title">👥 Gestion des amis</h2>

      {/* Liste de tous les utilisateurs */}
      <div className="friends-section">
        <h3 className="friends-subtitle">Tous les utilisateurs</h3>
        {users.length === 0 ? (
          <p className="friends-empty">Aucun autre utilisateur trouvé.</p>
        ) : (
          users.map((u) => (
            <div key={u._id} className="friend-card">
              <img
                src={u.profilePic || "https://via.placeholder.com/40"}
                alt="Profil"
                className="friend-avatar"
              />
              <div className="friend-info">
                <p className="friend-name">
                  {u.name} ({u.email})
                  <span
                    className={`status-dot ${u.online ? "online" : "offline"}`}
                  ></span>
                </p>
                <small className="friend-date">
                  Inscrit le {new Date(u.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button className="add-btn" onClick={() => sendRequest(u._id)}>
                ➕ Ajouter
              </button>
            </div>
          ))
        )}
      </div>

      {/* Demandes reçues */}
      <div className="friends-section">
        <h3 className="friends-subtitle">📩 Demandes reçues</h3>
        {pendingRequests.length === 0 ? (
          <p className="friends-empty">Aucune demande reçue.</p>
        ) : (
          pendingRequests.map((req) => (
            <div key={req.friendId._id} className="friend-card">
              <img
                src={
                  req.friendId.profilePic || "https://via.placeholder.com/40"
                }
                alt="Profil"
                className="friend-avatar"
              />
              <div className="friend-info">
                <p className="friend-name">
                  {req.friendId.name} ({req.friendId.email})
                </p>
                <small className="friend-date">
                  Inscrit le{" "}
                  {new Date(req.friendId.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button
                className="accept-btn"
                onClick={() => acceptRequest(req.friendId._id)}
              >
                ✅ Accepter
              </button>
              <button
                className="reject-btn"
                onClick={() => rejectRequest(req.friendId._id)}
              >
                ❌ Refuser
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
