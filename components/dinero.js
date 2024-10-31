export const formatearMonto = (monto) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN", // Cambiar a pesos mexicanos
    minimumFractionDigits: 2,
  }).format(monto);
};
