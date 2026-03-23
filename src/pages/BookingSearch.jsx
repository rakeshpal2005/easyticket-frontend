import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookingByNumber } from "../services/bookingService";

const BookingSearch = () => {
  const [bookingNumber, setBookingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!bookingNumber.trim()) {
      alert("Enter booking number");
      return;
    }

    setLoading(true);

    getBookingByNumber(bookingNumber)
      .then((res) => {
        navigate("/ticket", { state: { booking: res.data } });
      })
      .catch((err) => {
        console.error("Booking search error:", err);
        alert("Booking not found");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-800">
          <h1 className="text-3xl font-bold mb-4">Search Ticket</h1>
          <p className="text-slate-300 mb-6">
            Enter booking number to find your ticket.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Booking Number"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg font-semibold disabled:bg-slate-700"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;