import { formatPrice } from "./formatPrice";

export const generateTooltip = (data) => {
  const { sector, place, price } = data.dataset;
  const row = Number(place) <= 5 ? "1" : "2";
  const formattedPrice = formatPrice(price);
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerHTML = `
              <div class="tooltip__price">${formattedPrice}</div>
              <div class="tooltip__place"><span>Сектор  ${sector}</span><span>${row} ряд, ${place} место</span></div>
            `;
  return tooltip;
};
