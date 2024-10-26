// AutNavigator
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createStackNavigator();

const AuthNavigator = ({ isAuthenticated, onLogin, onLogout }) => {
  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
        >
          {(props) => <LoginScreen {...props} onLogin={onLogin} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => <HomeScreen {...props} onLogout={onLogout} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
