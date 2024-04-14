/* eslint-disable no-useless-catch */
import { useEffect, useState } from "react";

const token = localStorage.getItem("token");

const useGetProducts = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/product", {
        headers: {
          method: "get",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData.data);
      setLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refreshData = () => {
    fetchData();
  };
  return { data, loading, error, refreshData };
};

const createProduct = async (body, userId, method, url) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    name: body.name,
    unit: body.unit,
    price: body.price,
    amount: body.amount,
    user_id: userId,
    category_id: body.category_id,
  });

  const requestOptions = {
    method: method,
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

const createStockProduct = async (body) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    id: body.id,
    amount: body.amount,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://localhost:5000/api/product/addStock",
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
export { useGetProducts, createProduct, createStockProduct };
