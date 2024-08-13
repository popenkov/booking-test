class HallScheme {
  constructor(form) {
    this.form = form;

    if (!this.form) {
      return;
    }
    this.init();
  }

  init() {
    alert(123);
    console.info("HallScheme | init");
    this.hallSchemeContainer = this.form.querySelector(".js-seats-container");
    this.schemeNavigator = this.form.querySelector(".js-scheme-navigator");
    this.schemeNavigatorMarker = this.form.querySelector(".js-scheme-navigator-marker");

    // выбор мест
    this.availablePlaces = [];
    this.selectedSeats = [];

    // навигация по схеме
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.navigatorTranslateX = 0;
    this.navigatorTranslateY = 0;
    this.schemeScaleFactorX = null;
    this.schemeScaleFactorY = null;
    this.isNavigationInitialized = false;

    this.selectedPlacesNode = this.form.querySelector(".js-selected-places-amount");
    //.js-place  to  js-place-wrapper
    const seats = this.hallSchemeContainer.querySelectorAll(".js-place-wrapper");
    if (seats.length) {
      this.initPlaceSelection();
      // tooltips
      this.showTooltipOnHover(seats);
    }
    this.initSchemeZoom();

    // todo
    // this.hallSchemeContainer.addEventListener('mousemove', (evt) => {
    //   evt.preventDefault();
    // });
  }

  formatPrice(price) {
    const formattedPrice = Number(price).toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    });
    return formattedPrice;
  }

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

  showTooltipOnHover(nodes) {
    nodes.forEach((place) => {
      console.log(place);
      place.addEventListener("mouseover", () => {
        console.log("mouseover");
        const tooltipElement = this.generateTooltip(place);
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
  }

  async showAvailablePlaces() {
    // showLoader(hallSchemeContainer, loader);
    this.availablePlaces = MOCK_AVAILABLE_PLACES;

    // updateSeatsData(availablePlaces);
    // addScrollPadding();
    // setFilters(filterButtonsContainer, availablePlaces);

    // hideLoader(hallSchemeContainer, loader);
  }

  initSchemeZoom() {
    const plusBtn = this.form.querySelector(".js-plus-button");
    const minusBtn = this.form.querySelector(".js-minus-button");

    plusBtn.addEventListener("click", () => {
      if (!this.isNavigationInitialized) {
        this.navigatorRect = this.schemeNavigator.getBoundingClientRect();
        this.markerRect = this.schemeNavigatorMarker.getBoundingClientRect();
        this.schemeRect = this.hallSchemeContainer.getBoundingClientRect();

        this.initSchemeNavigator();
        this.isNavigationInitialized = true;
      }
      this.scale += 0.1;
      this.hallSchemeContainer.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
      this.updateNavigatorMarkerSize();
    });

    minusBtn.addEventListener("click", () => {
      if (!this.isNavigationInitialized) {
        this.navigatorRect = this.schemeNavigator.getBoundingClientRect();
        this.markerRect = this.schemeNavigatorMarker.getBoundingClientRect();
        this.schemeRect = this.hallSchemeContainer.getBoundingClientRect();
        this.initSchemeNavigator();
        this.isNavigationInitialized = true;
      }

      console.log("this.scale", this.scale);
      if (this.scale > 0.1 && this.scale <= 1) {
        this.scale -= 0.1;
        this.hallSchemeContainer.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${this.translateX}, ${this.translateY})`;
        this.updateNavigatorMarkerSize();
      }
    });
  }

  updateSchemePosition(translateX, translateY) {
    this.hallSchemeContainer.style.transform = `matrix(${this.scale}, 0, 0, ${this.scale}, ${translateX || this.translateX}, ${translateY || this.translateY})`;
  }

  // todo
  updateNavigatorMarkerSize() {
    const scaleValue = 1 - Math.abs(1 - this.scale);
    this.schemeNavigatorMarker.style.transform = `matrix(${scaleValue}, 0, 0, ${scaleValue}, ${this.translateX}, ${this.translateY})`;
  }

  initSchemeNavigator() {
    let startX, startY;

    this.schemeNavigatorMarker.addEventListener("mousedown", (evt) => {
      startX = evt.clientX;
      startY = evt.clientY;
      this.schemeNavigatorMarker.addEventListener("mousemove", onMouseMove);
    });

    this.schemeNavigatorMarker.addEventListener("mouseup", () => {
      this.schemeNavigatorMarker.removeEventListener("mousemove", onMouseMove);
    });

    let updateTimer = null;

    const onMouseMove = (evt) => {
      evt.preventDefault();
      const deltaX = evt.clientX - startX;
      const deltaY = evt.clientY - startY;

      if (updateTimer) {
        clearTimeout(updateTimer);
      }

      updateTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          this.translateX = Math.max(
            0,
            Math.min(deltaX, this.navigatorRect.width - this.markerRect.width),
          );
          this.translateY = Math.max(
            0,
            Math.min(deltaY, this.navigatorRect.height - this.markerRect.height),
          );

          // Calculate the scaling factor based on the size of the scheme block
          if (this.schemeScaleFactorX === null || this.navigatorTranslateY === null) {
            this.schemeScaleFactorX =
              (this.schemeRect.width / this.navigatorRect.width) * this.scale;
            this.schemeScaleFactorY =
              (this.schemeRect.height / this.navigatorRect.height) * this.scale;
          }

          // Apply the scaling factor to the translation values
          const schemeTranslateX = this.translateX * this.schemeScaleFactorX;
          const schemeTranslateY = this.translateY * this.schemeScaleFactorY;

          this.updateNavigatorMarkerSize();
          this.updateSchemePosition(schemeTranslateX, schemeTranslateY);
        });
      }, 16); // 16ms = ~60fps
    };
  }

  updateSelectedPlacesAmount() {
    this.selectedPlacesNode.textContent = this.selectedSeats.length;
  }

  // выбор места
  initPlaceSelection() {
    let isPressed = false;
    this.startElement = null;

    this.hallSchemeContainer.addEventListener("mousedown", (evt) => {
      this.resetSelectedPlaces();
      if (evt.target.closest(".js-place-wrapper")) {
        isPressed = true;
        const placeWrapper = evt.target.closest(".js-place-wrapper");
        const placeSvg = placeWrapper.querySelector(".js-place");

        this.startElement = placeWrapper;
        placeSvg.classList.add("selected");
        placeWrapper.classList.add("selected");
        this.selectedSeats.push(placeWrapper);
      }
    });

    this.hallSchemeContainer.addEventListener("mousemove", (evt) => {
      // если зажата левая клавиша
      if (evt.buttons === 1 && isPressed && evt.target.closest(".js-place-wrapper")) {
        const placeWrapper = evt.target.closest(".js-place-wrapper");
        const placeSvg = placeWrapper.querySelector(".js-place");
        if (!placeSvg.classList.contains("selected")) {
          placeSvg.classList.add("selected");
          placeWrapper.classList.add("selected");
          // todo все ломает
        }
      }
    });

    this.hallSchemeContainer.addEventListener("mouseup", () => {
      if (this.startElement && this.selectedSeats.length > 0) {
        isPressed = false;
        // create a range and add it to the this.selectedSeats
        let range = new Range();
        range.setStart(this.startElement.parentNode, 0);
        range.setEnd(this.selectedSeats[this.selectedSeats.length - 1].parentNode, 0);
        // console.log('range', range, this.selectedSeats);
        document.getSelection().addRange(range);
        this.updateSelectedPlacesAmount();
      }
    });
  }

  resetSelectedPlaces() {
    const allSelectedPlaceWrappers = this.form.querySelectorAll(".js-place-wrapper.selected");
    const allSelectedPlaces = this.form.querySelectorAll(".js-place.selected");

    allSelectedPlaceWrappers.forEach((element) => element.classList.remove("selected"));
    allSelectedPlaces.forEach((element) => element.classList.remove("selected"));
    this.selectedSeats = [];
    this.startElement = null;
  }
}
