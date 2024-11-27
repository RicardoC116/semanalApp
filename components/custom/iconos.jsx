import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";

// Ícono para la pestaña Semanal
export const SemanalIcon = ({ focused, color, size }) => {
  return <AntDesign name="calendar" size={size} color={color} />;
};

// Ícono para la pestaña Diario
export const DiarioIcon = ({ focused, color, size }) => {
  const iconName = focused ? "today" : "today-outline";
  return <Ionicons name={iconName} size={size} color={color} />;
};

// Icono panel
export const PanelIcon = ({ focused, color, size }) => {
  return (
    <MaterialIcons name="admin-panel-settings" size={size} color={color} />
  );
};

export const IconosPagos = (balance) => {
  if (balance === 0) {
    return <MaterialIcons name="paid" size={24} color="black" />;
  }
  if (balance > 0) {
    return <Feather name="alert-octagon" size={24} color="black" />;
  }
};

export const ClienteIcono = ({ focused, color, size }) => {
  return <Icon name="user-plus" color={color} size={size} />;
};

export const DeudoresIcono = ({ focused, color, size }) => {
  return <Icon name="credit-card" color={color} size={size} />;
};
