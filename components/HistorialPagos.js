import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { formatearMonto } from "../components/dinero";

const HistorialPagos = ({ cobros }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pagos</Text>
      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentText}>
              Monto: {formatearMonto(item.amount)}  -  
              Fecha: {new Date(item.payment_Date).toLocaleDateString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HistorialPagos;
