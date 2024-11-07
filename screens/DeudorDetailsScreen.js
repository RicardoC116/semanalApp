// DeudorDetailScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "../api/axios";
import { formatearMonto } from "../components/dinero";
import HistorialPagos from "../components/HistorialPagos";
import PagoNuevo from "../components/pagoNuevo";
import { useFocusEffect } from "@react-navigation/native";

export default function DeudorDetailScreen({ route }) {
  const { deudorId, name, collectorId, balance } = route.params;
  console.log("IDs en DeudorDetailScreen:", { deudorId, collectorId });

  const [deudorDetails, setDeudorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cobros, setCobros] = useState([]); // Estado para el historial de pagos

  // Obtener detalles del deudor cuando el componente se monta
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

  // Función para cargar los detalles del deudor
  const cargarDetallesDeudor = async () => {
    try {
      const response = await axios.get(`/deudores/${deudorId}`);
      setDeudorDetails(response.data); // Actualiza los detalles del deudor
    } catch (error) {
      console.error("Error al cargar los detalles del deudor:", error);
    }
  };

  // Función para cargar el historial de pagos
  const cargarHistorialPagos = async () => {
    try {
      const response = await axios.get(`/cobros/deudor/${deudorId}`);
      setCobros(response.data); // Actualizamos el estado del historial
    } catch (error) {
      console.error("Error al cargar el historial de pagos:", error);
    }
  };

  // Usa `useFocusEffect` para recargar los detalles al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarDetallesDeudor();
    }, [deudorId])
  );

  // Cargar el historial de pagos cada vez que la pantalla vuelva a estar en foco
  useFocusEffect(
    useCallback(() => {
      cargarHistorialPagos();
    }, [deudorId])
  );

  // Nueva función para actualizar ambos: balance y el historial de pagos
  const actualizarPantalla = () => {
    cargarDetallesDeudor();
    cargarHistorialPagos();
  };

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
            Balance: {formatearMonto(deudorDetails.balance)}
          </Text>

          {/* HistorialPagos */}
          <HistorialPagos debtorId={deudorId} cobros={cobros} />
          {/* Pago Nuevo */}
          <PagoNuevo
            collectorId={collectorId}
            debtorId={deudorId}
            actualizarPantalla={actualizarPantalla} // Pasamos la nueva función aquí
            balance={balance}
          />
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
