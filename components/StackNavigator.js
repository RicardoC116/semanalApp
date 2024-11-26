// components/StackNavigator

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiarioScreen from "../screens/DiarioScreen";
import SemanalScreen from "../screens/SemanalScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import DeudorDetailScreen from "../screens/DeudorDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack de diario
const DiarioStack = () => {
  return (
    <Stack.Navigator initialRouteName="Diario">
      <Stack.Screen
        name="Diarios"
        component={DiarioScreen}
        options={{
          headerTitle: () => {
            return <Text style={styles.headerTitle}>Clientes Diarios</Text>;
          },
        }}
      >
        {(props) => <DiarioScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Detalles"
        component={DeudorDetailScreen}
        options={{
          headerTitle: () => {
            return <Text style={styles.headerTitle}>Detalles del cliente</Text>;
          },
        }}
      />
    </Stack.Navigator>
  );
};

// Stack para semanal
const SemanalStack = () => {
  return (
    <Stack.Navigator initialRouteName="Semanal">
      <Stack.Screen
        name="Semanal"
        component={SemanalScreen}
        options={{
          headerTitle: () => {
            return <Text style={styles.headerTitle}>Clientes Semanales</Text>;
          },
        }}
      >
        {(props) => <DiarioScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Detalles"
        component={DeudorDetailScreen}
        options={{
          headerTitle: () => {
            return <Text style={styles.headerTitle}>Detalles del cliente</Text>;
          },
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Diario") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Semanal") {
            iconName = focused ? "calendar-week" : "calendar-week-outline";
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Diario"
        component={DiarioStack}
        options={{
          title: "cobros Diarios",
          headerShow: false,
        }}
      >
        {(props) => <DiarioScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Semanal"
        component={SemanalStack}
        options={{
          title: "cobros Semanales",
          headerShow: false,
        }}
      >
        {(props) => <SemanalScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24, // Tamaño del texto
    fontWeight: "bold", // Negrita
  },
});
