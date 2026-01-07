import React from "react";

const Navlinks = [
  { name: "type", to: "/" },
  { name: "multiplayer", to: "#" },
  { name: "leaderboard", to: "#" },
  { name: "profile", to: "#" },
];

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-1 md:px-100 bg-halkaBlack border-b border-gray-700 font-mono">
      <div>
        <span className="text-cskYellow text-base md:text-lg font-bold">
          Type-Hard
        </span>
      </div>
      <div className="flex gap-2 md:gap-10">
        {Navlinks.map((link) => (
          <a
            key={link.name}
            href={link.to}
            className="text-cskYellow hover:text-cskYellow-100 text-sm md:text-md font-semibold"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
