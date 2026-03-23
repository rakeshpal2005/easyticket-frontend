import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Ticket = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking =
    state?.booking || JSON.parse(localStorage.getItem("latestBooking") || "null");

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-5 py-16 text-center">
          <div className="text-6xl mb-4">🎟️</div>
          <h1 className="text-2xl font-bold mb-2">No Ticket Found</h1>
          <p className="text-slate-400 mb-6">We couldn't find any booking data.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const poster = booking.show?.movie?.posterUrl || null;

  const formatTime = (raw) => {
    if (!raw) return "N/A";
    try { return new Date(raw).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return raw; }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Top label */}
        <div className="mb-5">
          <p className="text-slate-400 text-sm">Booking Successful!</p>
          <h1 className="text-2xl font-bold text-white">Your Ticket</h1>
        </div>

        {/* ── TICKET CARD ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

          {/* Red header */}
          <div className="bg-red-500 px-6 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-red-200 text-xs font-medium mb-1 tracking-widest uppercase">Booking Number</p>
              <p className="text-white font-bold text-sm break-all leading-snug">
                {booking.bookingNumber}
              </p>
            </div>
            <span className="shrink-0 bg-white text-red-500 text-xs font-black px-4 py-1.5 rounded-full tracking-wider uppercase">
              {booking.status}
            </span>
          </div>

          {/* Movie info row */}
          <div className="flex gap-4 px-6 py-5 border-b border-slate-800">
            {/* Poster */}
            <div className="shrink-0">
              {poster ? (
                <img
                  src={poster}
                  alt={booking.show?.movie?.title}
                  className="w-20 h-28 object-cover rounded-xl border border-slate-700"
                />
              ) : (
                <div className="w-20 h-28 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl">
                  🎬
                </div>
              )}
            </div>

            {/* Title + badges */}
            <div className="flex flex-col justify-center min-w-0">
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                {booking.show?.movie?.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {booking.show?.movie?.language && (
                  <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {booking.show.movie.language}
                  </span>
                )}
                {booking.show?.movie?.genre && (
                  <span className="bg-red-500/20 text-red-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {booking.show.movie.genre}
                  </span>
                )}
                {booking.show?.movie?.durationFormatted && (
                  <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {booking.show.movie.durationformatted} mins
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Show details */}
          <div className="px-6 py-5 border-b border-slate-800">
            <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-3">
              Show Details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Show Time",    value: formatTime(booking.show?.startTime) },
                { label: "Theatre",      value: booking.show?.screen?.theater?.name },
                { label: "Screen",       value: booking.show?.screen?.name },
                { label: "Booking Time", value: formatTime(booking.bookingTime) },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-slate-500 text-xs mb-0.5">{row.label}</p>
                  <p className="text-slate-200 text-sm font-semibold">{row.value || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seats */}
          <div className="px-6 py-5 border-b border-slate-800">
            <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-3">
              Seats ({booking.seats?.length || 0})
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.seats?.map((seat) => (
                <span
                  key={seat.id}
                  className="bg-green-500/20 text-green-400 text-sm font-bold px-4 py-1.5 rounded-lg border border-green-500/20"
                >
                  {seat.seat?.seatNumber}
                </span>
              ))}
            </div>
          </div>

          {/* Dashed divider */}
          <div className="px-6">
            <div className="border-t-2 border-dashed border-slate-800" />
          </div>

          {/* Payment details */}
          <div className="px-6 py-5 border-b border-slate-800">
            <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-3">
              Payment Details
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Payment Method", value: booking.payment?.paymentMethod },
                { label: "Payment Status", value: booking.payment?.status },
                { label: "Transaction ID", value: booking.payment?.transactionId },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">{row.label}</span>
                  <span className="text-slate-200 text-sm font-semibold break-all text-right max-w-[55%]">
                    {row.value || "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total + Button */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-slate-400 text-base">Total Paid</span>
              <span className="text-red-400 text-3xl font-black">₹{booking.totalAmount}</span>
            </div>

            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-bold text-base transition"
            >
              Go to My Bookings
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white py-3 rounded-xl font-medium text-sm transition border border-slate-800"
            >
              Back to Home
            </button>
          </div>

        </div>

        {/* Bottom note */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-slate-500 text-xs">Booking confirmed • Check email for details</p>
        </div>

      </div>
    </div>
  );
};

export default Ticket;