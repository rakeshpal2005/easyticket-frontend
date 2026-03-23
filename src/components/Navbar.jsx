import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Toast from "./Toast";

const NAVBAR_HEIGHT = 68;

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name,  setName]  = useState(localStorage.getItem("name"));
  const [email, setEmail] = useState(localStorage.getItem("email"));

  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast]             = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setToken(null); setName(null); setEmail(null);
    setShowProfile(false);
    setToast({ message: "Logged out successfully", type: "success" });
    setTimeout(() => window.location.href = "/", 900);
  };

  const navClass = (path) =>
    `px-3 py-1.5 rounded-lg text-[15px] font-medium transition ${
      location.pathname === path ? "text-white" : "text-gray-300 hover:text-white"
    }`;

  /* Initials from name */
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <header
        style={{
          height: NAVBAR_HEIGHT,
          backgroundColor: "#020617",
          borderBottom: "1px solid #1e293b",
          boxShadow: "0 2px 16px rgba(0,0,0,0.8)",
        }}
        className="fixed top-0 left-0 right-0 z-[9999]"
      >
        <div className="w-full h-full px-5 flex items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" style={{ gap: "12px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              backgroundColor: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "900", fontSize: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)", flexShrink: 0,
            }}>ET</div>
            <div style={{ fontSize: "25px", fontWeight: "800", lineHeight: 1 }}>
              <span style={{ color: "white" }}>Easy</span>
              <span style={{ color: "#ef4444" }}>Ticket</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="ml-auto flex items-center gap-1">
            <Link to="/"               className={navClass("/")}>Movies</Link>
            <Link to="/booking-search" className={navClass("/booking-search")}>Find Ticket</Link>
            <Link to="/my-bookings"    className={navClass("/my-bookings")}>My Bookings</Link>

            {!token ? (
              <Link
                to="/login"
                className="ml-3 px-4 py-1.5 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow transition"
              >
                Login
              </Link>
            ) : (
              <div className="relative ml-3" ref={profileRef}>
                {/* Avatar button with initials */}
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    backgroundColor: "#7c3aed",
                    border: showProfile ? "2px solid #ef4444" : "2px solid transparent",
                    color: "white", fontWeight: "700", fontSize: "13px",
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {initials}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />

      {/* ── Profile dropdown ── */}
      {showProfile && (
        <div className="fixed right-5 z-[99999]" style={{ top: NAVBAR_HEIGHT + 8 }}>
          <div
            ref={profileRef}
            style={{
              width: "260px",
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              overflow: "hidden",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 99999,
            }}
          >
            {/* Top section — avatar + name */}
            <div style={{
              padding: "16px",
              borderBottom: "1px solid #1e293b",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              {/* Avatar circle */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                backgroundColor: "#7c3aed",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: "700", fontSize: "16px",
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
                  {name || "User"}
                </p>
                <p style={{ color: "#64748b", fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {email || ""}
                </p>
              </div>
            </div>

            {/* Menu links */}
            <div style={{ padding: "8px" }}>
              <Link
                to="/my-bookings"
                onClick={() => setShowProfile(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "10px",
                  color: "#94a3b8", fontSize: "13px", textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1e293b"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                🎟️ My Bookings
              </Link>

              {/* Divider */}
              <div style={{ height: "1px", backgroundColor: "#1e293b", margin: "6px 0" }} />

              {/* Logout */}
              <button
                onMouseDown={(e) => { e.stopPropagation(); handleLogout(); }}
                style={{
                  width: "100%", padding: "10px 12px",
                  display: "flex", alignItems: "center", gap: "10px",
                  backgroundColor: "transparent",
                  border: "none", borderRadius: "10px",
                  color: "#f87171", fontSize: "13px",
                  cursor: "pointer", transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
};

export default Navbar;