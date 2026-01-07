import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Multiplayer from "./pages/Multiplayer.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import QuoteHub from "./pages/QuoteHub.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-darkBg)] text-[var(--color-textGray)] font-mono selection:bg-[var(--color-cskYellow)] selection:text-[var(--color-halkaBlack)]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
        <Navbar />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
            <Route path="/quotes" element={<QuoteHub />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
