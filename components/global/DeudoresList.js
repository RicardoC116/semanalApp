// components/global/DeudoresList
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../custom/dinero";
import { useFocusEffect } from "@react-navigation/native";

export default function DeudoresList({ userId, paymentType, navigation }) {
  const [deudores, setDeudores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchDeudores(userId, paymentType);
      }
    }, [userId, paymentType])
  );

  const fetchDeudores = useCallback(async (userId, paymentType) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/deudores/cobrador/${userId}`);
      const filteredDeudores = response.data.filter(
        (deudor) => deudor.payment_type === paymentType
      );
      setDeudores(filteredDeudores);
    } catch (error) {
      console.error("Error al obtener los deudores:", error);
      Alert.alert("Error", "Hubo un problema al obtener los deudores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderDeudores = ({ item }) => {
    const balanceNumerico = parseFloat(item.balance);

    console.log("Balance numérico:", balanceNumerico);

    return (
      <TouchableOpacity
        style={[
          styles.deudorItem,
          balanceNumerico === 0 ? styles.sinBalance : styles.deuda,
        ]}
        onPress={() => {
          if (balanceNumerico === 0) {
            Alert.alert("Alerta", "El cliente dio todos sus pagos");
          }

          navigation.navigate("DetallesDeudores", {
            deudorId: item.id,
            name: item.name,
            collectorId: userId,
            balance: item.balance,
          });
        }}
      >
        <Text style={styles.deudorText}>Nombre - {item.name}</Text>
        <Text style={styles.deudorText}>
          Monto a pagar {formatearMonto(item.amount)}
        </Text>
        <Text style={styles.deudorText}>
          Balance {formatearMonto(item.balance)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={deudores}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderDeudores}
      ListEmptyComponent={<Text>No hay clientes asociados</Text>}
    />
  );
}

const styles = StyleSheet.create({
  deudorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10 ,
  },
  deudorText: {
    fontSize: 16,
    color: "#333",
  },
  deuda: {
    backgroundColor: "#FBFBFB", // Rojo para deudas
  },
  sinBalance: {
    backgroundColor: "#A1DD70", // Verde para balance en 0
  },
});
