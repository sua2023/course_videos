import { useEffect, useState } from "react";

const createCategory = async (name, method, url) => {
  const token = localStorage.getItem("token");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    name: name,
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

const useGetCategory = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetcCatoryhData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/category", {
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
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetcCatoryhData();
  }, []);
  const refreshData = () => {
    fetcCatoryhData();
  };
  return { data, loading, error, refreshData };
};
export { createCategory, useGetCategory };
