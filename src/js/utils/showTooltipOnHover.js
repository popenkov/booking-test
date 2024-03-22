import { calculateTooltipPosition } from "./calculateTooltipPosition";
import { generateTooltip } from "./generateTooltip";

export const showTooltipOnHover = (nodes) => {
  nodes.forEach((place) => {
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
};
