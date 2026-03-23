import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingSummary from "./pages/BookingSummary";
import Ticket from "./pages/Ticket";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingSearch from "./pages/BookingSearch";
import ShowsByDate from "./pages/ShowsByDate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/shows/:showId/seats" element={<SeatSelection />} />
      <Route path="/booking-summary" element={<BookingSummary />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking-search" element={<BookingSearch />} />
      <Route path="/shows/date-range" element={<ShowsByDate />} />
    </Routes>
  );
}

export default App;