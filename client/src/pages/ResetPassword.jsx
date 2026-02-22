import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthService } from "../services/auth.service";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.resetPassword(email, otp, newPassword);
      if (res.success) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-[#2c2e31] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Set New Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cskYellow"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Reset Code (OTP)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cskYellow tracking-widest text-center text-lg"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cskYellow"
              placeholder="New secure password"
              required
              minLength="6"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cskYellow text-halkaBlack font-bold py-2 rounded hover:bg-cskYellow  transition-colors disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-gray-400 hover:text-white text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
