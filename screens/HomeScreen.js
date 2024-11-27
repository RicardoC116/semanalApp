// HomeScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import axios from "../api/axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { formatearMonto } from "../components/custom/dinero";
import { useFocusEffect } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation, onLogout }) {
  const { user } = useAuth();
  const [deudores, setDeudores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch deudores por primera vez y al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchDeudores(user?.id);
      }
    }, [user?.id])
    // useCallback(() => {
    //   if (user && user.id) {
    //     fetchDeudores();
    //   }
    // }, [user?.id])
  );

  // Fetch deudores y actualizar periódicamente mientras esté en la pantalla
  // useEffect(() => {
  //   if (user && user.id) {
  //     fetchDeudores();

  //     const intervalId = setInterval(() => {
  //       fetchDeudores();
  //     }, 20000);

  //     return () => clearInterval(intervalId);
  //   }
  // }, [user?.id]);

  // Lista de deudores
  const fetchDeudores = useCallback(async () => {
    if (!user?.id) {
    }
    try {
      const response = await axios.get(`/deudores/cobrador/${user.id}`);
      setDeudores(response.data);
    } catch (error) {
      console.error("Error al obtener deudores:", error);
      Alert.alert("Error", "Hubo un problema al obtener los deudores.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cerrar sesión
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

  // Renderiza los elementos de la lista de deudores
  const renderDeudores = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.deudorItem}
        onPress={() =>
          navigation.navigate("DeudorDetail", {
            deudorId: item.id,
            name: item.name,
            collectorId: user.id,
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
            ¡Bienvenido, {user?.name}! (ID: {user?.id})
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
