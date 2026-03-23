import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const cities = ["Kolkata", "Mumbai", "Delhi", "Bangalore"];

const SelectCity = () => {
  const { id } = useParams(); // movieId

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="glass soft-shadow rounded-3xl p-6">
          <h1 className="text-3xl font-extrabold">
            Choose <span className="text-red-400">City</span>
          </h1>
          <p className="mt-2 text-gray-300/80">
            Backend mapping: getShowsByMovieAndCity(movieId, city)
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/movie/${id}/shows?city=${encodeURIComponent(city)}`}
                className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 hover:bg-white/5 transition text-center font-semibold"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCity;