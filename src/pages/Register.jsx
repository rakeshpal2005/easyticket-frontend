import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setForm({
        ...form,
        phoneNumber: value,
      });
    }
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password || form.phoneNumber.length !== 10) {
      setToast({
        message: "Fill all fields correctly. Phone must be 10 digits.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    registerUser(form)
      .then(() => {
        setToast({
          message: "Registered successfully",
          type: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((err) => {
        console.error("Register error:", err);
        setToast({
          message: err.response?.data || "Registration failed",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-md mx-auto px-5 py-10">
        <div className="bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-800">
          
          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-6 text-white">
            Create Account
          </h1>

          <div className="space-y-4">
            
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handlePhoneChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
            />

            {/* TEXT */}
            <p className="text-xs text-slate-400">
              Phone number must be exactly 10 digits
            </p>

            {/* BUTTON */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>

          {/* LOGIN LINK */}
          <p className="mt-4 text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Register;