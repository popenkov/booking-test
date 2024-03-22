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
