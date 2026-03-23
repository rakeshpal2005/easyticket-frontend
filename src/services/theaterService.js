import API from "./api";

export const getAllTheaters = () => {
  return API.get("/theaters");
};

export const getTheaterById = (id) => {
  return API.get(`/theaters/${id}`);
};

export const getTheatersByCity = (city) => {
  return API.get(`/theaters/city?city=${city}`);
};