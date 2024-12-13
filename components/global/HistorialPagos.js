//Historial de pagos

import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { formatearMonto } from "../custom/dinero";
import { ImprimirIcono } from "../custom/iconos";
import * as Print from "expo-print";

const HistorialPagos = ({ cobros }) => {
  const imprimirHistorial = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Historial de Pagos</h1>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Tipo de pago</th>
              </tr>
            </thead>
            <tbody>
              ${cobros
                .map(
                  (cobro) => `
                <tr>
                  <td>${new Date(cobro.payment_date).toLocaleDateString()}</td>
                  <td>${formatearMonto(cobro.amount)}</td>
                  <td>${cobro.payment_type}</td>
                </tr>
              `
                )
                .join("")}
                
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error al imprimir:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Pagos</Text>
        <TouchableOpacity style={styles.imprimir} onPress={imprimirHistorial}>
          <ImprimirIcono size={26} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentItem}>
            <Text style={styles.paymentText}>
              Monto: {formatearMonto(item.amount)} - Fecha:{" "}
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
