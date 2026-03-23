import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { createBooking } from "../services/bookingService";

const BookingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { bookingRequest, totalAmount, show } = state || {};
  const [loading, setLoading] = useState(false);

  const selectedSeatNumbers = useMemo(() => {
    if (!bookingRequest?.seatIds || !show?.availableSeats) return [];
    return show.availableSeats
      .filter((seatObj) => bookingRequest.seatIds.includes(seatObj.id))
      .map((seatObj) => seatObj?.seat?.seatNumber)
      .filter(Boolean);
  }, [bookingRequest, show]);

  if (!bookingRequest) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-5 py-8">
          <p className="text-slate-400">No booking data found.</p>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    setLoading(true);
    createBooking(bookingRequest)
      .then((res) => {
        localStorage.setItem("latestBooking", JSON.stringify(res.data));
        navigate("/ticket", { state: { booking: res.data } });
      })
      .catch((err) => {
        console.error("Booking failed:", err);
        alert(err.response?.data?.message || "Booking failed");
      })
      .finally(() => setLoading(false));
  };

  const seatDisplay =
    selectedSeatNumbers.length > 0
      ? selectedSeatNumbers
      : bookingRequest.seatIds;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Page heading */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-1">Almost there!</p>
          <h1 className="text-2xl font-bold text-white">Review Your Booking</h1>
        </div>

        {/* TICKET CARD */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >

          {/* ── Red header strip ── */}
          <div style={{ background: "#ef4444", padding: "18px 22px" }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "#fecaca", fontSize: "12px", marginBottom: "2px" }}>
                  NOW BOOKING
                </p>
                <h2 style={{ color: "white", fontSize: "20px", fontWeight: "700" }}>
                  {show?.movie?.title || "Movie"}
                </h2>
              </div>
              {/* ET logo badge */}
              <div
                style={{
                  width: "42px", height: "42px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "900", fontSize: "14px", color: "white",
                }}
              >
                ET
              </div>
            </div>
          </div>

          {/* ── Ticket body ── */}
          <div style={{ padding: "20px 22px" }}>

            {/* Show Details rows */}
            <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "0.8px", marginBottom: "12px" }}>
              SHOW DETAILS
            </p>

            {[
              { label: "Theatre",    value: show?.screen?.theater?.name || "N/A" },
              { label: "Screen",     value: show?.screen?.name || "N/A" },
              { label: "Start Time", value: show?.startTime ? new Date(show.startTime).toLocaleString() : "N/A" },
              { label: "End Time",   value: show?.endTime   ? new Date(show.endTime).toLocaleString()   : "N/A" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <span style={{ color: "#64748b", fontSize: "13px" }}>{row.label}</span>
                <span style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: "600" }}>{row.value}</span>
              </div>
            ))}

            {/* Dashed divider */}
            <div style={{ borderTop: "2px dashed #1e293b", margin: "16px 0" }} />

            {/* Booking details */}
            <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "0.8px", marginBottom: "12px" }}>
              BOOKING DETAILS
            </p>

            {/* Payment method */}
            <div
              style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #1e293b",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "13px" }}>Payment Method</span>
              <span style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: "600" }}>
                {bookingRequest.paymentMethod}
              </span>
            </div>

            {/* Seats */}
            <div style={{ padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  Seats ({seatDisplay.length})
                </span>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "60%" }}>
                  {seatDisplay.map((seat) => (
                    <span
                      key={seat}
                      style={{
                        background: "#22c55e22", color: "#4ade80",
                        padding: "2px 9px", borderRadius: "6px",
                        fontSize: "12px", fontWeight: "600",
                      }}
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div style={{ borderTop: "2px dashed #1e293b", margin: "16px 0" }} />

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ color: "#94a3b8", fontSize: "15px" }}>Total Amount</span>
              <span style={{ color: "#ef4444", fontSize: "26px", fontWeight: "700" }}>
                ₹{totalAmount}
              </span>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: loading ? "#334155" : "#ef4444",
                color: "white",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#dc2626"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#ef4444"; }}
            >
              {loading ? "Processing..." : "Confirm & Pay  ₹" + totalAmount}
            </button>

            {/* Cancel link */}
            <p
              onClick={() => navigate(-1)}
              style={{
                textAlign: "center", color: "#475569",
                fontSize: "13px", marginTop: "12px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
            >
              ← Go back & change seats
            </p>

          </div>
        </div>

        {/* Security note */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", marginTop: "16px",
          }}
        >
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
          <p style={{ color: "#475569", fontSize: "12px" }}>
            100% secure payment • Instant confirmation
          </p>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;