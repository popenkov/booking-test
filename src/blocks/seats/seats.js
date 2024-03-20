import ready from "../../js/utils/documentReady.js";

ready(function () {
  const plusBtn = document.querySelector(".js-plus-button");
  const minusBtn = document.querySelector(".js-minus-button");
  const seatingChart = document.querySelector(".js-seats-container");

  let scale = 1;

  plusBtn.addEventListener("click", () => {
    console.log("scale", scale);
    scale += 0.1;
    seatingChart.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;
  });

  minusBtn.addEventListener("click", () => {
    if (scale > 0.1) {
      console.log("scale", scale);
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
  // document.addEventListener("mouseup", handleMouseUp);

  document.addEventListener("click", (evt) => {
    if (evt.target.closest(".place")) {
      console.log("place", evt.target.closest(".place"));
    }
  });
});
