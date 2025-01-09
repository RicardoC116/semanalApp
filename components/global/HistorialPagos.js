//Historial de pagos

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { formatearMonto } from "../custom/dinero";

const HistorialPagos = ({ cobros }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Pagos</Text>
      </View>
      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentText}>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 18,
                }}
              >
                Monto:
              </Text>{" "}
              {formatearMonto(item.amount)} -{" "}
              <Text
                style={{
                  fontWeight: 500,
                  fontSize: 18,
                }}
              >
                Fecha:
              </Text>{" "}
              {new Date(item.payment_date).toLocaleDateString()}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
  imprimir: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});

export default HistorialPagos;
