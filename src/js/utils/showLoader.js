export const showLoader = (container, loader) => {
  container.classList.add("loading");
  loader.classList.remove("hidden");
};

export const hideLoader = (container, loader) => {
  container.classList.remove("loading");
  loader.classList.add("hidden");
};
