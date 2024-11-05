// components/HistorialPagos.js
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { formatearMonto } from "../components/dinero"; // Asegúrate de que la ruta sea correcta

const HistorialPagos = ({ debtorId }) => {
  const [cobros, setCobros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCobros = async () => {
      try {
        const response = await axios.get(`/cobros/deudor/${debtorId}`);
        setCobros(response.data);
      } catch (error) {
        console.error("Error fetching cobros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCobros();
  }, [debtorId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pagos</Text>
      <FlatList
        data={cobros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View styles={styles.xd}>
            <Text>
              {formatearMonto(item.amount)} -
              {new Date(item.payment_Date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
  xd: {
    padding: 20,
  },
});

export default HistorialPagos;
