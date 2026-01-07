import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import useStore from "../store/useStore";
import { FaKeyboard } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await AuthService.login(email, password);
      if (res.success) {
        login(res.user, res.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex justify-center mb-6 text-cskYellow text-4xl">
          <FaKeyboard />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-textWhite">
          Login to Type Hard
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-cskYellow transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cskYellow text-halkaBlack font-bold py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-cskYellow hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
