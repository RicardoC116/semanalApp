// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import axios from "../api/axios";

// export default function DeudorDetailsScreen({ route }) {
//   const { deudorId } = route.params;
//   const [deudor, setDeudor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDeudorDetails = async () => {
//       try {
//         const response = await axios.get(`/deudores/${deudorId}`);
//         setDeudor(response.data);
//       } catch (error) {
//         console.error("Error al obtener detalles del deudor:", error);
//       }
//     };

//     fetchDeudorDetails();
//   }, [deudorId]);

//   if (!deudor) {
//     return <Text>Cargando detalles...</Text>;
//   }

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007bff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{deudor.name}</Text>
//       <Text>Contrato: {deudor.contract_number}</Text>
//       <Text>Monto: {deudor.amount}</Text>
//       <Text>Total a Pagar: {deudor.total_to_pay}</Text>
//       <Text>Primer Pago: {deudor.first_payment}</Text>
//       <Text>Balance: {deudor.balance}</Text>
//       <Text>Tipo de Pago: {deudor.payment_type}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import { Text, View } from "react-native";


