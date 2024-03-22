import { LEFT_PADDING, PLACE_RADIUS } from "./constants";

export const calculateTooltipPosition = (place, tooltipElement) => {
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
};
