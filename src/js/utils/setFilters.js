import { generateFilterButton } from "./generateFilterButton";

export const setFilters = (buttonsContainer, data) => {
  const uniquePrices = [...new Set(data.map((place) => place.price))];
  const ascSortedArr = uniquePrices.sort((a, b) => Number(a) - Number(b));

  for (const price of ascSortedArr) {
    const filteredPlace = data.find((place) => place.price === price);
    const color = filteredPlace.color;

    const button = generateFilterButton({ color, price });

    buttonsContainer.appendChild(button);
  }
};
