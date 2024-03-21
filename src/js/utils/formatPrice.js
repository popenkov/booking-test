export const formatPrice = (price) => {
  const formattedPrice = Number(price).toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  });
  return formattedPrice;
};
