import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMovieById } from "../services/movieService";
import { getShowsByMovieAndCity } from "../services/showService";

const CITIES = ["Mumbai", "Delhi", "Kolkata", "Chennai", "Pune", "Hyderabad", "Bangalore"];

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie]           = useState(null);
  const [shows, setShows]           = useState([]);
  const [city, setCity]             = useState("Mumbai");
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShows, setLoadingShows] = useState(false);

  useEffect(() => {
    setLoadingMovie(true);
    getMovieById(id)
      .then((res) => { setMovie(res.data); setLoadingMovie(false); })
      .catch((err) => { console.error("Error fetching movie:", err); setLoadingMovie(false); });
  }, [id]);

  const loadShowsByCity = (selectedCity) => {
    setLoadingShows(true);
    getShowsByMovieAndCity(id, selectedCity)
      .then((res) => { setShows(res.data); setLoadingShows(false); })
      .catch((err) => { console.error("Error fetching shows:", err); setLoadingShows(false); });
  };

  useEffect(() => {
    loadShowsByCity(city);
  }, [id, city]);

  const formatTime = (raw) => {
    if (!raw) return "N/A";
    try { return new Date(raw).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return raw; }
  };

  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-5 py-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/2" />
          <div className="h-64 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-5 py-16 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-xl font-bold">Movie not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* ── Movie Details ── */}
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 border border-slate-800 mb-8">

          {/* Poster */}
          <div className="w-full md:w-64 shrink-0">
            {movie.posterUrl?.startsWith('http') ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-80 object-cover rounded-xl border border-slate-700"
              />
            ) : (
              <div className="w-full h-80 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-5xl">
                🎬
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              {movie.title}
            </h1>
            <p className="text-slate-300 text-base mb-5 leading-relaxed">
              {movie.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Language",     value: movie.language },
                { label: "Genre",        value: movie.genre },
                { label: "Duration",     value: `${movie.durationformatted} mins` },
                { label: "Release Date", value: movie.releaseDate },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800 rounded-xl px-4 py-3 border border-slate-700">
                  <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-white font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── City + Shows ── */}
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-800">

          <h2 className="text-xl font-bold mb-4 text-white">Choose City</h2>

          {/* City chips */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                  city === c
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4 text-white">
            Available Shows in {city}
          </h2>

          {loadingShows ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-5 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                  <div className="h-3 bg-slate-700 rounded w-2/3" />
                  <div className="h-9 bg-slate-700 rounded-lg mt-4" />
                </div>
              ))}
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎭</div>
              <p className="text-slate-400 text-base">No shows available in {city}</p>
              <p className="text-slate-500 text-sm mt-1">Try another city!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {shows.map((show) => (
                <div
                  key={show.id}
                  className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-red-500/50 transition"
                >
                  {/* Theater name */}
                  <h3 className="text-base font-bold text-white mb-3 truncate">
                    {show.screen?.theater?.name}
                  </h3>

                  <div className="space-y-2 text-sm mb-4">
                    {[
                      { label: "Address", value: show.screen?.theater?.address },
                      { label: "Screen",  value: show.screen?.name },
                      { label: "Start",   value: formatTime(show.startTime) },
                      { label: "End",     value: formatTime(show.endTime) },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span className="text-slate-400">{row.label}</span>
                        <span className="text-white font-medium text-right max-w-[60%] truncate">
                          {row.value || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Available seats count */}
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">Available Seats</span>
                    <span className={`font-bold text-sm ${
                      (show.availableSeats?.length || 0) > 10
                        ? "text-green-400"
                        : (show.availableSeats?.length || 0) > 0
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}>
                      {show.availableSeats?.length || 0} seats
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/shows/${show.id}/seats`)}
                    disabled={show.availableSeats?.length === 0}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
                      show.availableSeats?.length === 0
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {show.availableSeats?.length === 0 ? "Housefull" : "Select Seats"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;