import React from "react";
import { FaGithub, FaTwitter, FaCode } from "react-icons/fa";

const About = () => {
  return (
    <div className="flex flex-col items-center pt-12 min-h-[80vh] text-textGray max-w-3xl mx-auto px-6">
      <h1 className="text-5xl font-bold text-textWhite mb-2 font-mono">
        Type Hard
      </h1>
      <p className="text-cskYellow font-mono mb-12">
        Enterprise Grade Typing Experience
      </p>

      <section className="mb-12 space-y-6 text-lg leading-relaxed font-mono text-justify">
        <p>
          Type Hard is a modern, minimalist typing test designed to help you
          improve your typing speed and accuracy without distractions. Built
          with performance and aesthetics in mind, it provides a clean
          environment for both casual typists and competitive enthusiasts.
        </p>
        <p>
          Our platform features real-time multiplayer racing, comprehensive
          analytics, and a weekly "community quote" system where users verify
          submissions using AI moderation.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
        <FeatureCard
          title="Clean UI"
          desc="Distraction-free interface inspired by Monkeytype, powered by Tailwind & GSAP."
        />
        <FeatureCard
          title="Multiplayer"
          desc="Challenge friends in real-time rooms with live progress tracking via Socket.io."
        />
        <FeatureCard
          title="Analytics"
          desc="Track your WPM, accuracy, and consistency over time with detailed charts."
        />
      </div>

      <div className="flex gap-6 mt-auto mb-10">
        <SocialLink icon={<FaGithub />} label="GitHub" href="#" />
        <SocialLink icon={<FaTwitter />} label="Twitter" href="#" />
        <SocialLink icon={<FaCode />} label="Source" href="#" />
      </div>

      <div className="text-xs opacity-30 font-mono">
        Version 1.0.0 &bull; Build 2026
      </div>
    </div>
  );
};

const FeatureCard = ({ title, desc }) => (
  <div className="bg-[#2c2e31] p-6 rounded-lg border border-white/5 hover:border-cskYellow/50 transition-colors group">
    <h3 className="text-textWhite font-bold mb-2 group-hover:text-cskYellow transition-colors">
      {title}
    </h3>
    <p className="text-sm opacity-70">{desc}</p>
  </div>
);

const SocialLink = ({ icon, label, href }) => (
  <a
    href={href}
    className="flex items-center gap-2 text-textGray hover:text-textWhite transition-colors"
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default About;
