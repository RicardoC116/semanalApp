// components/global/DeudoresList

import React, { useCallback, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  View,
} from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../custom/dinero";
import { useFocusEffect } from "@react-navigation/native";
import InputWithIcon from "../custom/inputWithText";

export default function DeudoresList({ userId, paymentType, navigation }) {
  const [deudores, setDeudores] = useState([]);
  const [filteredDeudores, setFilteredDeudores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focus, setFocus] = useState(false);

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
      setFilteredDeudores(filteredDeudores); // Inicializar la lista filtrada
    } catch (error) {
      console.error("Error al obtener los deudores:", error);
      Alert.alert("Error", "Hubo un problema al obtener los deudores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manejar búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = deudores.filter(
        (deudor) =>
          deudor.name.toLowerCase().includes(text.toLowerCase()) ||
          String(deudor.contract_number)
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredDeudores(filtered);
    } else {
      setFilteredDeudores(deudores);
    }
  };

  const renderDeudores = ({ item }) => {
    const balanceNumerico = parseFloat(item.balance);

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
        <Text style={styles.deudorText}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            Nombre -
          </Text>{" "}
          {item.name}
        </Text>
        <Text style={styles.deudorText}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            Monto a pagar -
          </Text>{" "}
          {formatearMonto(item.amount)}
        </Text>
        <Text style={styles.deudorText}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
            }}
          >
            Balance -
          </Text>{" "}
          {formatearMonto(item.balance)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Barra de búsqueda */}
        <InputWithIcon
          value={searchText}
          onChangeText={handleSearch}
          focus={focus}
          placeholder="Buscar usuario..."
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </View>
      <View style={styles.resultsContainer}>
        <FlatList
          data={filteredDeudores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeudores}
          ListEmptyComponent={<Text>No hay clientes asociados</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    marginTop: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  deudorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderRadius: 10,
  },
  deudorText: {
    fontSize: 16,
    color: "#333",
  },
  deuda: {
    backgroundColor: "#FBFBFB",
  },
  sinBalance: {
    backgroundColor: "#A1DD70",
  },
});
