// DeudorDetailScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "../api/axios";
import { formatearMonto } from "../components/dinero";
import HistorialPagos from "../components/HistorialPagos"; // Asegúrate de que la ruta sea correcta

export default function DeudorDetailScreen({ route }) {
  const { deudorId, name } = route.params; // Recibe el ID del deudor
  const [deudorDetails, setDeudorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeudorDetails = async () => {
      try {
        const response = await axios.get(`/deudores/${deudorId}`);
        setDeudorDetails(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del deudor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeudorDetails();
  }, [deudorId]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de {name}</Text>
      {deudorDetails && (
        <>
          <Text style={styles.detailText}>
            Tipo de pago: {deudorDetails.payment_type}
          </Text>
          <Text style={styles.detailText}>
            Total a pagar: {formatearMonto(deudorDetails.total_to_pay)}
          </Text>
          <Text style={styles.detailText}>
            Primer pago: {formatearMonto(deudorDetails.first_payment)}
          </Text>
          <Text style={styles.detailText}>
            Balance: {formatearMonto(deudorDetails.balance)}
          </Text>

          {/*  HistorialPagos  */}
          <HistorialPagos debtorId={deudorId} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
