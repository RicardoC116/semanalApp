import axios from "axios";

const api = axios.create({
  // casa
  // baseURL: "http://192.168.80.235:3000/api",

  // Para test
  // baseURL: "http://192.168.1.75:3000/api",

  // Chilac
  // baseURL: "https://cobrobackend2-production.up.railway.app/api",

  // Virsac
  baseURL: "https://cobrobackend2-production-96fe.up.railway.app/api",

  // San jose
  // baseURL: "https://cobrobackend2-production-8129.up.railway.app/api",
});

export default api;
