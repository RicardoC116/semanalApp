// useAuth
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("Token recuperado:", token);
      if (token) {
        try {
          await axios.get("/cobradores/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
          console.log("Token válido, usuario autenticado.");
        } catch (error) {
          console.error("Token inválido", error);
          await AsyncStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        console.log("No hay token, usuario no autenticado.");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/cobradores/login", {
        name: username,
        password,
      });
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        return true; // Login exitoso
      }
      return false; // Fallo en el login
    } catch (error) {
      console.error("Error durante el login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { isAuthenticated, isLoading, login, logout };
};

export default useAuth;
