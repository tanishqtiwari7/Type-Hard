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
  FaQuoteRight,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";

const Navbar = () => {
  const { user, isAuthenticated, logout, login } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  // Remove handleDevLogin completely or comment it out if you want to keep reference
  // ...

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
        <NavLink to="/quotes" icon={<FaQuoteRight />} label="Quotes" />
        <NavLink to="/about" icon={<FaInfoCircle />} label="About" />
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <Link
              to={`/profile/${user.username}`}
              className="flex flex-col items-end hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-textWhite text-sm font-medium">
                {user.username}
              </span>
              <span className="text-xs text-textGray">Lvl. 1</span>
            </Link>
            <button
              onClick={logout}
              className="text-textGray hover:text-error transition-colors p-2 rounded-full hover:bg-white/5"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-textGray hover:text-textWhite transition-colors text-sm font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-textWhite text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-cskYellow transition-colors"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 text-textGray hover:text-textWhite transition-all hover:bg-white/10 px-4 py-2 rounded-full duration-200 group"
  >
    <span className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
      {icon}
    </span>
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export default Navbar;
