import { Link } from "react-router-dom";

const FeaturedRow = ({ movies }) => {
  return (
    <div className="glass soft-shadow rounded-3xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">🔥 Featured</h2>
        <span className="text-sm text-gray-300/70">Swipe →</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`} className="min-w-[240px]">
            <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition">
              <img src={m.posterUrl} alt={m.title} className="h-40 w-full object-cover" />
              <div className="p-3 bg-black/30">
                <div className="font-semibold line-clamp-1">{m.title}</div>
                <div className="text-xs text-gray-300/70">{m.genre} • {m.language}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRow;