import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getShowById } from "../services/showService";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    getShowById(showId)
      .then((res) => {
        setShow(res.data);
      })
      .catch((err) => {
        console.error("Error fetching show:", err);
      });
  }, [showId]);

  if (!show) return <p>Loading seats...</p>;

  const seats = show.availableSeats || [];

  const toggleSeat = (seatId, status) => {
    if (status !== "AVAILABLE") return;

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const totalAmount = selectedSeatIds.reduce((sum, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    return sum + (seat ? seat.price : 0);
  }, 0);

  const handleContinue = () => {
    const bookingRequest = {
      userId: 1,
      showId: parseInt(showId),
      seatIds: selectedSeatIds,
      paymentMethod: paymentMethod,
    };

    navigate("/booking-summary", {
      state: { bookingRequest, totalAmount, show },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          Select Seats
        </h1>

        <p className="mb-2">
          Movie: <b>{show.movie.title}</b>
        </p>
        <p className="mb-6">
          Theater: <b>{show.screen.theater.name}</b> | Screen: <b>{show.screen.name}</b>
        </p>

        <div className="grid grid-cols-8 gap-3 mb-8">
          {seats.map((seatObj) => {
            const isSelected = selectedSeatIds.includes(seatObj.id);
            const isBooked = seatObj.status !== "AVAILABLE";

            return (
              <button
                key={seatObj.id}
                onClick={() => toggleSeat(seatObj.id, seatObj.status)}
                className={`p-3 rounded text-sm font-semibold
                  ${isBooked
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-red-500 text-white"
                    : seatObj.seat.seatType === "PREMIUM"
                    ? "bg-yellow-300"
                    : "bg-gray-200"
                  }`}
              >
                {seatObj.seat.seatNumber}
              </button>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

          <p>Selected Seat IDs: {selectedSeatIds.join(", ") || "None"}</p>
          <p className="mt-2 font-semibold">Total Amount: ₹{totalAmount}</p>

          <div className="mt-4">
            <label className="block mb-1 font-semibold">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="NETBANKING">NETBANKING</option>
            </select>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedSeatIds.length === 0}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;