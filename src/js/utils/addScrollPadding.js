import getScrollSize from "./getScrollSize";

export function addScrollPadding() {
  const hasScroll = document.body.scrollHeight === document.body.offsetHeight;
  document.body.style.marginRight = hasScroll ? `${getScrollSize()}px` : "0";
}
