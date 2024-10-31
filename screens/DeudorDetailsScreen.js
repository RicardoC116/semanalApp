// DeudorDetailScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DeudorDetailScreen({ route }) {
  const { name } = route.params; // para recibir datos de la api

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de {name} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  deudorName: {
    fontSize: 18,
  },
});
