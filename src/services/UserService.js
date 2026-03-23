import API from "./api";

export const createUser = (user) => {
  return API.post("/users", user);
};

export const getUserById = (id) => {
  return API.get(`/users/${id}`);
};

export const getAllUsers = () => {
  return API.get("/users");
};