import { formatPrice } from "./formatPrice";

export const generateFilterButton = (data) => {
  const { color, price } = data;
  const formattedPrice = formatPrice(price);
  const filterButton = document.createElement("button");
  filterButton.classList.add("filter-button", "seats__filters-button", "js-filter-button", color);
  filterButton.setAttribute("data-price", price);
  filterButton.innerHTML = `<span class="filter-button__color"></span><span class="filter-button__text">${formattedPrice}</span>`;
  return filterButton;
};
