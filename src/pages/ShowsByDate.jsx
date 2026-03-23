import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getShowsByDateRange } from "../services/showService";

const ShowsByDate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [startDate, setStartDate] = useState(location.state?.startDate || "");
  const [endDate, setEndDate] = useState(location.state?.endDate || "");
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end date/time");
      return;
    }

    setLoading(true);

    getShowsByDateRange(startDate, endDate)
      .then((res) => {
        setShows(res.data);
      })
      .catch((err) => {
        console.error("Date range show fetch error:", err);
        alert("Could not fetch shows");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (location.state?.startDate && location.state?.endDate) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="bg-slate-900 rounded-3xl shadow-lg p-8 border border-slate-700 mb-8">
          <h1 className="text-4xl font-bold mb-6">Find Shows by Date Range</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block mb-2 text-slate-300 text-lg">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-600 text-white text-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300 text-lg">End Date & Time</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-600 text-white text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 px-6 py-4 rounded-xl font-semibold text-lg disabled:bg-slate-700"
          >
            {loading ? "Searching..." : "Find Shows"}
          </button>
        </div>

        {shows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {shows.map((show) => (
              <div
                key={show.id}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-700"
              >
                <h3 className="text-lg font-bold mb-3">{show.movie?.title}</h3>

                <div className="space-y-2 text-sm text-slate-300">
                  <p><b className="text-white">Theater:</b> {show.screen?.theater?.name}</p>
                  <p><b className="text-white">City:</b> {show.screen?.theater?.city}</p>
                  <p><b className="text-white">Screen:</b> {show.screen?.name}</p>
                  <p><b className="text-white">Start:</b> {show.startTime}</p>
                  <p><b className="text-white">End:</b> {show.endTime}</p>
                </div>

                <button
                  onClick={() => navigate(`/shows/${show.id}/seats`)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold"
                >
                  Select Seats
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowsByDate;