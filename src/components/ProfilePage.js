import React, { useState } from "react";
import api from "../api";
import "../styles/ProfilePage.css";

export default function ProfilePage({ user, setUser }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      console.log("📱 Upload iPhone :", file.type, file.size);

      const base64Img = await toBase64(file);

      const res = await api.post("/upload/profile-pic", {
        profilePic: base64Img,
      });

      alert("✅ Photo mise à jour !");
      setUser({ ...user, profilePic: res.data.profilePic });
      setFile(null);
    } catch (err) {
      console.error("❌ Erreur upload frontend :", err);
      alert("Erreur lors de l’upload de la photo");
    } finally {
      setLoading(false);
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

          <input
            id="file"
            type="file"
            accept="image/jpeg,image/png"
            className="file-input"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (!selectedFile) return;

              // Bloquer HEIC (iPhone)
              if (
                !["image/jpeg", "image/png"].includes(selectedFile.type)
              ) {
                alert("❌ Format non supporté. JPG ou PNG uniquement.");
                return;
              }

              // Limite taille (2MB)
              if (selectedFile.size > 2 * 1024 * 1024) {
                alert("❌ Image trop lourde (max 2MB)");
                return;
              }

              setFile(selectedFile);
            }}
          />

          <button
            type="submit"
            className="profile-btn"
            disabled={loading}
          >
            {loading ? "⏳ Upload..." : "✨ Changer ma photo"}
          </button>
        </form>
      </div>
    </div>
  );
}
