import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../api";
import "../styles/ChatPage.css"; // Import CSS

const socket = io("https://messenger-backend-zqve.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function ChatPage({ user, setUser }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState("dark"); // 🌙 Thème par défaut

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (user) {
      socket.emit("join", user.id);

      socket.on("receiveMessage", (message) => {
        if (
          message.senderId === selectedFriend?._id ||
          message.receiverId === user.id
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socket.on("messagesSeen", ({ by }) => {
        if (by === selectedFriend?._id) {
          setMessages((prev) => prev.map((m) => ({ ...m, seen: true })));
        }
      });

      socket.on("typing", ({ from }) => {
        if (from === selectedFriend?._id) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2000);
        }
      });

      socket.on("userOnline", ({ userId }) => {
        setFriends((prev) =>
          prev.map((f) =>
            f.friendId._id === userId
              ? { ...f, friendId: { ...f.friendId, online: true } }
              : f
          )
        );
      });

      socket.on("userOffline", ({ userId }) => {
        setFriends((prev) =>
          prev.map((f) =>
            f.friendId._id === userId
              ? { ...f, friendId: { ...f.friendId, online: false } }
              : f
          )
        );
      });
    }
  }, [user, selectedFriend]);

  // ✅ Correction : envoi du token pour /friends/list
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/friends/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data.accepted || []);
      } catch (err) {
        console.error("❌ Erreur fetch friends list:", err);
      }
    };
    fetchFriends();
  }, []);

  const openChat = async (friend) => {
    try {
      setSelectedFriend(friend.friendId);

      const token = localStorage.getItem("token");
      const res = await api.get(`/messages/${friend.friendId._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);

      socket.emit("markAsSeen", {
        userId: user.id,
        friendId: friend.friendId._id,
      });
    } catch (err) {
      console.error("❌ Erreur ouverture chat:", err);
    }
  };

  const sendMessage = () => {
    if (msg.trim() && selectedFriend) {
      socket.emit("sendMessage", {
        senderId: user.id,
        receiverId: selectedFriend._id,
        message: msg,
      });
      setMessages((prev) => [
        ...prev,
        {
          senderId: user.id,
          receiverId: selectedFriend._id,
          message: msg,
          seen: false,
        },
      ]);
      setMsg("");
    }
  };

  const handleTyping = (e) => {
    setMsg(e.target.value);
    if (selectedFriend) {
      socket.emit("typing", { from: user.id, to: selectedFriend._id });
    }
  };

  return (
    <div className={`chat-container ${theme}-theme`}>
      {/* HEADER */}
      <div className="chat-header">
        <h2 className="chat-title">Bienvenue {user.name}</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {/* LISTE AMIS */}
        <div className="chat-sidebar">
          <h3 className="sidebar-title">👥 Mes amis</h3>
          {friends.map((f) => (
            <div
              key={f.friendId._id}
              className={`friend-item ${
                selectedFriend?._id === f.friendId._id ? "active" : ""
              }`}
              onClick={() => openChat(f)}
            >
              <img
                src={f.friendId.profilePic || "https://via.placeholder.com/40"}
                alt="Profil"
                className="friend-pic"
              />
              <div>
                <p className="friend-name">
                  {f.friendId.name}
                  <span
                    className={`status-dot ${
                      f.friendId.online ? "online" : "offline"
                    }`}
                  ></span>
                </p>
                <small className="friend-date">
                  Inscrit le{" "}
                  {new Date(f.friendId.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* ZONE CHAT */}
        <div className="chat-area">
          {selectedFriend ? (
            <>
              <div className="messages">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`message ${
                      m.senderId === user.id ? "sent" : "received"
                    }`}
                  >
                    <div className="message-content">
                      <p className="message-text">{m.message}</p>
                      {m.seen && m.senderId === user.id && (
                        <span className="message-seen">Vu</span>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    ✍️ {selectedFriend.name} écrit...
                  </div>
                )}
              </div>
              <div className="input-area">
                <input
                  value={msg}
                  onChange={handleTyping}
                  placeholder="Écrire un message..."
                  className="chat-input"
                />
                <button onClick={sendMessage} className="send-btn">
                  Envoyer
                </button>
              </div>
            </>
          ) : (
            <p className="no-chat">💬 Sélectionne un ami pour discuter</p>
          )}
        </div>
      </div>
    </div>
  );
}
