export const AVAILABLE_PLACES = [
  {
    sector: "1",
    place: "2",
    price: "5000",
    color: "green",
  },
  {
    sector: "1",
    place: "3",
    price: "5000",
    color: "green",
  },
  {
    sector: "1",
    place: "4",
    price: "5000",
    color: "green",
  },
  {
    sector: "1",
    place: "8",
    price: "2000",
    color: "blue",
  },
  {
    sector: "1",
    place: "9",
    price: "2000",
    color: "blue",
  },
  {
    sector: "2",
    place: "4",
    price: "5000",
    color: "green",
  },
];

export const fetchData = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

export const postData = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responseData = JSON.stringify(data);
      resolve(`Данные отправлены: ${responseData}`);
    }, 2000);
  });
};
