// AutNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../screens/LoginScreen";
import TabNavigator from "./StackNavigator";

const Stack = createStackNavigator();

const AuthNavigator = ({ isAuthenticated, onLogin, onLogout }) => (
  <Stack.Navigator>
    {!isAuthenticated ? (
      // Pantalla de login
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
    ) : (
      // Navegación autenticada
      <Stack.Screen name="App" options={{ headerShown: false }}>
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
    )}
  </Stack.Navigator>
);

export default AuthNavigator;
