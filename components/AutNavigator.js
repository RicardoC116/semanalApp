// AutNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import DeudorDetailScreen from "../screens/DeudorDetailsScreen"; // Importamos la nueva pantalla

const Stack = createStackNavigator();

const AuthNavigator = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <LoginScreen {...props} onLogin={onLogin} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <HomeScreen {...props} onLogout={onLogout} />}
          </Stack.Screen>
          <Stack.Screen
            name="DeudorDetail"
            component={DeudorDetailScreen}
            options={{ title: "Detalles del Deudor" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
