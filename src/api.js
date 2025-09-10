import axios from "axios";

const api = axios.create({
  baseURL: "https://messenger-backend-zqve.onrender.com/api", // ✅ Backend Render
  withCredentials: false, // ajoute ça pour éviter certains blocages
});
// Ajouter le token JWT si dispo
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
