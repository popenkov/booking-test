import ready from "../../js/utils/documentReady.js";

ready(function () {
  const seatsCounter = document.querySelector(".js-seats-counter");

  if (!seatsCounter) {
    return;
  }

  // const incrementButton = seatsCounter.querySelector(".js-seats-counter-increment");
  // const decrementButton = seatsCounter.querySelector(".js-seats-counter-decrement");
  // const counterInput = seatsCounter.querySelector(".js-seats-counter-input");
  // let currentValue = 1;

  // console.log("incrementButton", incrementButton);

  // incrementButton.addEventListener("click", () => {
  //   handleItemIncrease();
  // });
  // decrementButton.addEventListener("click", () => {
  //   handleItemDecrease();
  // });

  // const updateDancefloorTickets = (value) => {
  //   // обновить текст кнопки
  //   // this.updateResultText(this.resultText, this.chosenPlaces);
  // };

  // const removeCounter = () => {};

  // const removeDancefloorTickets = () => {};

  // const handleItemIncrease = () => {
  //   currentValue += 1;
  //   counterInput.value = currentValue;
  //   updateDancefloorTickets(currentValue);
  // };

  // const handleItemDecrease = () => {
  //   if (currentValue > 1) {
  //     currentValue -= 1;
  //     counterInput.value = currentValue;
  //     updateDancefloorTickets(currentValue);
  //   } else {
  //     removeCounter();
  //     removeDancefloorTickets();
  //   }
  // };
});
