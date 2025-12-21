import React, { useState } from "react";
import api from "../api";
import "../styles/ProfilePage.css";

export default function ProfilePage({ user, setUser }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user.profilePic || "");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Sélectionne une image !");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Img = reader.result;

        const res = await api.post("/upload/profile-pic", {
          profilePic: base64Img,
        });

        alert("Photo mise à jour !");
        setUser({ ...user, profilePic: res.data.profilePic });
        setPreview(res.data.profilePic);
      };
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
          src={preview || "https://via.placeholder.com/120"}
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
            accept="image/*"
            className="file-input"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (!selectedFile) return;
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile)); // preview immédiat
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
