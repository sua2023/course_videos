/* eslint-disable no-useless-catch */
const token = localStorage.getItem("token");

const createOrder = async (body, userId) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    body: body,
    userId: userId,
  });
  const requestOptions = {
    method: "post",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "http://localhost:5000/api/order",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

export { createOrder };
