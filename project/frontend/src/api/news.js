import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/",
});

export const fetchNews = async (query) => {
  const response = await API.get(`news/?query=${query}`);
  return response.data;
};