import { Link, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { shows } from "../mock/shows";

const formatTime = (iso) => new Date(iso).toLocaleString();

const Shows = () => {
  const { id } = useParams(); // movieId
  const [params] = useSearchParams();
  const city = params.get("city") || "Kolkata";

  const list = shows.filter(
    (s) => String(s.movie.id) === String(id) && s.screen.theater.city === city
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="glass soft-shadow rounded-3xl p-6 mb-6">
          <h1 className="text-3xl font-extrabold">
            Shows in <span className="text-red-400">{city}</span>
          </h1>
        </div>

        {list.length === 0 ? (
          <div className="glass rounded-2xl p-6 border border-white/10">
            No shows found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.map((show) => {
              const availableCount = show.availableSeats.filter(
                (x) => x.status === "AVAILABLE"
              ).length;

              return (
                <div
                  key={show.id}
                  className="glass soft-shadow rounded-2xl p-5 border border-white/10"
                >
                  <div className="text-lg font-bold">{show.screen.theater.name}</div>
                  <div className="text-sm text-gray-300/70">
                    {show.screen.name} • {show.screen.theater.address}
                  </div>

                  <div className="mt-4 text-sm">
                    <div>
                      <span className="text-gray-300/70">Start:</span>{" "}
                      {formatTime(show.startTime)}
                    </div>
                    <div>
                      <span className="text-gray-300/70">End:</span>{" "}
                      {formatTime(show.endTime)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-300/70">
                      Available: <span className="text-white font-semibold">{availableCount}</span>
                    </div>

                    <Link to={`/shows/${show.id}/seats`}>
                      <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition font-semibold">
                        Select Seats
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shows;