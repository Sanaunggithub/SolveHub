import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function NavBar({ mobileButtons }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Home", to: "/" },
    { name: "Discussions", to: "/discussions" },
    { name: "Members", to: "/members" },
    { name: "Blogs", to: "/blogs" },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    setProfileOpen(false);
    navigate("/");
    alert(" Logged out successfully!");
  };

  const handleNavClick = () => {
    setOpen(false); // hide menu
    setProfileOpen(false); // close profile dropdown
  };

  // Get user initials for avatar
    const getInitials = (fullName) => {
      return fullName
        ?.split(" ")
        .map((name) => name[0]) // take the first letter of each word
        .join("")
        .toUpperCase() || "U";
    };

  return (
    <nav className="relative w-full md:w-auto">
      {/* Hamburger button (mobile only) toggle mobile sidebar */}
      <button
        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition z-50 relative"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop overlay (mobile only) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 md:hidden z-30" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Menu items */}
      <div
        className={`
          fixed md:static left-0 right-0 top-16 md:top-auto z-40
          w-full md:w-auto
          bg-white md:bg-transparent
          border-b border-gray-200 md:border-b-0
          shadow-lg md:shadow-none
          transition-all duration-300 ease-in-out
          ${open ? "block max-h-[calc(100vh-64px)] overflow-y-auto" : "hidden md:block"}
        `}
      >
        <ul className="flex flex-col md:flex-row md:space-x-10 md:items-center">
          {links.map((link) => (
            <li key={link.to} className="border-b border-gray-100 md:border-b-0">
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-3 md:px-0 md:py-0 transition ${
                    isActive
                      ? "text-blue-600 font-bold bg-blue-50 md:bg-transparent"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
                onClick={handleNavClick}
              >
                {link.name}
              </NavLink>
            </li>
          ))}

          {/* mobile menu is open & user is logged in*/}
          {open && isAuthenticated && (
            <li className="border-t border-gray-200 md:hidden">
              {/* user initials, full name , icon rotate when submenu is open */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(user?.full_name)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {user?.full_name || "Profile"}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ml-2 ${
                    profileOpen ? "rotate-90" : "" // 90 of >
                  }`}
                />
              </button>

              {/* Mobile Profile Submenu */}
              {profileOpen && (
                <div className="bg-blue-50 border-t border-gray-200 px-4 py-2 space-y-1">
                  <div className="py-2 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user?.username}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      handleNavClick();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white flex items-center gap-2 transition rounded"
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">View Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-white flex items-center gap-2 transition rounded font-medium"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                  </button>
                </div>
              )}
            </li>
          )}

          {/* Mobile Auth Buttons (non-authenticated) */}
          {open && !isAuthenticated && (
            <li className="border-t border-gray-200 md:hidden px-4 py-2">
              {mobileButtons && (
                <div className="flex flex-col gap-2">
                  {mobileButtons}
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}