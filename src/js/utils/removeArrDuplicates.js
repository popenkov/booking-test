export const removeArrDuplicates = (arr1, arr2) => {
  const idsToExclude = new Set(arr2.map((item) => `${item.sector}-${item.place}`));

  const result = arr1.filter((item) => {
    const { sector, place } = item;
    return !idsToExclude.has(`${sector}-${place}`);
  });

  return result;
};
