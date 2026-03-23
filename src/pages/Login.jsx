import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = () => {
    if (!form.email || !form.password) {
      setToast({ message: "Please enter email and password", type: "error" });
      return;
    }
    setLoading(true);
    loginUser(form)
      .then((res) => {
        const data = res.data;
        localStorage.setItem("token",  data.token);
        localStorage.setItem("name",   data.name   || "");
        localStorage.setItem("email",  data.email  || "");
        localStorage.setItem("userId", data.id || data.userId || "");
        setToast({ message: "Login successful", type: "success" });
        setTimeout(() => navigate("/"), 1200);
      })
      .catch((err) => {
        setToast({ message: err.response?.data || "Login failed", type: "error" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#020617" }}
    >

      {/* ── LEFT SIDE — Branding ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 px-12"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #1a0a2e 50%, #020617 100%)",
          borderRight: "1px solid #1e293b",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            backgroundColor: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "900", fontSize: "22px", color: "white",
          }}>
            ET
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800" }}>
            <span style={{ color: "white" }}>Easy</span>
            <span style={{ color: "#ef4444" }}>Ticket</span>
          </div>
        </div>

        <h2 style={{ color: "white", fontSize: "22px", fontWeight: "600", marginBottom: "12px", textAlign: "center" }}>
          Book movie tickets instantly
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", lineHeight: 1.7, maxWidth: "320px" }}>
          Best seats, zero hassle, instant confirmation.
          Your cinema experience starts here.
        </p>

        {/* Feature list */}
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { icon: "🎬", text: "20+ movies showing now" },
            { icon: "🏙️", text: "7 cities across India" },
            { icon: "🎟️", text: "Instant ticket confirmation" },
          ].map((f) => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>{f.icon}</span>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT SIDE — Login Form ── */}
      <div className="flex flex-col items-center justify-center flex-1 px-6">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            backgroundColor: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "900", fontSize: "16px", color: "white",
          }}>ET</div>
          <div style={{ fontSize: "22px", fontWeight: "800" }}>
            <span style={{ color: "white" }}>Easy</span>
            <span style={{ color: "#ef4444" }}>Ticket</span>
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            width: "100%", maxWidth: "400px",
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "20px",
            padding: "32px",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "4px" }}>Welcome back</p>
          <h1 style={{ color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "24px" }}>
            Sign in to your account
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Email */}
            <div>
              <label style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "11px 14px",
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "white", fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#ef4444"}
                onBlur={(e) => e.target.style.borderColor = "#334155"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "11px 42px 11px 14px",
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                    color: "white", fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#ef4444"}
                  onBlur={(e) => e.target.style.borderColor = "#334155"}
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "#64748b", cursor: "pointer", fontSize: "12px",
                  }}
                >
                  {showPwd ? "hide" : "show"}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                backgroundColor: loading ? "#334155" : "#ef4444",
                border: "none", borderRadius: "10px",
                color: "white", fontSize: "14px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                marginTop: "4px",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#dc2626"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#ef4444"; }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
            <span style={{ color: "#475569", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#1e293b" }} />
          </div>

          <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#ef4444", textDecoration: "none", fontWeight: "500" }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <Link
          to="/"
          style={{ color: "#475569", fontSize: "13px", marginTop: "20px", textDecoration: "none" }}
        >
          ← Back to movies
        </Link>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default Login;