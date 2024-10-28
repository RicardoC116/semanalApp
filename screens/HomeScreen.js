import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const jwtDecode = require("jwt-decode"); // Importación

export default function HomeScreen({ onLogout }) {
  const [cobrador, setCobrador] = useState({ id: null, name: "" });

  useEffect(() => {
    const fetchCobradorData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("*********Token:", token, "********"); // Verificar el token
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log("********* Decoded Token:", decoded, "********");  // Verificar el token

            const id = decoded.id;
            const name = decoded.name;
            if (id && name) {
              setCobrador({ id, name });
            } else {
              console.warn("ID o nombre no encontrados en el token.");
            }
          } catch (error) {
            console.error("Error al decodificar el token:", error);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del cobrador:", error);
      }
    };

    fetchCobradorData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Alert.alert("Sesión Cerrada", "Has cerrado la sesión correctamente.");
      onLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        ¡Bienvenido, {cobrador.name}! (ID: {cobrador.id})
      </Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} color="#dc3545" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
});
