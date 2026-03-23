import { Link } from "react-router-dom";

const genreColor = (genre) => {
  const map = {
    Action:   { bg: "#ef444420", text: "#f87171" },
    Comedy:   { bg: "#22c55e20", text: "#4ade80" },
    Drama:    { bg: "#a855f720", text: "#c084fc" },
    Thriller: { bg: "#f59e0b20", text: "#fcd34d" },
    "Sci-Fi": { bg: "#3b82f620", text: "#93c5fd" },
    Romance:  { bg: "#ec489920", text: "#f9a8d4" },
  };
  return map[genre] || { bg: "#64748b20", text: "#94a3b8" };
};

const PLACEHOLDER = "https://placehold.co/300x400/1e293b/475569?text=No+Poster";

const MovieCard = ({ movie }) => {
  const { bg, text } = genreColor(movie.genre);

  const posterSrc = movie.posterUrl?.startsWith("http")
    ? movie.posterUrl
    : movie.posterUrl
    ? `/${movie.posterUrl}`
    : PLACEHOLDER;

  return (
    <div
      className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 transition-all duration-200 hover:-translate-y-1 group"
      style={{ boxShadow: "0 0 0 0 transparent" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ef444455"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1e293b"}
    >
      {/* Poster */}
      <div className="relative overflow-hidden h-64 bg-slate-800 flex items-center justify-center">
        <img
          src={posterSrc}
          alt={movie.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />

        {/* NEW badge */}
        <div className="absolute top-2 left-2">
          <span
            style={{ backgroundColor: "#ef4444", fontSize: "9px" }}
            className="text-white font-black px-2 py-0.5 rounded"
          >
            NEW
          </span>
        </div>

        {/* Star rating */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <span style={{ color: "#fbbf24", fontSize: "10px" }}>★</span>
          <span style={{ color: "white", fontSize: "10px", fontWeight: "700" }}>
            {movie.rating ? movie.rating : "4.0"}
          </span>
        </div>

        {/* Dark gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(to top, #0f172a, transparent)" }}
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h2 className="text-base font-bold text-white truncate mb-1">
          {movie.title}
        </h2>

        <p className="text-xs text-slate-400 mb-2">
          {movie.language} • {movie.durationformatted} 
        </p>

        {movie.genre && (
          <span
            className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3"
            style={{ backgroundColor: bg, color: text }}
          >
            {movie.genre}
          </span>
        )}

        <Link to={`/movie/${movie.id}`}>
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;