import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NavBar from "./NavBar";

export default function Header() {
  const { isAuthenticated, logout, loading, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/"); // redirect home
    alert("✅ Logged out successfully!");
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // if the click is outside dropdown
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't render auth buttons while checking authentication
  if (loading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">SolveHub</div>
            <div>Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  // Mobile buttons for non-authenticated users
  const mobileButtons = !isAuthenticated ? (
    <>
      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200"
      >
        Sign In
      </button>
      <button
        onClick={() => navigate("/register")}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Register
      </button>
    </>
  ) : null;

  // Get user initials for avatar
  const getInitials = (fullName) => {
    return fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "U";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 overflow-visible">
      <div className="container mx-auto px-4 py-4 overflow-visible">
        {/* Top row: Logo and Mobile Menu Toggle */}
        <div className="flex items-center justify-between mb-0 md:mb-0">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600 cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>
            SolveHub
          </div>

          {/* Right side: Navigation and Auth */}
          <div className="flex items-center gap-4">
            {/* Navigation (includes hamburger on mobile) */}
            <NavBar mobileButtons={mobileButtons} />
    
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition duration-200"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(user?.full_name)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {user?.full_name || "Profile"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 max-h-96 overflow-y-auto">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">View Profile</span>
                      </button>

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition font-medium"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Register
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </header>
  );
}