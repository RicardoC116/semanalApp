// HomeScreen.js
import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ onLogout }) {
  const handleLogout = async () => {
    try {
      // Eliminar token de AsyncStorage
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
      <Text style={styles.welcomeText}>¡Bienvenido a la aplicación!</Text>
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
