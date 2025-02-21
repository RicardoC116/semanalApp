import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import axios from "../../api/axios";
import * as Print from "expo-print";
import { formatearMonto } from "../custom/dinero";

const PagoNuevo = ({
  collectorId,
  debtorId,
  actualizarPantalla,
  balance,
  nombreDeudor,
  numeroTarjeta,
}) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false); // Estado para la cuenta regresiva
  const [secondsLeft, setSecondsLeft] = useState(5); // Tiempo restante

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
          @page {
            size: Letter;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          .page-container {
            width: 100%;
            height: 11in; /* 11 inches de alto para carta */
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
          }
          .receipt {
            height: 50%; /* cada recibo ocupa la mitad */
            padding: 10px;
            box-sizing: border-box;
            text-align: center;
            border: 1px solid #000;
          }
          .receipt h1 {
            margin: 0;
            font-size: 18px;
          }
          .receipt .client-name {
            text-align: left;
            font-weight: bold;
            margin-top: 5px;
          }
          .receipt .data {
            margin: 10px 0;
            text-align: center;
          }
          .footer {
            font-size: 10px;
            border-top: 1px dashed #000;
            padding-top: 5px;
          }
          .cut-marker {
            height: 0;
            border-top: 2px dashed #000;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="receipt">
            <h1>Pre$ta Mas</h1>
            <div class="client-name">Nombre del Cliente: ${nombreDeudor} </div>
            <div class="data">
              <p><strong>Fecha:</strong> ${fecha}</p>
              <p><strong>Número de Cuenta:</strong> ${numeroTarjeta}</p>
              <p><strong>Pago Realizado:</strong> ${monto}</p>
              <p><strong>Saldo:</strong> ${balanceActual}</p>
              <p><strong>Saldo Anterior:</strong> ${balanceAnterior}</p>
            </div>
            <div class="footer">
              Recuerde realizar sus pagos a tiempo para tener buenos beneficios en su próximo crédito.<br/>
              Guarde este recibo para cualquier aclaración.
            </div>
          </div>
          <div class="cut-marker"></div>
          <div class="receipt">
            <h1>Pre$ta Mas</h1>
            <div class="client-name">Nombre del Cliente: ${nombreDeudor}</div>
            <div class="data">
              <p><strong>Fecha:</strong> ${fecha}</p>
              <p><strong>Número de Cuenta:</strong> ${numeroTarjeta}</p>
              <p><strong>Pago Realizado:</strong> ${monto}</p>
              <p><strong>Saldo:</strong> ${balanceActual}</p>
              <p><strong>Saldo Anterior:</strong> ${balanceAnterior}</p>
            </div>
            <div class="footer">
              Recuerde realizar sus pagos a tiempo para tener buenos beneficios en su próximo crédito.<br/>
              Guarde este recibo para cualquier aclaración.
            </div>
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
      setLoading(true);
      const paymentData = {
        collector_id: collectorId,
        debtor_id: debtorId,
        amount: montoPago,
        payment_date: new Date().toISOString(),
      };

      const response = await axios.post("/cobros/registrar", paymentData);
      setLoading(false);

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

        setAmount("");
        actualizarPantalla();
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      setLoading(false);
      Alert.alert("Error", "Hubo un problema al registrar el pago.");
    }
  };

  const confirmarPago = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return Alert.alert("Error", "Ingresa un monto válido");
    }

    setConfirming(true); // Iniciar la animación
    setSecondsLeft(5);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setSecondsLeft(count);

      if (count === 0) {
        clearInterval(interval);
        setConfirming(false);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Monto del Pago"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!loading && !confirming}
      />

      {confirming ? (
        <View style={styles.countdownContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.countdownText}>
            Confirmando en {secondsLeft} segundos...
          </Text>
          <Text style={styles.amountText}>Monto: {formatearMonto(amount)}</Text>
        </View>
      ) : (
        <>
          <Button
            title={loading ? "Procesando..." : "Registrar Pago"}
            onPress={confirmarPago}
            disabled={loading}
          />

          {secondsLeft === 0 && (
            <View style={styles.buttonsContainer}>
              <Button
                title="Cancelar"
                onPress={() => setSecondsLeft(5)}
                color="red"
              />
              <Button title="Confirmar" onPress={handlePayment} color="green" />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  countdownContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginTop: 10,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default PagoNuevo;
