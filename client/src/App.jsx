import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";

// Inline simple placeholders for missing pages until we build them
const Leaderboard = () => (
  <div className="text-white text-center pt-20">Leaderboard Coming Soon</div>
);
const Multiplayer = () => (
  <div className="text-white text-center pt-20">Multiplayer Coming Soon</div>
);
const About = () => (
  <div className="text-white text-center pt-20">About Type Hard</div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-darkBg)] text-[var(--color-textGray)] font-mono selection:bg-[var(--color-cskYellow)] selection:text-[var(--color-halkaBlack)]">
        <Navbar />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
