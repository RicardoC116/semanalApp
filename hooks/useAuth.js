// useAuth
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/axios";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      // console.log("Token recuperado:", token);
      if (token) {
        try {
          const decode = jwtDecode(token);
          // console.log("Token decodificado: ", decode);
          setUser(decode);
          setIsAuthenticated(true);
          // console.log("Token válido, usuario autenticado.");
        } catch (error) {
          // console.error("Token inválido", error);
          await AsyncStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        // console.log("No hay token, usuario no autenticado.");
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
        const decoded = jwtDecode(response.data.token);
        setUser(decoded);
        setIsAuthenticated(true);
        return true; // Login exitoso
      }
      return false; // Fallo en el login
    } catch (error) {
      // console.error("Error durante el login:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      // console.log("Has cerrado sesion de manera eficaz")
    } catch (error) {
      // console.error("Error al cerrar sesión:", error);
    }
  };

  return { isAuthenticated, isLoading, user, login, logout };
};

export default useAuth;
