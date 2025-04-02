import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", icon: "🏠", path: "/coach-home" },
    { label: "Drills", icon: "🏋️", path: "/drills" },
    { label: "Create", icon: "➕", path: "/create-assignment" },
    { label: "Quizzes", icon: "❓", path: "/quizzes" },
    { label: "Account", icon: "⚙️", path: "/account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-sm flex justify-around py-2.5 text-xs text-gray-600 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-0.5 transition ${
              isActive ? "text-blue-600 font-semibold" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
