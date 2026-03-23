import { useEffect } from "react";

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colorClass =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-purple-600";

  return (
    <div className="fixed top-20 right-5 z-[9999]">
      <div
        className={`${colorClass} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] border border-white/10`}
      >
        <span className="text-lg">
          {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>

        <p className="flex-1 text-sm font-medium">{message}</p>

        <button
          onClick={onClose}
          className="text-white/90 hover:text-white font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;