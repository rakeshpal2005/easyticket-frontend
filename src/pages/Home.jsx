import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import {
  getAllMovies,
  searchMovies,
  getMoviesByGenre,
  getMoviesByLanguage,
} from "../services/movieService";
import { getShowsByDateRange } from "../services/showService";

const GENRES = ["Action", "Sci-Fi", "Drama", "Thriller", "Comedy", "Romance"];
const GENRE_ICONS = {
  Action: "💥", "Sci-Fi": "🪐", Drama: "🎭",
  Thriller: "😱", Comedy: "😂", Romance: "💕",
};

const Home = () => {
  const navigate = useNavigate();

  const [movies, setMovies]                     = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState("");
  const [searchText, setSearchText]             = useState("");
  const [selectedGenre, setSelectedGenre]       = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [startDate, setStartDate]               = useState("");
  const [endDate, setEndDate]                   = useState("");
  const [comingSoon, setComingSoon]             = useState([]);
  const [todayShows, setTodayShows]             = useState([]);

  const loadMovies = () => {
    setLoading(true);
    setError("");
    getAllMovies()
      .then((res) => { setMovies(res.data); setLoading(false); })
      .catch(() => { setError("Could not load movies"); setLoading(false); });
  };

  useEffect(() => {
    loadMovies();
    getAllMovies()
      .then((res) => setComingSoon((res.data || []).slice(-8)))
      .catch(() => {});
    const now   = new Date();
    const start = now.toISOString().slice(0, 16);
    const end   = new Date(now.setHours(23, 59)).toISOString().slice(0, 16);
    getShowsByDateRange(start, end)
      .then((res) => setTodayShows((res.data || []).slice(0, 4)))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) { loadMovies(); return; }
    setLoading(true); setError("");
    searchMovies(searchText)
      .then((res) => { setMovies(res.data); setLoading(false); })
      .catch(() => { setError("Could not search movies"); setLoading(false); });
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre); setSelectedLanguage(""); setSearchText("");
    if (!genre) { loadMovies(); return; }
    setLoading(true); setError("");
    getMoviesByGenre(genre)
      .then((res) => { setMovies(res.data); setLoading(false); })
      .catch(() => { setError("Could not filter by genre"); setLoading(false); });
  };

  const handleLanguageFilter = (language) => {
    setSelectedLanguage(language); setSelectedGenre(""); setSearchText("");
    if (!language) { loadMovies(); return; }
    setLoading(true); setError("");
    getMoviesByLanguage(language)
      .then((res) => { setMovies(res.data); setLoading(false); })
      .catch(() => { setError("Could not filter by language"); setLoading(false); });
  };

  const handleReset = () => {
    setSearchText(""); setSelectedGenre(""); setSelectedLanguage("");
    setStartDate(""); setEndDate(""); loadMovies();
  };

  const handleDateRangeNavigate = () => {
    navigate("/shows/date-range", { state: { startDate, endDate } });
  };

  const formatTime = (raw) => {
    if (!raw) return "";
    try { return new Date(raw).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
    catch { return raw; }
  };

  return (
    /* overflow-x-hidden fixes left-right scroll on whole page */
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      
      <div
        className="relative w-full flex flex-col overflow-hidden"
        style={{ minHeight: "60vh" }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, #020617 0%, #0f0c29 40%, #1a0a2e 70%, #020617 100%)",
          }}
        />

        {/* Red glow left — clipped so it doesn't cause x-scroll */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            top: "-10%", left: "-8%",
            width: "420px", height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #ef444415 0%, transparent 65%)",
          }}
        />
        {/* Purple glow right */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            top: "-10%", right: "-8%",
            width: "420px", height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #7c3aed15 0%, transparent 65%)",
          }}
        />

        {/* Navbar */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* Hero content */}
        <div className="relative  flex-1 flex flex-col items-center justify-center text-center px-5 py-10">

          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: "#ef444420",
              border: "1px solid #ef444440",
              color: "#f87171",
            }}
          >
            🎬 India's Easiest Movie Booking
          </div>

          {/* Big title */}
          <h1
            className="font-black leading-none mb-3"
            style={{ fontSize: "clamp(40px, 7vw, 80px)", letterSpacing: "-2px" }}
          >
            <span className="text-white">Easy</span>
            <span className="text-red-500">Ticket</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-slate-300 mb-4 max-w-lg"
            style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.6 }}
          >
            Book movie tickets instantly. Best seats, zero hassle,
            instant confirmation.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {[
              { icon: "✨", label: "Instant Booking" },
              { icon: "🎭", label: "Top Movies" },
              { icon: "💰", label: "Best Prices" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  color: "white",
                }}
              >
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={() =>
                document.getElementById("now-showing")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3 rounded-2xl font-bold text-sm transition"
              style={{ background: "#ef4444", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
            >
              Browse Movies
            </button>
            <button
              onClick={() => navigate("/booking-search")}
              className="px-7 py-3 rounded-2xl font-bold text-sm transition"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.25)",
                color: "white",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Find My Ticket
            </button>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-6 sm:gap-12 px-6 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { num: `${movies.length || "50"}+`, label: "Movies" },
              { num: "20+",  label: "Theatres" },
              { num: "10K+", label: "Bookings" },
              { num: "5+",   label: "Cities" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6 sm:gap-12">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-black text-red-400">{s.num}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
                {i < 3 && <div className="w-px h-6 bg-slate-700" />}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PAGE CONTENT — visible without scrolling
      ══════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-5 py-6" id="now-showing">

        {/* Search / Filter */}
        <section className="bg-slate-900 rounded-xl shadow-lg p-4 mb-6 border border-slate-700">
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
            🎬 Now Showing on{" "}
            <span className="text-white">Easy</span>
            <span className="text-red-500">Ticket</span>
          </h2>
          <p className="text-slate-300 text-base mb-4">
            Search by title, filter by genre and language.
          </p>

          <div className="flex flex-col lg:flex-row gap-2.5 mb-4">
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 outline-none text-white text-base focus:border-red-500 transition"
            />
            <button
              onClick={handleSearch}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold text-base transition"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-semibold text-base transition"
            >
              Reset
            </button>
          </div>

          {/* Genre chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleGenreFilter("")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                selectedGenre === ""
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              🎬 All
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreFilter(g)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  selectedGenre === g
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                }`}
              >
                {GENRE_ICONS[g]} {g}
              </button>
            ))}
          </div>

          {/* Language + Date */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1.5 text-base text-slate-200 font-medium">
                Filter by Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-base focus:border-red-500 transition"
              >
                <option value="">All Languages</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-base text-slate-200 font-medium">
                Start Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-base focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-base text-slate-200 font-medium">
                End Date &amp; Time
              </label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-base focus:border-purple-500 transition"
                />
                <button
                  onClick={handleDateRangeNavigate}
                  className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl font-semibold text-sm transition whitespace-nowrap"
                >
                  Find
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Shows */}
        {todayShows.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Don't miss out</p>
                <h2 className="text-lg font-bold text-white">Today's Shows</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayShows.map((show) => (
                <div
                  key={show.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition"
                >
                  <div className="w-12 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    {show.movie?.posterUrl ? (
                      <img src={show.movie.posterUrl} alt={show.movie?.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{show.movie?.title}</p>
                    <p className="text-slate-500 text-xs truncate">
                      {show.screen?.theater?.name} • {show.screen?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full">
                        {formatTime(show.startTime)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/seat-selection/${show.id}`)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex-shrink-0"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon scroll */}
        {comingSoon.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Scroll to explore →</p>
                <h2 className="text-lg font-bold text-white">Coming Soon</h2>
              </div>
              <span className="text-red-400 text-sm font-semibold cursor-pointer hover:text-red-300 transition">
                See All →
              </span>
            </div>
            <div
              className="flex gap-3 pb-2"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: "#ef4444 #1e293b",
              }}
            >
              {comingSoon.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-36 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-red-500/50 transition cursor-pointer group"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-800 flex items-center justify-center">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="text-4xl">🎬</div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span
                        style={{ backgroundColor: "#ef4444", fontSize: "9px" }}
                        className="text-white font-bold px-2 py-0.5 rounded"
                      >
                        SOON
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-white text-xs font-bold truncate mb-0.5">{movie.title}</p>
                    <p className="text-slate-500 text-xs truncate">{movie.language} • {movie.genre}</p>
                    {movie.durationformatted && (
                      <p className="text-slate-600 text-xs mt-0.5">{movie.durationformatted} </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Movie grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              {selectedGenre
                ? `${selectedGenre} Movies`
                : selectedLanguage
                ? `${selectedLanguage} Movies`
                : "All Movies"}
            </h2>
            {movies.length > 0 && (
              <span className="text-slate-500 text-sm">{movies.length} movies</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-800" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-9 bg-slate-800 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : movies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎬</div>
              <p className="text-slate-400 text-lg">No movies found.</p>
              <button
                onClick={handleReset}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;