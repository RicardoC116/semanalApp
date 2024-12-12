// components/StackNavigator

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiarioScreen from "../../screens/DiarioScreen";
import SemanalScreen from "../../screens/SemanalScreen";
import { createStackNavigator } from "@react-navigation/stack";
import DeudorDetailScreen from "../../screens/DeudorDetailsScreen";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SemanalIcon, DiarioIcon } from "../custom/iconos";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de diario
const DiarioStack = ({ onLogout }) => (
  <Stack.Navigator initialRouteName="ClientesDiarios">
    <Stack.Screen
      name="ClientesDiarios"
      component={DiarioScreen}
      options={{
        headerTitle: () => (
          <Text style={styles.headerTitle}>Clientes Diarios</Text>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="DetallesDeudores"
      component={DeudorDetailScreen}
      options={{
        headerTitle: () => (
          <Text style={styles.headerTitle}>Detalles del Cliente</Text>
        ),
      }}
    />
  </Stack.Navigator>
);

// Stack de semanal
const SemanalStack = ({ onLogout }) => (
  <Stack.Navigator initialRouteName="ClientesSemanales">
    <Stack.Screen
      name="ClientesSemanales"
      component={SemanalScreen}
      options={{
        headerTitle: () => (
          <Text style={styles.headerTitle}>Clientes Semanales</Text>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="DetallesDeudores"
      component={DeudorDetailScreen}
      options={{
        headerTitle: () => (
          <Text style={styles.headerTitle}>Detalles del Cliente</Text>
        ),
      }}
    />
  </Stack.Navigator>
);

// Tab Navigator
const TabNavigator = ({ onLogout }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === "Diarios") {
          return <DiarioIcon focused={focused} color={color} size={size} />;
        } else if (route.name === "Semanales") {
          return <SemanalIcon focused={focused} color={color} size={size} />;
        }
      },
      tabBarActiveTintColor: "purple",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Diarios">
      {() => <DiarioStack onLogout={onLogout} />}
    </Tab.Screen>
    <Tab.Screen name="Semanales">
      {() => <SemanalStack onLogout={onLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export default TabNavigator;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#EE4E4E",
    borderRadius: 5,
    // padding: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
