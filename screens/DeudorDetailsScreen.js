// DeudorDetailScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "../api/axios";
import { formatearMonto } from "../components/custom/dinero";
import HistorialPagos from "../components/global/HistorialPagos";
import PagoNuevo from "../components/global/pagoNuevo";
import { useFocusEffect } from "@react-navigation/native";
import { capitalizeFirstLetter } from "../components/custom/letas";

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
      setCobros(response.data.reverse()); // Actualizamos el estado del historial
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
            <Text
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Tipo de pago:
            </Text>{" "}
            {capitalizeFirstLetter(deudorDetails.payment_type)}
          </Text>
          <Text style={styles.detailText}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Total a pagar:
            </Text>{" "}
            {formatearMonto(deudorDetails.total_to_pay)}
          </Text>
          <Text style={styles.detailText}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Balance:
            </Text>{" "}
            {formatearMonto(deudorDetails.balance)}
          </Text>
          <Text style={styles.detailText}>
            <Text
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Pago Sugerido
            </Text>{" "}
            {formatearMonto(deudorDetails.suggested_payment)}
          </Text>

          {deudorDetails.numero_telefono ? (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneLabel}>Numero de Telefono: </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(`tel:${deudorDetails.numero_telefono}`)
                }
              >
                <Text style={styles.phoneNumber}>
                  {deudorDetails.numero_telefono}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* HistorialPagos */}
          <HistorialPagos debtorId={deudorId} cobros={cobros} />
          {/* Pago Nuevo */}
          <PagoNuevo
            collectorId={collectorId}
            debtorId={deudorId}
            actualizarPantalla={actualizarPantalla}
            balance={balance}
            nombreDeudor={name}
            numeroTarjeta={deudorDetails.contract_number}
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
    textAlign: "start",
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  phoneNumber: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 18,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
