import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DeudoresList from "../components/global/DeudoresList";
import useAuth from "../hooks/useAuth"; // Importamos el hook

export default function WeeklyScreen({ navigation }) {
  const { user } = useAuth(); // Obtenemos el usuario desde el hook

  return (
    <View style={styles.container}>
      {/* Filtro por tipo de pago para Semanal */}
      {user?.id && (
        <DeudoresList
          userId={user.id}
          paymentType="semanal"
          navigation={navigation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FBFBFB",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
});
