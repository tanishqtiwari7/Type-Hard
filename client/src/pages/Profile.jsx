import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import { UserService } from "../services/user.service";
import {
  FaUserCircle,
  FaChartLine,
  FaHistory,
  FaMedal,
  FaSignOutAlt,
} from "react-icons/fa";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useStore();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const profileData = await UserService.getProfile(username);
        if (profileData.success) {
          setProfile(profileData.profile);
          setStats(profileData.stats);
        }

        const historyData = await UserService.getHistory(username);
        if (historyData.success) {
          setHistory(historyData.history);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) loadData();
  }, [username]);

  if (loading)
    return (
      <div className="text-center pt-20 text-textGray">Loading Profile...</div>
    );
  if (!profile)
    return <div className="text-center pt-20 text-error">User not found</div>;

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cskYellow/20 bg-[#2c2e31] flex items-center justify-center">
          {profile.picture ? (
            <img
              src={profile.picture}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-20 h-20 text-textGray opacity-50" />
          )}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-textWhite font-mono mb-2">
            {profile.username}
          </h1>
          <div className="text-textGray text-sm font-mono mb-4">
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </div>
          <div className="inline-block bg-[#2c2e31] px-3 py-1 rounded text-xs text-cskYellow border border-cskYellow/20 uppercase tracking-widest">
            {profile.role}
          </div>

          {currentUser && currentUser.username === profile.username && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="block mt-4 text-red-400 hover:text-red-300 text-sm font-mono flex items-center gap-2 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/10 transition-all"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          )}
        </div>

        {/* Big Stats */}
        <div className="ml-auto flex gap-6 md:gap-12">
          <StatBox
            label="Tests Taken"
            value={stats?.tests_taken || 0}
            icon={<FaHistory />}
          />
          <StatBox
            label="Avg WPM"
            value={stats?.avg_wpm || 0}
            icon={<FaChartLine />}
          />
          <StatBox
            label="High Score"
            value={stats?.high_score_wpm || 0}
            icon={<FaMedal />}
            isHighlight
          />
        </div>
      </div>

      {/* History Grid */}
      <h2 className="text-2xl text-textWhite font-bold mb-6 font-mono border-b border-white/5 pb-4">
        Recent Tests
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.length === 0 ? (
          <div className="text-textGray col-span-full py-8 text-center italic">
            No tests taken yet.
          </div>
        ) : (
          history.map((test, i) => (
            <div
              key={i}
              className="bg-[#2c2e31] p-4 rounded-lg border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors group"
            >
              <div>
                <div className="text-3xl font-bold text-textWhite group-hover:text-cskYellow transition-colors">
                  {test.wpm}{" "}
                  <span className="text-xs text-textGray font-normal">WPM</span>
                </div>
                <div className="text-xs text-textGray mt-1">
                  {new Date(test.created_at).toLocaleDateString()} &bull;{" "}
                  {test.test_type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-textGray opacity-70">
                  {test.accuracy}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-textGray opacity-50">
                  ACC
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon, isHighlight }) => (
  <div className="group text-center">
    <div className="text-textGray text-xs uppercase tracking-widest mb-1 flex justify-center items-center gap-2">
      <span className="opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>{" "}
      {label}
    </div>
    <div
      className={`text-4xl font-black font-mono ${
        isHighlight ? "text-cskYellow" : "text-textWhite"
      }`}
    >
      {value}
    </div>
  </div>
);

export default Profile;
