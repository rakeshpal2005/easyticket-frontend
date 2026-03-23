import { Link } from "react-router-dom";

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const SOCIALS = [
  { label: "Facebook",  Icon: FacebookIcon,  hoverColor: "#1877f2" },
  { label: "Instagram", Icon: InstagramIcon, hoverColor: "#e1306c" },
  { label: "X",         Icon: XIcon,         hoverColor: "#ffffff" },
  { label: "YouTube",   Icon: YouTubeIcon,   hoverColor: "#ff0000" },
];

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "#020617", borderTop: "1px solid #1e293b" }}
      className="mt-10 px-5 py-10 text-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{
                width: "38px", height: "38px", borderRadius: "10px",
                backgroundColor: "#ef4444",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "900", fontSize: "15px", color: "white",
              }}>
                ET
              </div>
              <span style={{ fontSize: "20px", fontWeight: "800" }}>
                <span style={{ color: "white" }}>Easy</span>
                <span style={{ color: "#ef4444" }}>Ticket</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Your one-stop destination for booking movie tickets online.
              Fast, easy, and reliable — anytime, anywhere.
            </p>

            {/* Social Icons with real logos */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, Icon, hoverColor }) => (
                <div
                  key={label}
                  title={label}
                  style={{
                    width: "34px", height: "34px",
                    borderRadius: "8px",
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#94a3b8", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = hoverColor;
                    e.currentTarget.style.color = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1e293b";
                    e.currentTarget.style.color = "#94a3b8";
                  }}
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          {/* Movies */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Movies</h4>
            <ul className="space-y-2">
              {[
                { label: "Now Showing",  to: "/" },
                { label: "Coming Soon",  to: "/" },
                { label: "Find Ticket",  to: "/booking-search" },
                { label: "Shows by Date", to: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-400 text-sm hover:text-red-400 transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { label: "Login",       to: "/login" },
                { label: "Register",    to: "/register" },
                { label: "My Bookings", to: "/my-bookings" },
                { label: "Select City", to: "/select-city" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-400 text-sm hover:text-red-400 transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Help</h4>
            <ul className="space-y-2">
              {["FAQs", "Cancellation Policy", "Contact Us", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <span className="text-slate-400 text-sm hover:text-red-400 transition cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;