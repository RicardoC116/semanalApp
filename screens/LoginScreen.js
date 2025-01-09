// LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importar iconos de Expo

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
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
      <Image
        source={require("../assets/adaptive-icon1.png")}
        style={styles.logo}
      />
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
        placeholderTextColor="#888"
        autoCapitalize="none"
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Fondo negro
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 35,
    borderRadius: 50,
    backgroundColor: "#1c1c1c",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#1c1c1e",
    color: "#fff",
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 5,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#fff",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: "#89A8B2", // Color del botón
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
