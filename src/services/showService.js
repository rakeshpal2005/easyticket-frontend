import API from "./api";

export const getShowById = (id) => {
  return API.get(`/shows/${id}`);
};

export const getShowsByMovie = (movieId) => {
  return API.get(`/shows/movie/${movieId}`);
};

export const getShowsByMovieAndCity = (movieId, city) => {
  return API.get(`/shows/movie/${movieId}/city/${city}`);
};

export const getShowsByDateRange = (startDate, endDate) => {
  return API.get(`/shows/date-range?startDate=${startDate}&endDate=${endDate}`);
};