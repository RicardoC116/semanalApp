// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./components/AutNavigator";
import { ActivityIndicator, View } from "react-native";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  // Pantalla de carga mientras la autenticación está en proceso
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthNavigator
        isAuthenticated={isAuthenticated}
        onLogin={login}
        onLogout={logout}
      />
    </NavigationContainer>
  );
}
