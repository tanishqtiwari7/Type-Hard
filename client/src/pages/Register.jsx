import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import useStore from "../store/useStore";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
        login(res.user, res.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex justify-center mb-6 text-green-400 text-4xl">
          <FaUserPlus />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-textWhite">
          Join Type Hard
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-mono mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-green-400 transition-colors"
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
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-green-400 transition-colors"
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
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-green-400 transition-colors"
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
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-green-400 transition-colors"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-gray-900 font-bold py-3 rounded hover:bg-green-400 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
