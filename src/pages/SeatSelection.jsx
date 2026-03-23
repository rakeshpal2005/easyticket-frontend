import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getShowById } from "../services/showService";
import Toast from "../components/Toast";

const SEAT_COLORS = {
  SILVER:   { bg: "#334155", selected: "#ef4444", shadow: "#1e293b",   text: "#94a3b8",  label: "Silver",   price: "₹150" },
  GOLD:     { bg: "#78350f", selected: "#ef4444", shadow: "#451a03",   text: "#fbbf24",  label: "Gold",     price: "₹200" },
  PLATINUM: { bg: "#1e3a5f", selected: "#ef4444", shadow: "#0c1e35",   text: "#60a5fa",  label: "Platinum", price: "₹250" },
};

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate   = useNavigate();

  const [show, setShow]                   = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    getShowById(showId)
      .then((res) => { setShow(res.data); setLoading(false); })
      .catch((err) => { console.error("Error fetching show:", err); setLoading(false); });
  }, [showId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto px-5 py-10 animate-pulse space-y-4">
          <div className="h-7 bg-slate-800 rounded w-48" />
          <div className="grid grid-cols-10 gap-2 mt-6">
            {[...Array(40)].map((_, i) => <div key={i} className="h-10 bg-slate-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-5 py-16 text-center">
          <div className="text-5xl mb-4">🎭</div>
          <h2 className="text-xl font-bold mb-4">Show Not Found</h2>
          <button onClick={() => navigate("/")} className="bg-red-500 hover:bg-red-600 px-6 py-2.5 rounded-xl text-sm font-semibold transition">Go Home</button>
        </div>
      </div>
    );
  }

  const seats = show.availableSeats || [];

  const rowMap = {};
  seats.forEach((seatObj) => {
    const num = seatObj.seat?.seatNumber || "";
    const row = num.replace(/[^A-Za-z]/g, "") || "?";
    if (!rowMap[row]) rowMap[row] = [];
    rowMap[row].push(seatObj);
  });
  const rowLetters = Object.keys(rowMap).sort();

  const toggleSeat = (showSeatId) => {
    const seatObj = seats.find((s) => s.id === showSeatId);
    if (!seatObj || seatObj.status !== "AVAILABLE") return;
    setSelectedSeatIds((prev) =>
      prev.includes(showSeatId) ? prev.filter((x) => x !== showSeatId) : [...prev, showSeatId]
    );
  };

  const totalAmount = selectedSeatIds.reduce((sum, sid) => {
    const seatObj = seats.find((s) => s.id === sid);
    return sum + (seatObj?.price || 0);
  }, 0);

  const handleContinue = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ message: "Please login first", type: "error" });
      setTimeout(() => navigate("/login"), 1200);
      return;
    }
    navigate("/booking-summary", {
      state: {
        bookingRequest: { showId: Number(show.id), seatIds: selectedSeatIds, paymentMethod },
        totalAmount,
        show,
      },
    });
  };

  const availableCount = seats.filter((s) => s.status === "AVAILABLE").length;
  const bookedCount    = seats.filter((s) => s.status !== "AVAILABLE").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Movie info bar ── */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex flex-wrap items-center gap-x-8 gap-y-2"
          style={{ background: "#0f172a", border: "1px solid #1e293b" }}
        >
          {[
            { label: "Movie",     value: show.movie.title },
            { label: "Theatre",   value: show.screen.theater.name },
            { label: "Screen",    value: show.screen.name },
            { label: "Show Time", value: show.startTime ? new Date(show.startTime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A" },
          ].map((item, i) => (
            <div key={item.label} className="flex items-center gap-6">
              <div>
                <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "2px" }}>{item.label}</p>
                <p style={{ color: "white", fontWeight: "700", fontSize: "13px" }}>{item.value}</p>
              </div>
              {i < 3 && <div className="w-px h-8 bg-slate-800 hidden sm:block" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-5">

          {/* ── SEAT MAP ── */}
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>

            {/* Screen */}
            <div className="px-10 pt-8 pb-4">
              <div style={{
                background: "linear-gradient(to bottom, #ef4444 0%, #7f1d1d 50%, transparent 100%)",
                borderRadius: "60% 60% 0 0 / 40px 40px 0 0",
                height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 40px rgba(239,68,68,0.3)",
              }}>
                <span style={{ color: "#fecaca", fontSize: "10px", fontWeight: "800", letterSpacing: "8px" }}>SCREEN</span>
              </div>
              {/* Screen reflection */}
              <div style={{
                height: "8px",
                background: "linear-gradient(to bottom, rgba(239,68,68,0.1), transparent)",
                marginTop: "2px",
              }} />
            </div>

            {/* Seat type labels */}
            <div className="flex justify-center gap-6 mb-3 px-4">
              {Object.entries(SEAT_COLORS).map(([type, c]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: c.bg }} />
                  <span style={{ color: c.text, fontSize: "10px", fontWeight: "600" }}>{c.label} {c.price}</span>
                </div>
              ))}
            </div>

            {/* Seats */}
            <div className="px-6 pb-6 overflow-x-auto">
              <div className="min-w-max mx-auto space-y-6">
                {rowLetters.map((row) => {
                  const rowSeats = [...rowMap[row]].sort((a, b) => {
                    const na = parseInt(a.seat?.seatNumber?.replace(/\D/g, "")) || 0;
                    const nb = parseInt(b.seat?.seatNumber?.replace(/\D/g, "")) || 0;
                    return na - nb;
                  });
                  const mid = Math.floor(rowSeats.length / 2);

                  return (
                    <div key={row} className="flex items-center gap-3">
                      <span style={{ color: "#475569", fontSize: "12px", fontWeight: "700", width: "22px", textAlign: "right", flexShrink: 0 }}>{row}</span>

                      <div className="flex items-center gap-7">
                        {rowSeats.map((seatObj, idx) => {
                          const isSelected = selectedSeatIds.includes(seatObj.id);
                          const isBooked   = seatObj.status !== "AVAILABLE";
                          const seatNum    = seatObj.seat?.seatNumber?.replace(/[A-Za-z]/g, "");
                          const seatType   = seatObj.seat?.seatType || "SILVER";
                          const colors     = SEAT_COLORS[seatType] || SEAT_COLORS.SILVER;

                          const bgColor = isBooked ? "#0f172a" : isSelected ? "#ef4444" : colors.bg;
                          const shadowColor = isBooked ? "#0a0f1a" : isSelected ? "#991b1b" : colors.shadow;
                          const textColor = isBooked ? "#1e293b" : isSelected ? "white" : colors.text;

                          return (
                            <div key={seatObj.id} className="flex items-center">
                              {idx === mid && <span style={{ width: "20px", flexShrink: 0 }} />}
                              <button
                                onClick={() => toggleSeat(seatObj.id)}
                                disabled={isBooked}
                                title={`${seatObj.seat?.seatNumber} (${seatType}) — ₹${seatObj.price}${isBooked ? " — BOOKED" : ""}`}
                                style={{
                                  width: "42px", height: "38px",
                                  borderRadius: "8px 8px 4px 4px",
                                  fontSize: "11px", fontWeight: "700",
                                  border: isBooked ? "1px solid #1e293b" : "none",
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  transition: "all 0.12s",
                                  backgroundColor: bgColor,
                                  color: textColor,
                                  boxShadow: isBooked ? "none" : `0 4px 0 ${shadowColor}${isSelected ? ", 0 0 12px rgba(239,68,68,0.4)" : ""}`,
                                  transform: isSelected ? "scale(1.12) translateY(-2px)" : "scale(1)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  opacity: isBooked ? 0.4 : 1,
                                }}
                                onMouseEnter={(e) => {
                                  if (!isBooked && !isSelected) {
                                    e.currentTarget.style.transform = "scale(1.08) translateY(-1px)";
                                    e.currentTarget.style.backgroundColor = "#475569";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isBooked && !isSelected) {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.backgroundColor = bgColor;
                                  }
                                }}
                              >
                                {seatNum}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <span style={{ color: "#475569", fontSize: "12px", fontWeight: "700", width: "22px", flexShrink: 0 }}>{row}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ borderTop: "1px solid #1e293b" }} className="px-6 py-3 flex items-center justify-center gap-8">
              {[
                { bg: "#334155", shadow: "0 3px 0 #1e293b",   label: "Available" },
                { bg: "#ef4444", shadow: "0 3px 0 #991b1b",   label: "Selected"  },
                { bg: "#1e293b", shadow: "0 3px 0 #0f172a",   label: "Booked"    },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div style={{ width: "20px", height: "18px", borderRadius: "5px 5px 2px 2px", backgroundColor: l.bg, boxShadow: l.shadow }} />
                  <span style={{ color: "#64748b", fontSize: "11px" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="lg:w-64 flex flex-col gap-4">

            {/* Seat stats */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b" }} className="rounded-xl p-4">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Seat Info</p>
              <div className="space-y-2.5">
                {[
                  { label: "Total",     value: seats.length,           color: "#f1f5f9" },
                  { label: "Available", value: availableCount,         color: "#4ade80" },
                  { label: "Booked",    value: bookedCount,            color: "#f87171" },
                  { label: "Selected",  value: selectedSeatIds.length, color: "#fbbf24" },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span style={{ color: "#64748b", fontSize: "13px" }}>{s.label}</span>
                    <span style={{ color: s.color, fontWeight: "700", fontSize: "14px" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected seats */}
            {selectedSeatIds.length > 0 && (
              <div style={{ background: "#0f172a", border: "1px solid #1e293b" }} className="rounded-xl p-4">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Your Seats</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeatIds.map((sid) => {
                    const s = seats.find((x) => x.id === sid);
                    const type = s?.seat?.seatType || "SILVER";
                    const c = SEAT_COLORS[type] || SEAT_COLORS.SILVER;
                    return (
                      <span
                        key={sid}
                        style={{ backgroundColor: `${c.bg}88`, color: c.text, border: `1px solid ${c.bg}`, fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px" }}
                      >
                        {s?.seat?.seatNumber}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment method */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b" }} className="rounded-xl p-4">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Payment</p>
              <div className="grid grid-cols-2 gap-2">
                {["UPI", "CARD", "NETBANKING", "CASH"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "700",
                      border: paymentMethod === method ? "1.5px solid #ef4444" : "1px solid #1e293b",
                      background: paymentMethod === method ? "#ef4444" : "#1e293b",
                      color: paymentMethod === method ? "white" : "#64748b",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Total + Continue */}
            <div style={{ background: "#0f172a", border: "1px solid #1e293b" }} className="rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span style={{ color: "#64748b", fontSize: "13px" }}>Total Amount</span>
                <span style={{ color: "#ef4444", fontSize: "26px", fontWeight: "900" }}>₹{totalAmount}</span>
              </div>
              {selectedSeatIds.length > 0 && (
                <p style={{ color: "#475569", fontSize: "11px", marginBottom: "12px" }}>
                  {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? "s" : ""} selected
                </p>
              )}

              <button
                onClick={handleContinue}
                disabled={selectedSeatIds.length === 0}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background: selectedSeatIds.length === 0 ? "#1e293b" : "#ef4444",
                  color: selectedSeatIds.length === 0 ? "#475569" : "white",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: selectedSeatIds.length === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                  marginBottom: "8px",
                }}
                onMouseEnter={(e) => { if (selectedSeatIds.length > 0) e.currentTarget.style.background = "#dc2626"; }}
                onMouseLeave={(e) => { if (selectedSeatIds.length > 0) e.currentTarget.style.background = "#ef4444"; }}
              >
                {selectedSeatIds.length === 0 ? "Select a seat" : `Continue — ₹${totalAmount}`}
              </button>

              {selectedSeatIds.length > 0 && (
                <button
                  onClick={() => setSelectedSeatIds([])}
                  style={{ width: "100%", padding: "8px", background: "transparent", border: "none", color: "#475569", fontSize: "12px", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#94a3b8"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                >
                  Clear selection
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SeatSelection;