import axios from "axios";

const api = axios.create({
  // casa
  // baseURL: "http://192.168.80.235:3000/api",

  // Para test
  // baseURL: "http://192.168.1.110:3000/api",

  baseURL: "https://cobrobackend2-production.up.railway.app/api",
});

export default api;
