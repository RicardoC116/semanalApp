// LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/axios";

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Se intenta iniciar sesión y se verifica si fue exitoso
    try {
      const success = await onLogin(name, password);
      if (!success) {
        Alert.alert(
          "Login Fallido",
          "Credenciales incorrectas. Inténtalo de nuevo."
        );
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      Alert.alert("Error", "Ocurrió un error durante el login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
