import API from "./api";

export const getAllMovies = () => {
  return API.get("/movies");
};

export const getMovieById = (id) => {
  return API.get(`/movies/${id}`);
};

export const searchMovies = (title) => {
  return API.get(`/movies/search?title=${title}`);
};

export const getMoviesByLanguage = (language) => {
  return API.get(`/movies/language/${language}`);
};

export const getMoviesByGenre = (genre) => {
  return API.get(`/movies/genre/${genre}`);
};