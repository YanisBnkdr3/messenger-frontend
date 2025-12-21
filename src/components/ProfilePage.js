import React, { useState } from "react";
import api from "../api";
import "../styles/ProfilePage.css";

export default function ProfilePage({ user, setUser }) {
  const [file, setFile] = useState(null);

  // Convertir fichier → Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Sélectionne une image !");

    try {
      const base64Img = await toBase64(file);

      const res = await api.post("/upload/profile-pic", {
        profilePic: base64Img,
      });

      alert("Photo mise à jour !");
      setUser({ ...user, profilePic: res.data.profilePic });
    } catch (err) {
      console.error("❌ Erreur upload frontend:", err);
      alert("Erreur upload photo");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">👤 Mon profil</h2>

        <img
          src={user.profilePic || "https://via.placeholder.com/120"}
          alt="Profil"
          className="profile-avatar"
        />

        <form onSubmit={handleUpload} className="profile-form">
          <label htmlFor="file" className="file-label">
            📷 Sélectionner une photo
          </label>

          {/* 🔧 MODIFICATION 1 */}
          <input
            id="file"
            type="file"
            accept="image/jpeg,image/png"
            className="file-input"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (!selectedFile) return;

              // 🔧 MODIFICATION 2
              if (
                !["image/jpeg", "image/png"].includes(selectedFile.type)
              ) {
                alert("Format non supporté (JPG ou PNG)");
                return;
              }

              // 🔧 MODIFICATION 3
              if (selectedFile.size > 2 * 1024 * 1024) {
                alert("Image trop lourde (max 2MB)");
                return;
              }

              setFile(selectedFile);
            }}
          />

          <button type="submit" className="profile-btn">
            ✨ Changer ma photo
          </button>
        </form>
      </div>
    </div>
  );
}
