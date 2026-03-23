import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyBookings, cancelBooking } from "../services/bookingService";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const loadBookings = () => {
    setLoading(true);
    getMyBookings()
      .then((res) => { setBookings(res.data); setLoading(false); })
      .catch((err) => { console.error("Error fetching bookings:", err); setLoading(false); });
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    cancelBooking(bookingId)
      .then(() => { alert("Booking cancelled successfully"); loadBookings(); })
      .catch((err) => { console.error("Cancel failed:", err); alert("Cancel booking failed"); });
  };

  const formatTime = (raw) => {
    if (!raw) return "N/A";
    try { return new Date(raw).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return raw; }
  };

  const statusStyle = (status) => {
    if (status === "CONFIRMED") return "bg-green-500/20 text-green-400 border border-green-500/30";
    if (status === "CANCELLED") return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  };

  const statusDot = (status) => {
    if (status === "CONFIRMED") return "bg-green-400";
    if (status === "CANCELLED") return "bg-red-400";
    return "bg-yellow-400";
  };

  const statusBar = (status) => {
    if (status === "CONFIRMED") return "bg-green-500";
    if (status === "CANCELLED") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Page Header */}
        <div className="mb-7">
          <p className="text-slate-400 text-sm mb-1">Your history</p>
          <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        </div>

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-1 bg-slate-700 w-full" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-9 bg-slate-800 rounded-lg w-28" />
                    <div className="h-9 bg-slate-800 rounded-lg w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : bookings.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎟️</div>
            <h2 className="text-xl font-bold text-white mb-2">No Bookings Yet</h2>
            <p className="text-slate-400 mb-6">You haven't booked any tickets yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Browse Movies
            </button>
          </div>

        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Total Bookings", value: bookings.length,                                          color: "text-white"       },
                { label: "Confirmed",      value: bookings.filter(b => b.status === "CONFIRMED").length,    color: "text-green-400"   },
                { label: "Cancelled",      value: bookings.filter(b => b.status === "CANCELLED").length,    color: "text-red-400"     },
              ].map((s) => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bookings grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition"
                >
                  {/* Top color bar */}
                  <div className={`h-1 w-full ${statusBar(booking.status)}`} />

                  <div className="p-5">
                    {/* Movie title + status badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h2 className="text-lg font-bold text-white leading-tight">
                        {booking.show?.movie?.title || "Unknown Movie"}
                      </h2>
                      <span className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${statusStyle(booking.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(booking.status)}`} />
                        {booking.status}
                      </span>
                    </div>

                    {/* Details rows */}
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Booking No", value: booking.bookingNumber, truncate: true },
                        { label: "Booked On",  value: formatTime(booking.time) },
                        { label: "Theatre",    value: booking.show?.screen?.theater?.name },
                        { label: "Screen",     value: booking.show?.screen?.name },
                        { label: "Show Time",  value: formatTime(booking.show?.startTime) },
                      ].map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-2">
                          <span className="text-slate-500 text-xs shrink-0">{row.label}</span>
                          <span className={`text-slate-300 text-xs font-medium text-right ${row.truncate ? "truncate max-w-[55%]" : ""}`}>
                            {row.value || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Seats */}
                    {booking.seats?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-slate-500 text-xs mb-1.5">Seats</p>
                        <div className="flex flex-wrap gap-1.5">
                          {booking.seats.map((s) => (
                            <span
                              key={s.id}
                              className="bg-green-500/15 text-green-400 border border-green-500/20 text-xs font-bold px-2.5 py-0.5 rounded-md"
                            >
                              {s.seat?.seatNumber}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Divider + Amount */}
                    <div className="border-t border-slate-800 pt-3 mb-4 flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Total Paid</span>
                      <span className="text-red-400 text-xl font-black">₹{booking.totalAmount}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/ticket", { state: { booking } })}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition"
                      >
                        View Ticket
                      </button>

                      {booking.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold py-2.5 rounded-xl border border-slate-700 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;