import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const createRoast = async (roastData) => {
  const response = await API.post("/api/roast", roastData);
  return response.data;
};

export const getRoastHistory = async () => {
  const response = await API.get("/api/roast/history");
  return response.data;
};

export const getFavoriteRoasts = async () => {
  const response = await API.get("/api/roast/favorites");
  return response.data;
};

export const updateRoastFavorite = async (roastId, isFavorite) => {
  const response = await API.patch(`/api/roast/${roastId}/favorite`, {
    isFavorite,
  });
  return response.data;
};
