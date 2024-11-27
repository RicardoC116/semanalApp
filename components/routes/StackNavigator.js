// components/StackNavigator
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiarioScreen from "../../screens/DiarioScreen";
import SemanalScreen from "../../screens/SemanalScreen";
import { createStackNavigator } from "@react-navigation/stack";
import DeudorDetailScreen from "../../screens/DeudorDetailsScreen";
import { StyleSheet, Text } from "react-native";
import { SemanalIcon, DiarioIcon } from "../custom/iconos";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de diario
const DiarioStack = () => {
  return (
    <Stack.Navigator initialRouteName="ClientesDiarios">
      <Stack.Screen
        name="ClientesDiarios"
        component={DiarioScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Clientes Diarios</Text>
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
};

// Stack de semanal
const SemanalStack = () => {
  return (
    <Stack.Navigator initialRouteName="ClientesSemanales">
      <Stack.Screen
        name="ClientesSemanales"
        component={SemanalScreen}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle}>Clientes Semanales</Text>
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
};

const TabNavigator = ({ onLogout }) => {
  return (
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
      <Tab.Screen
        name="Diarios"
        component={DiarioStack}
        options={{ title: "Cobros Diarios" }}
      />
      <Tab.Screen
        name="Semanales"
        component={SemanalStack}
        options={{ title: "Cobros Semanales" }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
