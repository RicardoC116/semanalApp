//HomeScreen
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import axios from "../api/axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import jwtDecode from "jwt-decode";
import { formatearMonto } from "../components/dinero";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ onLogout, navigation }) {
  const [cobrador, setCobrador] = useState({ id: null, name: "" });
  const [deudores, setDeudores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCobradorData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("*********Token:", token, "********");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log("********* Decoded Token:", decoded, "********");

            const id = decoded.id;
            const name = decoded.name;
            if (id && name) {
              setCobrador({ id, name });
              fetchDeudores(id);
            } else {
              console.warn("ID o nombre no encontrados en el token.");
            }
          } catch (error) {
            console.error("Error al decodificar el token:", error);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos del cobrador:", error);
      }
    };

    fetchCobradorData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (cobrador.id) {
        fetchDeudores(cobrador.id);
      }
    }, [cobrador.id]) // Dependencia en el ID del cobrador
  );
  
  // Lista de deudores
  const fetchDeudores = useCallback(async (cobradorId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/deudores/cobrador/${cobradorId}`);
      setDeudores(response.data);
    } catch (error) {
      console.error("Error al obtener deudores:", error);
      Alert.alert("Error", "Hubo un problema al obtener los deudores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cerrar sesion
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      Alert.alert("Sesión Cerrada", "Has cerrado la sesión correctamente.");
      onLogout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  const renderDeudores = ({ item }) => {
    console.log("Collector ID en renderDeudores:", cobrador.id);
    return (
      <TouchableOpacity
        style={styles.deudorItem}
        onPress={() =>
          navigation.navigate("DeudorDetail", {
            deudorId: item.id,
            name: item.name,
            collectorId: cobrador.id,
            balance: item.balance,
          })
        }
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.areaContainer}>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>
            ¡Bienvenido, {cobrador.name}! (ID: {cobrador.id})
          </Text>

          {isLoading ? (
            <Text>Cargando deudores...</Text>
          ) : (
            <FlatList
              data={deudores}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderDeudores}
              ListEmptyComponent={<Text>No hay clientes asociados</Text>}
            />
          )}

          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            color="#dc3545"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  areaContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
  deudorItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  deudorText: {
    fontSize: 16,
    color: "#333",
  },
});
