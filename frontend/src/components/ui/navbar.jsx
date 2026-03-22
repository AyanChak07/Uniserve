import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  User,
  Home,
  Car,
  UtensilsCrossed,
  Ticket,
  Wrench,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);          // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/transport", label: "Transport", icon: Car },
    { to: "/food", label: "Food", icon: UtensilsCrossed },
    { to: "/entertainment", label: "Entertainment", icon: Ticket },
    { to: "/medical", label: "Medical", icon: Ticket },
    { to: "/household", label: "Household", icon: Wrench },
  ];

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="h-20 flex items-center justify-between gap-6">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 shrink-0">
              <div className="bg-primary-600 text-white p-3 rounded-xl shadow-md">
                <Home className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-primary-600 tracking-tight">
                Uniserve
              </span>
            </Link>

            {/* DESKTOP NAV */}
            {user && (
              <div className="hidden lg:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-2xl shadow-inner">
                {navItems.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname.startsWith(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                        ${
                          active
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                            : "text-gray-600 hover:bg-white hover:shadow-sm"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* RIGHT SIDE */}
            <div className="shrink-0 flex items-center gap-4">

              {/* MOBILE MENU BUTTON */}
              {user && (
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
              )}

              {/* USER DROPDOWN (DESKTOP) */}
              {user && (
                <div
                  className="relative hidden lg:block"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition whitespace-nowrap">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-gray-700">
                      {firstName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="absolute left-0 right-0 top-full h-2" />

                  {open && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border overflow-hidden">
                      <div className="px-5 py-4 border-b">
                        <p className="font-semibold text-gray-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full text-left px-5 py-3 hover:bg-gray-50 font-medium"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AUTH BUTTONS */}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="font-semibold text-gray-600 hover:text-primary-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-pink-500 to-purple-500
                    text-white px-6 py-2.5 rounded-xl font-bold shadow-md
                    hover:opacity-90 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-extrabold text-primary-600">
                Uniserve
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2 flex-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold
                      ${
                        active
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500 mb-3 truncate">
                {user.email}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;