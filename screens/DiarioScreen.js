import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DeudoresList from "../components/global/DeudoresList";
import useAuth from "../hooks/useAuth"; // Importamos el hook

export default function WeeklyScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Filtro por tipo de pago para Semanal */}
      {user?.id && (
        <DeudoresList
          style={{}}
          userId={user.id}
          paymentType="diario"
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
