// PagoNuevo.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import axios from "../../api/axios";
import { formatearMonto } from "../custom/dinero";

const PagoNuevo = ({ collectorId, debtorId, actualizarPantalla, balance }) => {
  console.log("IDs en PagoNuevo:", { collectorId, debtorId });

  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    const montoPago = parseFloat(amount);

    if (!montoPago || montoPago <= 0) {
      return Alert.alert("Error", "El monto debe ser mayor a cero");
    }

    if (montoPago > balance) {
      return Alert.alert(
        "Error",
        `El monto a pagar no puede ser mayor al balance actual de ${formatearMonto(
          balance
        )}`
      );
    }

    try {
      const paymentData = {
        collector_id: collectorId,
        debtor_id: debtorId,
        amount: parseFloat(amount),
        payment_date: new Date().toISOString(),
      };

      console.log("Datos de pago enviados:", paymentData);

      // Envío del pago al backend
      const response = await axios.post("/cobros/registrar", paymentData);

      if (response.status === 201) {
        Alert.alert("Éxito", "El pago fue registrado exitosamente.");
        setAmount(""); // Reinicia el monto

        // Actualizar Pantalla
        actualizarPantalla();
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      Alert.alert("Error", "Hubo un problema al registrar el pago.");
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Monto del Pago"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button
        title="Registrar Pago"
        onPress={() =>
          Alert.alert(
            "Alerta",
            "¿Estás seguro de introducir este monto?",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelar"),
                style: "cancel",
              },
              { text: "Aceptar", onPress: handlePayment },
            ],
            { cancelable: false }
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default PagoNuevo;
