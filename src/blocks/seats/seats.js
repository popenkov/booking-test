import { addScrollPadding } from "../../js/utils/addScrollPadding.js";
import { declOfNum } from "../../js/utils/declOfNumbers.js";
import ready from "../../js/utils/documentReady.js";
import { formatPrice } from "../../js/utils/formatPrice.js";
import { AVAILABLE_PLACES, fetchData, postData } from "./mockData.js";

ready(function () {
  const seatsPage = document.querySelector(".js-seats-page");

  if (!seatsPage) {
    return;
  }

  let scale = 1,
    translateX = 0,
    translateY = 0;

  const LEFT_PADDING = 20;
  const TOP_PADDING = 20;
  const PLACE_RADIUS = 10;
  let availablePlaces;
  let chosenPlaces = [];

  const plusBtn = document.querySelector(".js-plus-button");
  const minusBtn = document.querySelector(".js-minus-button");
  const seatingChart = document.querySelector(".js-seats-container");
  const places = document.querySelectorAll(".js-place");
  const loader = document.querySelector(".js-loader");
  const resultCardsContainer = document.querySelector(".js-result-cards");
  const filterButtonsContainer = document.querySelector(".js-filters-container");
  const resultsBlock = document.querySelector(".js-results-block");
  const resultText = document.querySelector(".js-result-text");
  const submitButton = document.querySelector(".js-submit-button");

  //  масшабирование
  plusBtn.addEventListener("click", () => {
    scale += 0.1;
    seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
  });

  minusBtn.addEventListener("click", () => {
    if (scale > 0.1) {
      scale -= 0.1;
      seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    }
  });

  //  управление картой зала
  let isGrabbing = false;

  function handleMouseMove(evt) {
    if (evt.buttons === 1) {
      if (!isGrabbing) {
        isGrabbing = true;
        seatingChart.classList.add("draggable", "grabbing");
      }

      translateX = parseInt(seatingChart.style.transform.split(",")[4]) + evt.movementX;
      translateY = parseInt(seatingChart.style.transform.split(",")[5]) + evt.movementY;
      seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
    } else {
      if (isGrabbing) {
        isGrabbing = false;
        seatingChart.classList.remove("grabbing");
      }

      seatingChart.classList.remove("draggable");
    }
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseMove);

  //  тултип при наведении
  const generateTooltip = (data) => {
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

  function calculateTooltipPosition(place, tooltipElement) {
    const tooltipHeight = tooltipElement.offsetHeight;
    const { left, top } = place.getBoundingClientRect();
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const placeTopWithScroll = top + scrollPosition;
    const distanceToTop = placeTopWithScroll - tooltipHeight - 10;

    if (distanceToTop < scrollPosition) {
      tooltipElement.classList.add("tooltip--bottom");
      return {
        left: `${left + LEFT_PADDING - PLACE_RADIUS / 2}px`,
        top: `${top + TOP_PADDING - scrollPosition}px`,
      };
    } else {
      tooltipElement.classList.remove("tooltip--bottom");
      return {
        left: `${left + LEFT_PADDING - PLACE_RADIUS / 2}px`,
        top: `${distanceToTop}px`,
      };
    }
  }

  places.forEach((place) => {
    place.addEventListener("mouseover", () => {
      const tooltipElement = generateTooltip(place);
      document.body.appendChild(tooltipElement);
      setTimeout(() => {
        tooltipElement.style.opacity = 1;
      }, 20);

      const position = calculateTooltipPosition(place, tooltipElement);
      tooltipElement.style.left = position.left;
      tooltipElement.style.top = position.top;
    });

    place.addEventListener("mouseout", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        document.body.removeChild(tooltip);
      }
    });
  });

  //  загрузка данных и отрисовка мест

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
    addScrollPadding();
    setFilters(availablePlaces);

    hideLoader();
  };

  showAvailablePlaces();

  //  фильтрация

  const filterPlacesByPrice = (price) => {
    const filteredPlaces = availablePlaces.filter((place) => place.price === price);
    updateSeatsData(filteredPlaces);
  };

  const removeFilterEffect = () => {
    updateSeatsData(availablePlaces);
  };

  const resetFilterButtons = () => {
    const filterButtons = document.querySelectorAll(".js-filter-button");
    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });
  };

  const resetPlacesData = () => {
    places.forEach((placeElement) => {
      placeElement.classList.remove("available");
      placeElement.removeAttribute("data-color");
    });
  };

  const handleFilterButtonClick = (evt) => {
    const currentButton = evt.target.closest(".js-filter-button");
    if (currentButton.classList.contains("active")) {
      currentButton.classList.remove("active");
      removeFilterEffect();
    } else {
      resetFilterButtons();
      currentButton.classList.add("active");
      const { price } = currentButton.dataset;
      filterPlacesByPrice(price);
    }
  };

  document.addEventListener("click", (evt) => {
    if (evt.target.closest(".js-filter-button")) {
      handleFilterButtonClick(evt);
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
    const { sector, place, price } = data;

    const row = Number(place) <= 5 ? "1" : "2";

    const formattedPrice = formatPrice(price);
    const resultCard = document.createElement("div");
    const uniqueID = Date.now();
    resultCard.setAttribute("data-id", uniqueID);
    resultCard.setAttribute("data-sector", sector);
    resultCard.setAttribute("data-place", place);
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

  const showResultPanel = () => {
    resultsBlock.classList.remove("hidden");
  };

  const hideResultPanel = () => {
    resultsBlock.classList.add("hidden");
  };

  const highlightChosenPlace = (element) => {
    element.classList.add("added");
  };
  const unhighlightChosenPlace = (element) => {
    element.classList.remove("added");
  };

  const handlePlaceChoose = (placeElement) => {
    if (placeElement.classList.contains("added")) {
      const { place, sector } = placeElement.dataset;
      const cardElement = resultCardsContainer.querySelector(
        `.js-result-card[data-sector="${sector}"][data-place="${place}"]`,
      );

      handleRemoveCard(cardElement, placeElement);
      return;
    }
    if (chosenPlaces.length < 5) {
      highlightChosenPlace(placeElement);
      const resultCard = generateResultCard(placeElement.dataset);
      resultCardsContainer.appendChild(resultCard);
      updateResultText();
    } else {
      alert("Можно выбрать не более 5 мест");
    }

    chosenPlaces.length ? showResultPanel() : hideResultPanel();
    addScrollPadding();
  };

  places.forEach((place) => {
    place.addEventListener("click", () => {
      handlePlaceChoose(place);
    });
  });

  // удаление выбранного места
  const handleRemoveCard = (resultCard, placeNode) => {
    const { id: placeId, sector, place } = resultCard.dataset;
    chosenPlaces = chosenPlaces.filter((place) => place.id !== Number(placeId));
    resultCard.remove();
    updateResultText();

    if (placeNode) {
      unhighlightChosenPlace(placeNode);
    } else {
      const placeElement = seatingChart.querySelector(
        `.js-place[data-sector="${sector}"][data-place="${place}"]`,
      );
      unhighlightChosenPlace(placeElement);
    }

    if (!chosenPlaces.length) {
      hideResultPanel();
      addScrollPadding();
    }
  };

  resultCardsContainer.addEventListener("click", (evt) => {
    if (evt.target.closest(".js-remove-card")) {
      const resultCard = evt.target.closest(".js-result-card");
      handleRemoveCard(resultCard);
    }
  });

  const updateSoldPlaces = () => {
    chosenPlaces.forEach((placeItem) => {
      const { sector, place, price, color } = placeItem;

      const placeElement = seatingChart.querySelector(
        `.js-place[data-sector="${sector}"][data-place="${place}"]`,
      );
      placeElement.removeAttribute("data-color");
      placeElement.classList.remove("available", "added");
      const cardElement = resultCardsContainer.querySelector(
        `.js-result-card[data-sector="${sector}"][data-place="${place}"]`,
      );

      handleRemoveCard(cardElement, placeElement);
    });
  };

  // отправка формы
  const handleFormSubmit = async () => {
    submitButton.setAttribute("disabled", true);
    showLoader();
    const requestModel = chosenPlaces.map((obj) => {
      return {
        sector: obj.sector,
        place: obj.place,
        price: obj.price,
      };
    });
    const response = await postData(requestModel);
    alert(response);
    updateSoldPlaces();
    chosenPlaces = [];
    hideResultPanel();
    submitButton.removeAttribute("disabled");
    hideLoader();
  };

  submitButton.addEventListener("click", handleFormSubmit);
});
