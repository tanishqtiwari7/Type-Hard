import React, { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";
import { AuthService } from "../services/auth.service";
import {
  FaUser,
  FaKeyboard,
  FaTrophy,
  FaUsers,
  FaSignInAlt,
  FaInfoCircle,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";

const Navbar = () => {
  const { user, isAuthenticated, logout, login } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Simulated "Dev Login" for Enterprise Demo
  // In production with a real domain, this would use the actual Google OAuth SDK
  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      // Simulating the payload Google would return
      const googleAuthPayload = {
        googleId: "dev-id-" + Math.floor(Math.random() * 100000),
        email: "dev.user" + Math.floor(Math.random() * 1000) + "@typehard.com",
        name: "Dev User",
        picture: "",
      };

      // Use the new AuthService
      const response = await AuthService.loginGoogle(googleAuthPayload);

      if (response.success) {
        login(response.user, response.token);
      }
    } catch (error) {
      console.error("Login Failed", error);
      alert(
        "Connection to backend failed. Ensure server is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="w-full max-w-7xl mx-auto flex justify-between items-center py-8 px-6 md:px-12 select-none z-50 relative">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="text-3xl text-cskYellow transition-transform group-hover:-rotate-12 duration-300">
          <FaKeyboard />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-textWhite leading-none group-hover:text-cskYellow transition-colors">
            Type Hard
          </span>
          <span className="text-xs text-textGray tracking-widest group-hover:tracking-[0.2em] transition-all duration-300">
            EST. 2026
          </span>
        </div>
      </Link>

      {/* Center Navigation - Hidden on small mobile */}
      <div className="hidden md:flex gap-8 items-center bg-halkaBlack/30 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm border border-white/5">
        <NavLink to="/" icon={<FaKeyboard />} label="Type" />
        <NavLink to="/leaderboard" icon={<FaTrophy />} label="Top" />
        <NavLink to="/multiplayer" icon={<FaUsers />} label="Versus" />
        <NavLink to="/about" icon={<FaInfoCircle />} label="About" />
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="flex flex-col items-end">
              <span className="text-textWhite text-sm font-medium">
                {user.username}
              </span>
              <span className="text-xs text-textGray">Lvl. 1</span>
            </div>
            <button
              onClick={logout}
              className="text-textGray hover:text-error transition-colors p-2 rounded-full hover:bg-white/5"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDevLogin}
            disabled={isLoading}
            className="flex items-center gap-2 text-textGray hover:text-textWhite transition-colors text-sm font-semibold group disabled:opacity-50"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaSignInAlt className="group-hover:translate-x-1 transition-transform" />
            )}
            <span>{isLoading ? "Logging in..." : "Dev Login"}</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-textGray hover:text-textWhite transition-colors text-sm font-medium"
  >
    <span className="text-xs opacity-70">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default Navbar;
