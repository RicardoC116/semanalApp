// PagoNuevo.js
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button, Alert } from "react-native";
import axios from "../../api/axios";
import * as Print from "expo-print"; // Importar Print para impresión
import { formatearMonto } from "../custom/dinero";

const PagoNuevo = ({ collectorId, debtorId, actualizarPantalla, balance }) => {
  const [amount, setAmount] = useState("");

  const imprimirRecibo = async (
    monto,
    fecha,
    balanceAnterior,
    balanceActual
  ) => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              text-align: center;
              font-size: 12px;
            }
            .container {
              width: 100%;
              padding: 10px;
              border: 1px solid #000;
              margin: 0 auto;
            }
            h1 {
              font-size: 16px;
              margin-bottom: 5px;
            }
            p {
              margin: 5px 0;
              line-height: 1.4;
            }
            .bold {
              font-weight: bold;
            }
            .footer {
              font-size: 10px;
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>COBRO ST</h1>
            <p><span class="bold">Fecha:</span> ${fecha}</p>
            <p><span class="bold">Monto del Pago:</span> ${formatearMonto(
              monto
            )}</p>
            <p><span class="bold">Balance Anterior:</span> ${formatearMonto(
              balanceAnterior
            )}</p>
            <p><span class="bold">Balance Actual:</span> ${formatearMonto(
              balanceActual
            )}</p>
            <p>Recibimos su pago. ¡Gracias!</p>
            <div class="footer">
              Este recibo no reemplaza una factura fiscal.<br/>
              Guarde este recibo para cualquier aclaración.
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error al imprimir el recibo:", error);
    }
  };

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

    const balanceAnterior = balance;
    const balanceActual = balanceAnterior - montoPago;

    try {
      const paymentData = {
        collector_id: collectorId,
        debtor_id: debtorId,
        amount: montoPago,
        payment_date: new Date().toISOString(),
      };

      // Envío del pago al backend
      const response = await axios.post("/cobros/registrar", paymentData);

      if (response.status === 201) {
        Alert.alert("Éxito", "El pago fue registrado exitosamente.", [
          {
            text: "Imprimir Recibo",
            onPress: () => {
              const fechaPago = new Date().toLocaleDateString();
              imprimirRecibo(
                montoPago,
                fechaPago,
                balanceAnterior,
                balanceActual
              );
            },
          },
          {
            text: "Cerrar",
            style: "cancel",
          },
        ]);

        setAmount(""); // Reinicia el monto
        actualizarPantalla(); // Actualizar la pantalla
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      Alert.alert("Error", "Hubo un problema al registrar el pago.");
    }
  };

  const confirmarPago = () => {
    Alert.alert(
      "Confirmación",
      `¿Deseas registrar el pago por ${formatearMonto(amount)}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () =>
            Alert.alert(
              "Confirmación Final",
              "¿Estás completamente seguro de registrar este pago?",
              [
                { text: "Cancelar", style: "cancel" },
                { text: "Sí, registrar", onPress: handlePayment },
              ]
            ),
        },
      ]
    );
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
      <Button title="Registrar Pago" onPress={confirmarPago} />
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
