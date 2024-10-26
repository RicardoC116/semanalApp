// deudores.js
import api from "./axios";

// Función para obtener los deudores de un cobrador específico
export const getDeudoresByCobrador = async (cobradorId) => {
  try {
    const response = await api.get(`/deudores/cobrador/${cobradorId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los deudores:", error);
    return [];
  }
};
