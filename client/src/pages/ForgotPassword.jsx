import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthService } from "../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.forgotPassword(email);
      if (res.success) {
        toast.success(res.message);
        // Navigate to Reset Password page, passing email via state so user doesn't re-type
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-[#2c2e31] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Reset Password
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cskYellow text-halkaBlack font-bold py-2 rounded hover:bg-cskYellow  transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-textGray hover:text-cskYellow text-xs">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
