// src/components/BottomNav.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.clear();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Drills", path: "/drills" },
    { label: "Create", path: "/create-assignment" },
    { label: "Quizzes", path: "/quizzes" },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-inner z-50">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex-1 text-center text-sm ${
            location.pathname === item.path
              ? "text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          {item.label}
        </button>
      ))}

      {/* Log Out Button (replaces "Account") */}
      <button
        onClick={handleLogout}
        className="flex-1 text-center text-sm text-red-500 font-semibold"
      >
        Log Out
      </button>
    </div>
  );
}
