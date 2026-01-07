import React from "react";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-halkaBlack text-white font-mono">

              <Navbar />
         
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-cskYellow mb-4">
          Type-Hard
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
          Master your typing skills with our fast, accurate, and fun typing test
          platform. Challenge yourself, compete with others, and track your
          progress.
        </p>
        <button className="bg-cskYellow text-black px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition">
          Start Typing Test
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-cskYellow mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-cskYellow mb-2">
              Typing Test
            </h3>
            <p className="text-gray-300">
              Take timed typing tests to improve your WPM and accuracy. Choose
              from various difficulties and themes.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-cskYellow mb-2">
              Multiplayer
            </h3>
            <p className="text-gray-300">
              Compete in real-time with other typists around the world. See live
              leaderboards and race against friends.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-cskYellow mb-2">
              Leaderboard
            </h3>
            <p className="text-gray-300">
              Track your progress and compare with global rankings. Climb the
              charts and become a typing champion.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-cskYellow mb-4">
          Ready to Type Hard?
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands of typists improving their skills every day.
        </p>
        <button className="bg-cskYellow text-black px-6 py-3 rounded font-semibold hover:bg-yellow-300 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;
