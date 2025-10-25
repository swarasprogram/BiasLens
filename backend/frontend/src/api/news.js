import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Django backend
});

export const fetchNews = async (query) => {
  const response = await API.get(`news/?query=${query}`);
  return response.data;
};
