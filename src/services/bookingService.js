import API from "./api";

export const createBooking = (bookingRequest) => {
  return API.post("/bookings/create", bookingRequest);
};

export const getBookingById = (id) => {
  return API.get(`/bookings/${id}`);
};

export const getBookingByNumber = (bookingNumber) => {
  return API.get(`/bookings/number/${bookingNumber}`);
};

//export const getBookingsByUserId = (userId) => {
 // return API.get(`/bookings/user/${userId}`);
//};

export const getMyBookings = () => {
  return API.get("/bookings/my");
};

export const cancelBooking = (id) => {
  return API.put(`/bookings/cancel/${id}`);
};