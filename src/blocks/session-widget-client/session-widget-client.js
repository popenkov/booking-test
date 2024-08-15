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

      this.LEFT_PADDING = 20;
      this.TOP_PADDING = 20;
      this.PLACE_RADIUS = 10;

      this.isGrabbing = false;
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
      this.dancefloorPlace = this.form.querySelector(".js-place-dancefloor");

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

      this.dancefloorPlace.addEventListener("click", () => {
        this.handleDancefloorClick();
      });

      //  масшабирование
      this.plusBtn.addEventListener("click", () => {
        this.scale += 0.1;
        this.seatingChart.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
      });

      this.minusBtn.addEventListener("click", () => {
        if (this.scale > 0.1) {
          this.scale -= 0.1;
          this.seatingChart.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
        }
      });

      this.form.addEventListener("mousemove", (evt) => this.handleMouseMove(evt));
      this.form.addEventListener("mouseup", (evt) => this.handleMouseMove(evt));

      this.resultCardsContainer.addEventListener("click", (evt) => {
        if (evt.target.closest(".js-remove-card")) {
          const resultCard = evt.target.closest(".js-result-card");
          this.handleRemoveCard(resultCard);
        }
      });
      this.submitButton.addEventListener("click", this.handleFormSubmit);

      this.showTooltipOnHover(this.places);
    }

    //  управление картой зала\

    handleMouseMove(evt) {
      if (evt.buttons === 1) {
        if (!this.isGrabbing) {
          this.isGrabbing = true;
          this.seatingChart.classList.add("draggable", "grabbing");
        }
        this.translateX = parseInt(this.seatingChart.style.transform.split(",")[4]) + evt.movementX;
        this.translateY = parseInt(this.seatingChart.style.transform.split(",")[5]) + evt.movementY;
        this.seatingChart.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
      } else {
        if (this.isGrabbing) {
          this.isGrabbing = false;
          this.seatingChart.classList.remove("grabbing");
        }

        this.seatingChart.classList.remove("draggable");
      }
    }

    // utils

    async postData(data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const responseData = JSON.stringify(data);
          resolve(`Данные отправлены: ${responseData}`);
        }, 2000);
      });
    }

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
      nodes.forEach((placeElement) => {
        placeElement.classList.remove("available");
        placeElement.removeAttribute("style");
        placeElement.classList.remove("active");
        placeElement.classList.remove("inactive");
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

      // todo
      if (data.length !== this.availablePlaces) {
        const combinedArray = [...data, ...this.availablePlaces];
        const notSelectedPlaces = this.availablePlaces.filter((item) => {
          const sectorRowPlace = `${item.sector}${item.row}${item.place}`;
          return !data.some(
            (otherItem) =>
              sectorRowPlace === `${otherItem.sector}${otherItem.row}${otherItem.place}`,
          );
        });
        notSelectedPlaces.forEach((placeItem) => {
          const { sector, place, row, price, color } = placeItem;

          const placeElement = this.seatingChart.querySelector(
            `.js-place-wrapper[data-sector="${sector}"][data-place="${place}"][data-row="${row}"]`,
          );

          if (!placeElement) {
            return;
          }
          placeElement.classList.add("inactive");
          placeElement.setAttribute("style", `color: ${color}`);
        });
      }
    }

    async showAvailablePlaces() {
      this.showLoader(this.seatingChart, this.loader);
      this.availablePlaces = await this.fetchData(MOCK_AVAILABLE_PLACES);

      this.updateSeatsData(this.availablePlaces);
      // this.addScrollPadding();
      this.setFilters(this.filterButtonsContainer, this.availablePlaces);

      this.hideLoader(this.seatingChart, this.loader);
    }

    //  фильтрация
    filterPlacesByPrice(color) {
      const filteredPlaces = this.availablePlaces.filter((place) => place.color === color);
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
      textContainer.innerHTML = `${ticketsAmount} ${ticketWord}, ${formattedPrice}`;
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
      resultCard.classList.add(
        "session-widget-client__result-card",
        "result-card",
        "js-result-card",
      );
      // <div class="result-card__text"><span>Сектор ${sector}</span><span>${row} ряд, ${place} место</span></div>
      resultCard.innerHTML = `
          <div class="result-card__container">
            <div class="result-card__text"><span>${row} ряд, ${place} место</span></div>
            <div class="result-card__price">${formattedPrice}</div>
          </div>
          <button class="result-card__close js-remove-card"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M0.841704 0L0 0.841704L4.93629 5.77799L0 10.7143L0.841704 11.556L5.77799 6.6197L10.7143 11.556L11.556 10.7143L6.6197 5.77799L11.556 0.841704L10.7143 0L5.77799 4.93629L0.841704 0Z" fill="currentColor"/>
          </svg></button>
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

      this.highlightChosenPlace(placeElement);
      const resultCard = this.generateResultCard(placeElement.dataset);
      this.resultCardsContainer.appendChild(resultCard);
      this.updateResultText(this.resultText, this.chosenPlaces);

      this.chosenPlaces.length ? this.showResultPanel() : this.hideResultPanel();
      // this.addScrollPadding();
    }

    handleDancefloorClick() {
      if (this.dancefloorPlace.classList.contains("added")) {
        const { place, sector } = this.dancefloorPlace.dataset;
        const cardElement = this.resultCardsContainer.querySelector(
          `.js-result-card[data-sector="${sector}"][data-place="${place}"]`,
        );

        this.handleRemoveCard(cardElement, this.dancefloorPlace);
        return;
      }

      this.highlightChosenPlace(this.dancefloorPlace);
      const resultCard = this.generateResultCard(this.dancefloorPlace.dataset);
      this.resultCardsContainer.appendChild(resultCard);
      this.updateResultText(this.resultText, this.chosenPlaces);

      this.chosenPlaces.length ? this.showResultPanel() : this.hideResultPanel();
      // this.addScrollPadding();
    }

    // tooltip

    generateTooltip(data) {
      const { sector, place, price } = data.dataset;
      const row = Number(place) <= 5 ? "1" : "2";
      const formattedPrice = this.formatPrice(price);
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.innerHTML = `
              <div class="tooltip__price">${formattedPrice}</div>
              <div class="tooltip__place"><span>Сектор  ${sector}</span><span>${row} ряд, ${place} место</span></div>
            `;
      return tooltip;
    }

    calculateTooltipPosition(place, tooltipElement) {
      const tooltipHeight = tooltipElement.offsetHeight;
      const { left, top } = place.getBoundingClientRect();
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const placeTopWithScroll = top + scrollPosition;
      const distanceToTop = placeTopWithScroll - tooltipHeight - 10;

      if (distanceToTop < scrollPosition) {
        tooltipElement.classList.add("tooltip--bottom");
        return {
          left: `${left + this.LEFT_PADDING - this.PLACE_RADIUS / 2}px`,
          top: `${top + this.TOP_PADDING - scrollPosition}px`,
        };
      } else {
        tooltipElement.classList.remove("tooltip--bottom");
        return {
          left: `${left + this.LEFT_PADDING - this.PLACE_RADIUS / 2}px`,
          top: `${distanceToTop}px`,
        };
      }
    }

    showTooltipOnHover(nodes) {
      const closeTooltips = () => {
        const tooltips = document.querySelectorAll(".tooltip");
        tooltips.forEach((tooltip) => {
          if (tooltip && !tooltip.classList.contains("tooltip-hover")) {
            document.body.removeChild(tooltip);
          }
        });
      };

      nodes.forEach((place) => {
        place.addEventListener("mouseover", () => {
          const tooltipElement = this.generateTooltip(place);
          document.body.appendChild(tooltipElement);

          tooltipElement.style.opacity = 1;

          const position = this.calculateTooltipPosition(place, tooltipElement);
          tooltipElement.style.left = position.left;
          tooltipElement.style.top = position.top;

          tooltipElement.addEventListener("mouseover", () => {
            tooltipElement.classList.add("tooltip-hover");
          });

          tooltipElement.addEventListener("mouseout", (evt) => {
            if (!evt.relatedTarget || !place.contains(evt.relatedTarget)) {
              evt.stopPropagation();
              tooltipElement.classList.remove("tooltip-hover");
              closeTooltips();
            }
          });
        });

        place.addEventListener("mouseout", (evt) => {
          evt.stopPropagation();
          closeTooltips();
        });
      });
    }

    // удаление выбранного места
    handleRemoveCard(resultCard, placeNode) {
      const { id: placeId, sector, place } = resultCard.dataset;
      this.chosenPlaces = this.chosenPlaces.filter((place) => place.id !== Number(placeId));
      resultCard.remove();
      this.updateResultText(this.resultText, this.chosenPlaces);

      if (placeNode) {
        this.unhighlightChosenPlace(placeNode);
      } else {
        const placeElement = this.seatingChart.querySelector(
          `.js-place-wrapper[data-sector="${sector}"][data-place="${place}"]`,
        );
        this.unhighlightChosenPlace(placeElement);
      }

      if (!this.chosenPlaces.length) {
        this.hideResultPanel();
        // this.addScrollPadding();
      }
    }

    updateSoldPlaces() {
      this.chosenPlaces.forEach((placeItem) => {
        const { sector, place } = placeItem;

        const placeElement = this.seatingChart.querySelector(
          `.js-place-wrapper[data-sector="${sector}"][data-place="${place}"]`,
        );
        placeElement.removeAttribute("data-color");
        placeElement.removeAttribute("data-price");
        placeElement.classList.remove("available", "added");
        const cardElement = this.resultCardsContainer.querySelector(
          `.js-result-card[data-sector="${sector}"][data-place="${place}"]`,
        );

        this.handleRemoveCard(cardElement, placeElement);
      });
    }

    // отправка формы
    async handleFormSubmit() {
      this.submitButton.setAttribute("disabled", true);
      this.availablePlaces = this.removeArrDuplicates(this.availablePlaces, this.chosenPlaces);
      this.showLoader(this.seatingChart, this.loader);
      const requestModel = this.chosenPlaces.map((obj) => {
        return {
          sector: obj.sector,
          place: obj.place,
          price: obj.price,
        };
      });
      const response = await this.postData(requestModel);
      alert(response);
      this.setFilters(this.filterButtonsContainer, this.availablePlaces);
      this.updateSoldPlaces();
      this.chosenPlaces = [];
      this.hideResultPanel();
      this.submitButton.removeAttribute("disabled");
      this.hideLoader(this.seatingChart, this.loader);
    }
  }

  new ClientScheme(clientWidget);
});
