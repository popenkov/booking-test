import ready from "../../js/utils/documentReady.js";

ready(function () {
  const clientWidget = document.querySelector(".session-widget-client");

  if (!clientWidget) {
    return;
  }

  const MOCK_AVAILABLE_PLACES = [
    {
      sector: "1",
      row: 4,
      place: "1",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "2",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "3",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "4",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "5",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "6",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "7",
      price: "5000",
      color: "#74DCF3",
    },
    {
      sector: "1",
      row: 4,
      place: "8",
      price: "5000",
      color: "#74DCF3",
    },
    // new row
    {
      sector: "1",
      row: 3,
      place: "1",
      price: "5000",
      color: "#86BC25",
    },
    {
      sector: "3",
      row: 3,
      place: "2",
      price: "5000",
      color: "#86BC25",
    },
    {
      sector: "1",
      row: 3,
      place: "3",
      price: "5000",
      color: "#86BC25",
    },
    {
      sector: "1",
      row: 3,
      place: "4",
      price: "5000",
      color: "#86BC25",
    },
    {
      sector: "1",
      row: 3,
      place: "5",
      price: "5000",
      color: "#86BC25",
    },
    // new row
    {
      sector: "1",
      row: 2,
      place: "1",
      price: "5000",
      color: "#FA987D",
    },

    {
      sector: "1",
      row: 2,
      place: "4",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 2,
      place: "5",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 2,
      place: "6",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 2,
      place: "7",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 2,
      place: "8",
      price: "5000",
      color: "#FA987D",
    },
    // new row
    {
      sector: "1",
      row: 1,
      place: "1",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "2",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "3",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "4",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "5",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "6",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "7",
      price: "5000",
      color: "#FA987D",
    },
    {
      sector: "1",
      row: 1,
      place: "8",
      price: "5000",
      color: "#FA987D",
    },
  ];

  class ClientScheme {
    constructor(form) {
      this.form = form;

      console.log("this.form ", this.form);

      if (!this.form) {
        return;
      }
      this.init();
    }

    init() {
      console.info("Client event widget | init");
      (this.scale = 1), (this.translateX = 0), (this.translateY = 0);

      this.availablePlaces = [];
      this.chosenPlaces = [];

      this.plusBtn = this.form.querySelector(".js-plus-button");
      this.minusBtn = this.form.querySelector(".js-minus-button");
      this.seatingChart = this.form.querySelector(".js-seats-container");
      this.places = this.form.querySelectorAll(".js-place-wrapper");
      this.loader = this.form.querySelector(".js-loader");
      this.resultCardsContainer = this.form.querySelector(".js-result-cards");
      this.filterButtonsContainer = this.form.querySelector(".js-filters-container");
      this.resultsBlock = this.form.querySelector(".js-results-block");
      this.resultText = this.form.querySelector(".js-result-text");
      this.submitButton = this.form.querySelector(".js-submit-button");

      this.showAvailablePlaces();

      this.form.addEventListener("click", (evt) => {
        if (evt.target.closest(".js-filter-button")) {
          this.handleFilterButtonClick(evt);
        }
      });

      this.places.forEach((place) => {
        place.addEventListener("click", () => {
          this.handlePlaceChoose(place);
        });
      });
    }

    // utils
    async fetchData(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 0);
        // }, 2000);
      });
    }

    getScrollSize() {
      const outer = document.createElement("div");
      const inner = document.createElement("div");
      outer.style.overflow = "scroll";
      outer.classList.add("scrollbar");
      outer.appendChild(inner);
      document.body.appendChild(outer);
      const scrollbarSize = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);
      return scrollbarSize;
    }

    addScrollPadding() {
      const hasScroll = document.body.scrollHeight === document.body.offsetHeight;
      document.body.style.marginRight = hasScroll ? `${this.getScrollSize()}px` : "0";
    }

    formatPrice(price) {
      const formattedPrice = Number(price).toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
      });
      return formattedPrice;
    }

    declOfNum(amount, textForms) {
      const ten = 10;
      const twenty = 20;
      const hundred = 100;

      const firstIndex = 0;
      const secondIndex = 1;
      const thirdIndex = 2;

      amount = Math.abs(amount) % hundred;

      const numberDividedByTen = amount % ten;
      const isBetweenEenDndTwenty = amount > ten && amount < twenty;
      const isBetweenOneAndFive = numberDividedByTen > 1 && numberDividedByTen < 5;

      if (isBetweenEenDndTwenty) return textForms[thirdIndex];
      if (isBetweenOneAndFive) return textForms[secondIndex];
      if (numberDividedByTen == 1) return textForms[firstIndex];

      return textForms[thirdIndex];
    }

    // loader
    showLoader(container, loader) {
      container.classList.add("loading");
      loader.classList.remove("hidden");
    }

    hideLoader(container, loader) {
      container.classList.remove("loading");
      loader.classList.add("hidden");
    }

    // filter

    generateFilterButton(data) {
      const { color, price } = data;
      const formattedPrice = this.formatPrice(price);
      const filterButton = document.createElement("button");
      filterButton.classList.add("filter-button", "seats__filters-button", "js-filter-button");
      filterButton.setAttribute("data-color", color);
      filterButton.innerHTML = `<span class="filter-button__color" style="background-color: ${color}"></span><span class="filter-button__text">${formattedPrice}</span>`;
      return filterButton;
    }

    setFilters(buttonsContainer, data) {
      buttonsContainer.innerHTML = "";
      const uniqueColors = [...new Set(data.map((place) => place.color))];

      for (const color of uniqueColors) {
        const filteredPlace = data.find((place) => place.color === color);
        const price = filteredPlace.price;

        const button = this.generateFilterButton({ color, price });

        buttonsContainer.appendChild(button);
      }
    }

    // отрисовка мест

    resetPlacesData(nodes) {
      console.log(nodes);
      nodes.forEach((placeElement) => {
        placeElement.classList.remove("available");
        placeElement.removeAttribute("style");
        placeElement.classList.remove("active");
      });
    }
    updateSeatsData(data) {
      this.resetPlacesData(this.places);
      data.forEach((placeItem) => {
        const { sector, place, row, price, color } = placeItem;

        const placeElement = this.seatingChart.querySelector(
          `.js-place-wrapper[data-sector="${sector}"][data-place="${place}"][data-row="${row}"]`,
        );

        if (!placeElement) {
          return;
        }
        placeElement.classList.add("available");
        placeElement.setAttribute("data-price", price);
        placeElement.setAttribute("style", `color: ${color}`);
        placeElement.classList.add("active");
      });
    }

    async showAvailablePlaces() {
      this.showLoader(this.seatingChart, this.loader);
      this.availablePlaces = await this.fetchData(MOCK_AVAILABLE_PLACES);

      this.updateSeatsData(this.availablePlaces);
      this.addScrollPadding();
      this.setFilters(this.filterButtonsContainer, this.availablePlaces);

      this.hideLoader(this.seatingChart, this.loader);
    }

    //  фильтрация
    filterPlacesByPrice(color) {
      const filteredPlaces = this.availablePlaces.filter((place) => place.color === color);
      console.log("filteredPlaces", filteredPlaces);
      this.updateSeatsData(filteredPlaces);
    }

    removeFilterEffect() {
      this.updateSeatsData(this.availablePlaces);
    }

    resetFilterButtons() {
      this.filterButtons = document.querySelectorAll(".js-filter-button");
      this.filterButtons.forEach((button) => {
        button.classList.remove("active");
      });
    }

    handleFilterButtonClick(evt) {
      const currentButton = evt.target.closest(".js-filter-button");
      if (currentButton.classList.contains("active")) {
        currentButton.classList.remove("active");
        this.removeFilterEffect();
      } else {
        this.resetFilterButtons();
        currentButton.classList.add("active");
        const { color } = currentButton.dataset;
        this.filterPlacesByPrice(color);
      }
    }

    // выбор места

    updateResultText(textContainer, data) {
      const ticketsAmount = data.length;
      const totalPrice = data.reduce((acc, item) => {
        return acc + Number(item.price);
      }, 0);
      const ticketWord = this.declOfNum(ticketsAmount, ["билет", "билета", "билетов"]);
      const formattedPrice = this.formatPrice(totalPrice);
      textContainer.innerHTML = `Вы выбрали ${ticketsAmount} ${ticketWord}: ${formattedPrice}`;
    }

    generateResultCard(data) {
      const { sector, place, price } = data;

      const row = Number(place) <= 5 ? "1" : "2";

      const formattedPrice = this.formatPrice(price);
      const resultCard = document.createElement("div");
      const uniqueID = Date.now();
      resultCard.setAttribute("data-id", uniqueID);
      resultCard.setAttribute("data-sector", sector);
      resultCard.setAttribute("data-place", place);
      this.chosenPlaces.push({ ...data, id: uniqueID });
      resultCard.classList.add("seats__result-card", "result-card", "js-result-card");
      resultCard.innerHTML = `
          <button class="result-card__close js-remove-card">x</button>
            <div class="result-card__price">${formattedPrice}</div>
            <div class="result-card__text"><span>Сектор ${sector}</span><span>${row} ряд, ${place} место</span>
          </div>
            `;
      return resultCard;
    }

    showResultPanel() {
      this.resultsBlock.classList.remove("hidden");
    }

    hideResultPanel() {
      this.resultsBlock.classList.add("hidden");
    }

    highlightChosenPlace(element) {
      element.classList.add("added");
    }
    unhighlightChosenPlace(element) {
      element.classList.remove("added");
    }

    handlePlaceChoose(placeElement) {
      if (placeElement.classList.contains("added")) {
        const { place, sector } = placeElement.dataset;
        const cardElement = this.resultCardsContainer.querySelector(
          `.js-result-card[data-sector="${sector}"][data-place="${place}"]`,
        );

        this.handleRemoveCard(cardElement, placeElement);
        return;
      }
      if (this.chosenPlaces.length < 5) {
        this.highlightChosenPlace(placeElement);
        const resultCard = this.generateResultCard(placeElement.dataset);
        this.resultCardsContainer.appendChild(resultCard);
        this.updateResultText(this.resultText, this.chosenPlaces);
      } else {
        alert("Можно выбрать не более 5 мест");

        //  todo availablePlaces;
      }

      this.chosenPlaces.length ? this.showResultPanel() : this.hideResultPanel();
      this.addScrollPadding();
    }
  }

  new ClientScheme(clientWidget);
});
