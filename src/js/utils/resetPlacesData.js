export const resetPlacesData = (nodes) => {
  nodes.forEach((placeElement) => {
    placeElement.classList.remove("available");
    placeElement.removeAttribute("data-color");
  });
};
