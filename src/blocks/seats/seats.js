import { declOfNum } from "../../js/utils/declOfNumbers.js";
import ready from "../../js/utils/documentReady.js";
import { formatPrice } from "../../js/utils/formatPrice.js";
import { AVAILABLE_PLACES, fetchData } from "./mockData.js";

ready(function () {
  const seatsPage = document.querySelector(".js-seats-page");

  if (!seatsPage) {
    return;
  }
  let availablePlaces;
  let chosenPlaces = [];

  const plusBtn = document.querySelector(".js-plus-button");
  const minusBtn = document.querySelector(".js-minus-button");
  const seatingChart = document.querySelector(".js-seats-container");
  const places = document.querySelectorAll(".js-place");
  const loader = document.querySelector(".js-loader");
  const resultCardsContainer = document.querySelector(".js-result-cards");
  const filterButtonsContainer = document.querySelector(".js-filters-container");

  const resultText = document.querySelector(".js-result-text");

  let scale = 1;
  const LEFT_PADDING = 20;
  const TOP_PADDING = 20;

  plusBtn.addEventListener("click", () => {
    scale += 0.1;
    seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;
  });

  minusBtn.addEventListener("click", () => {
    if (scale > 0.1) {
      scale -= 0.1;
      seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;
    }
  });

  function handleMouseMove(evt) {
    if (evt.buttons === 1) {
      const translateX = parseInt(seatingChart.style.transform.split(",")[4]) + evt.movementX;
      const translateY = parseInt(seatingChart.style.transform.split(",")[5]) + evt.movementY;
      seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    }
  }

  document.addEventListener("mousemove", handleMouseMove);

  document.addEventListener("click", (evt) => {
    if (evt.target.closest(".place")) {
      console.log("place", evt.target.closest(".js-place"));
    }
  });

  const generateTooltip = (data) => {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `
              <div class="tooltip__price">5 000 ₽</div>
              <div class="tooltip__place"><span>Сектор  2</span><span>1 ряд, 5 место</span></div>
            `;
    return tooltip;
  };

  places.forEach((place) => {
    place.addEventListener("mouseover", () => {
      const tooltip = generateTooltip(place);
      document.body.appendChild(tooltip);
      const { left, top, width: placeWidth } = place.getBoundingClientRect();
      tooltip.style.left = `${left - tooltip.offsetWidth / 2 + LEFT_PADDING}px`;
      const tooltipHeight = tooltip.offsetHeight;

      const distanceToTop = top - tooltipHeight - 10;

      // todo проверить скролл боди и добавить в Y

      if (distanceToTop < 0) {
        tooltip.style.top = `${top + TOP_PADDING}px`;
        tooltip.classList.add("tooltip--bottom");
      } else {
        tooltip.style.top = `${distanceToTop}px`;
      }
    });

    place.addEventListener("mouseout", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        document.body.removeChild(tooltip);
      }
    });
  });

  const showLoader = () => {
    seatingChart.classList.add("loading");
    loader.classList.remove("hidden");
  };

  const hideLoader = () => {
    seatingChart.classList.remove("loading");
    loader.classList.add("hidden");
  };

  const generateFilterButton = (data) => {
    const { color, price } = data;
    const formattedPrice = formatPrice(price);
    const filterButton = document.createElement("button");
    filterButton.classList.add("filter-button", "seats__filters-button", "js-filter-button", color);
    filterButton.setAttribute("data-price", price);
    filterButton.innerHTML = `<span class="filter-button__color"></span><span class="filter-button__text">${formattedPrice}</span>`;
    return filterButton;
  };

  const setFilters = (data) => {
    const uniquePrices = [...new Set(data.map((place) => place.price))];
    const ascSortedArr = uniquePrices.sort((a, b) => Number(a) - Number(b));

    for (const price of ascSortedArr) {
      const filteredPlace = data.find((place) => place.price === price);
      const color = filteredPlace.color;

      const button = generateFilterButton({ color, price });

      filterButtonsContainer.appendChild(button);
    }
  };

  const filterPlacesByPrice = (price) => {
    const filteredPlaces = availablePlaces.filter((place) => place.price === price);
    updateSeatsData(filteredPlaces);
  };

  const removeFilterEffect = () => {
    updateSeatsData(availablePlaces);
  };

  const resetPlacesData = () => {
    places.forEach((placeElement) => {
      placeElement.classList.remove("available");
      placeElement.removeAttribute("data-color");
    });
  };

  const updateSeatsData = (data) => {
    resetPlacesData();
    data.forEach((placeItem) => {
      const { sector, place, price, color } = placeItem;

      const placeElement = seatingChart.querySelector(
        `.js-place[data-sector="${sector}"][data-place="${place}"]`,
      );

      placeElement.classList.add("available");
      placeElement.setAttribute("data-price", price);
      placeElement.setAttribute("data-color", color);
    });
  };

  const showAvailablePlaces = async () => {
    showLoader();
    availablePlaces = await fetchData(AVAILABLE_PLACES);

    updateSeatsData(availablePlaces);

    setFilters(availablePlaces);

    hideLoader();
  };

  showAvailablePlaces();

  // фильтрация
  document.addEventListener("click", (evt) => {
    if (evt.target.closest(".js-filter-button")) {
      const currentButton = evt.target.closest(".js-filter-button");
      if (currentButton.classList.contains("active")) {
        currentButton.classList.remove("active");
        removeFilterEffect();
      } else {
        currentButton.classList.add("active");
        const { price } = currentButton.dataset;
        filterPlacesByPrice(price);
      }
    }
  });

  // выбор места

  const updateResultText = () => {
    const ticketsAmount = chosenPlaces.length;
    const totalPrice = chosenPlaces.reduce((acc, item) => {
      return acc + Number(item.price);
    }, 0);
    const ticketWord = declOfNum(ticketsAmount, ["билет", "билета", "билетов"]);
    const formattedPrice = formatPrice(totalPrice);
    resultText.innerHTML = `Вы выбрали ${ticketsAmount} ${ticketWord}: ${formattedPrice}`;
  };
  const generateResultCard = (data) => {
    const { sector, place, price, color } = data;

    const row = Number(place) <= 5 ? "1" : "2";

    const formattedPrice = formatPrice(price);
    const resultCard = document.createElement("div");
    const uniqueID = Date.now();
    resultCard.setAttribute("data-id", uniqueID);
    chosenPlaces.push({ ...data, id: uniqueID });
    resultCard.classList.add("seats__result-card", "result-card", "js-result-card");
    resultCard.innerHTML = `
          <button class="result-card__close js-remove-card">x</button>
            <div class="result-card__price">${formattedPrice}</div>
            <div class="result-card__text"><span>Сектор ${sector}</span><span>${row} ряд, ${place} место</span>
          </div>
            `;
    return resultCard;
  };

  // todo
  const showResultPanel = () => {};

  const handlePlaceChoose = (placeElement) => {
    if (chosenPlaces.length < 5) {
      const resultCard = generateResultCard(placeElement.dataset);
      resultCardsContainer.appendChild(resultCard);
      updateResultText();
      console.log("chosenPlaces", chosenPlaces);
    } else {
      alert("Можно выбрать не более 5 мест");
    }
  };

  places.forEach((place) => {
    place.addEventListener("click", () => {
      handlePlaceChoose(place);
    });
  });

  // удаление карточки
  // todo
  resultCardsContainer.addEventListener("click", (evt) => {
    if (evt.target.closest(".js-remove-card")) {
      const resultCard = evt.target.closest(".js-result-card");
      const placeId = resultCard.dataset.id;
      chosenPlaces = chosenPlaces.filter((place) => place.id !== Number(placeId));
      resultCard.remove();
      updateResultText();
    }
  });
});
