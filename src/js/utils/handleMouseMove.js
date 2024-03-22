let isGrabbing = false;

export const handleMouseMove = (evt, container, translateX, translateY, scale) => {
  if (evt.buttons === 1) {
    if (!isGrabbing) {
      isGrabbing = true;
      container.classList.add("draggable", "grabbing");
    }

    translateX = parseInt(container.style.transform.split(",")[4]) + evt.movementX;
    translateY = parseInt(container.style.transform.split(",")[5]) + evt.movementY;
    container.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
  } else {
    if (isGrabbing) {
      isGrabbing = false;
      container.classList.remove("grabbing");
    }

    container.classList.remove("draggable");
  }
};
