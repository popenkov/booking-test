import ready from "./utils/documentReady.js";
import { formatPrice } from "./utils/formatPrice.js";
import { resetPlacesData } from "./utils/resetPlacesData.js";
import { setFilters } from "./utils/setFilters.js";
import { hideLoader, showLoader } from "./utils/showLoader.js";
import { showTooltipOnHover } from "./utils/showTooltipOnHover.js";
import { updateResultText } from "./utils/updateResultText.js";
import { addScrollPadding } from "./utils/addScrollPadding.js";
import { AVAILABLE_PLACES } from "./utils/mockData.js";
import { fetchData, postData } from "./utils/mockRequests.js";
import { removeArrDuplicates } from "./utils/removeArrDuplicates.js";

ready(function () {
  const seatsPage = document.querySelector(".js-seats-page");

  if (!seatsPage) {
    return;
  }

  let scale = 1,
    translateX = 0,
    translateY = 0;

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

  //  управление картой зала\

  let isGrabbing = false;
  const handleMouseMove = (evt) => {
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
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseMove);

  //  тултип при наведении
  showTooltipOnHover(places);

  //  загрузка данных и отрисовка мест

  const updateSeatsData = (data) => {
    resetPlacesData(places);
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
    showLoader(seatingChart, loader);
    availablePlaces = await fetchData(AVAILABLE_PLACES);

    updateSeatsData(availablePlaces);
    addScrollPadding();
    setFilters(filterButtonsContainer, availablePlaces);

    hideLoader(seatingChart, loader);
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
      updateResultText(resultText, chosenPlaces);
    } else {
      alert("Можно выбрать не более 5 мест");
      availablePlaces;
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
    updateResultText(resultText, chosenPlaces);

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
      const { sector, place } = placeItem;

      const placeElement = seatingChart.querySelector(
        `.js-place[data-sector="${sector}"][data-place="${place}"]`,
      );
      placeElement.removeAttribute("data-color");
      placeElement.removeAttribute("data-price");
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
    availablePlaces = removeArrDuplicates(availablePlaces, chosenPlaces);
    showLoader(seatingChart, loader);
    const requestModel = chosenPlaces.map((obj) => {
      return {
        sector: obj.sector,
        place: obj.place,
        price: obj.price,
      };
    });
    const response = await postData(requestModel);
    alert(response);
    setFilters(filterButtonsContainer, availablePlaces);
    updateSoldPlaces();
    chosenPlaces = [];
    hideResultPanel();
    submitButton.removeAttribute("disabled");
    hideLoader(seatingChart, loader);
  };

  submitButton.addEventListener("click", handleFormSubmit);
});
