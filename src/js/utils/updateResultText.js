import { declOfNum } from "./declOfNumbers";
import { formatPrice } from "./formatPrice";

export const updateResultText = (textContainer, data) => {
  const ticketsAmount = data.length;
  const totalPrice = data.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);
  const ticketWord = declOfNum(ticketsAmount, ["билет", "билета", "билетов"]);
  const formattedPrice = formatPrice(totalPrice);
  textContainer.innerHTML = `Вы выбрали ${ticketsAmount} ${ticketWord}: ${formattedPrice}`;
};
