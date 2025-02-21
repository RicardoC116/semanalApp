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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTime } from "luxon";

export default function DeudoresList({ userId, paymentType, navigation }) {
  const [deudores, setDeudores] = useState([]);
  const [filteredDeudores, setFilteredDeudores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focus, setFocus] = useState(false);
  const [clientesQuePagaronHoy, setClientesQuePagaronHoy] = useState(new Set());
  const [clientesCobradosHoy, setClientesCobradosHoy] = useState(0);
  const [montoTotalHoy, setMontoTotalHoy] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        recuperarDatosDeLocal();
        fetchDeudores(userId, paymentType);
      }
    }, [userId, paymentType])
  );

  const fetchDeudores = useCallback(async (userId, paymentType) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/deudores/cobrador/${userId}`);

      // Filtros para la lista
      const filteredDeudores = response.data.filter(
        (deudor) =>
          deudor.payment_type === paymentType && parseFloat(deudor.balance) > 0
      );

      setDeudores(filteredDeudores);
      setFilteredDeudores(filteredDeudores); // Inicializar la lista filtrada

      await obtenerPagosDelDia();
    } catch (error) {
      console.error("Error al obtener los deudores:", error);
      Alert.alert("Error", "Hubo un problema al obtener los deudores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar los datos en local
  const guardarDatosEnLocal = async (
    clientesCobrados,
    montoTotal,
    clientesPagaron
  ) => {
    try {
      const data = {
        clientesCobrados,
        montoTotal,
        clientesPagaron: Array.from(clientesPagaron),
        fecha: new Date().toISOString().split("T")[0],
      };
      await AsyncStorage.setItem("resumenDia", JSON.stringify(data));
    } catch (error) {
      console.log("Error al guardar datos en AsyncStorage", error);
    }
  };

  // Recuperar los datos guardados
  const recuperarDatosDeLocal = async () => {
    try {
      const data = await AsyncStorage.getItem("resumenDia");
      if (data) {
        const { clientesCobrados, montoTotal, clientesPagaron, fecha } =
          JSON.parse(data);
        const hoy = DateTime.now()
          .setZone("America/Mexico_City")
          .toISODate()
          .split("T")[0];

        if (fecha === hoy) {
          setClientesCobradosHoy(clientesCobrados);
          setMontoTotalHoy(montoTotal);
          setClientesQuePagaronHoy(new Set(clientesPagaron));
        } else {
          await AsyncStorage.removeItem("resumenDia"); // Si es otro día, borrar los datos
        }
      }
    } catch (error) {
      console.error("Error al recuperar datos de AsyncStorage", error);
    }
  };

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

  const obtenerPagosDelDia = async () => {
    try {
      // const hoy = new Date().toISOString().split("T")[0];
      const hoy = DateTime.now().setZone("America/Mexico_City").toISODate();

      const response = await axios.get(
        `/cobros/diaId?fecha=${hoy}&collector_id=${userId}`
      );

      const pagosHoy = response.data.cobros;
      console.log("Cobros obtenidos:", response.data);

      const clientesUnicos = new Set(pagosHoy.map((pago) => pago.debtor_id));
      const totalMonto = pagosHoy.reduce(
        (sum, pago) => sum + parseFloat(pago.amount),
        0
      );

      setClientesQuePagaronHoy(clientesUnicos);
      setClientesCobradosHoy(clientesUnicos.size);
      setMontoTotalHoy(totalMonto);

      // Guardamos los datos en local
      guardarDatosEnLocal(clientesUnicos.size, totalMonto, clientesUnicos);
    } catch (error) {
      console.error("Error al obtener pagos del día", error);
    }
  };

  const renderDeudores = ({ item }) => {
    const balanceNumerico = parseFloat(item.balance);

    return (
      <View
        style={[
          styles.containerList,
          Number(item.balance) === 0 && styles.liquidadoBackground, //Liquidaciones
          clientesQuePagaronHoy.has(item.id) && styles.pagadoHoyBackground, //Pagos de hoy
        ]}
      >
        <TouchableOpacity
          style={[
            styles.deudorItem,
            // balanceNumerico === 0 ? styles.sinBalance : styles.deuda,
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
            {formatearMonto(item.total_to_pay)}
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
      </View>
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

      <View style={styles.resumenContainer}>
        <Text style={styles.resumenTitulo}>Total del día</Text>
        <View style={styles.resumenDatos}>
          <Text style={styles.resumenTexto}>
            Clientes cobrados:{" "}
            <Text style={styles.valor}>{clientesCobradosHoy}</Text>
          </Text>
          <Text style={styles.resumenTexto}>
            Cobranza total:{" "}
            <Text style={styles.valor}>{formatearMonto(montoTotalHoy)}</Text>
          </Text>
        </View>
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
    // marginTop: 10,
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
  containerList: {
    flex: 1,
    backgroundColor: "#fff",
  },
  liquidadoBackground: {
    backgroundColor: "#d4edda",
  },
  pagadoHoyBackground: {
    backgroundColor: "#ffeb3b",
  },
  resumenContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resumenTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  resumenDatos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumenTexto: {
    fontSize: 16,
  },
  valor: {
    fontWeight: "bold",
    color: "#28a745",
  },
});
