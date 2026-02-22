import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import useStore from "../store/useStore";
import { FaUserPlus, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Register Form, 2: OTP Verification
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await AuthService.register(
        formData.username,
        formData.email,
        formData.password
      );
      if (res.success) {
        toast.success(res.message);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await AuthService.verifyEmail(formData.email, otp);
      if (res.success) {
        toast.success(res.message);
        login(res.user, res.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2c2e31] p-8 rounded-lg  shadow-lg">
        <div className="flex justify-center mb-6 text-cskYellow text-4xl">
          {step === 1 ? <FaUserPlus /> : <FaEnvelope />}
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-textWhite">
          {step === 1 ? "Join Type Hard" : "Verify Email"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full bg-[#1e1e1e]  rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#1e1e1e]  rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-[#1e1e1e]  rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full bg-[#1e1e1e]  rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cskYellow text-halkaBlack font-bold py-3 rounded hover:bg-cskYellow  transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Creating Account..." : "Next"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-gray-400 text-center text-sm mb-4">
              We sent a 6-digit code to <strong>{formData.email}</strong>.
            </p>
            <div>
              <label className="block text-gray-400 text-sm font-mono mb-1">
                Verification Code
              </label>
              <input
                type="text"
                name="otp"
                required
                maxLength="6"
                className="w-full bg-[#1e1e1e]  rounded p-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-cskYellow transition-colors"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cskYellow text-halkaBlack font-bold py-3 rounded hover:bg-cskYellow  transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-white"
              >
                Change Email / Back
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cskYellow hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
