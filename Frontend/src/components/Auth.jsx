import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/operations/authAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="min-h-screen w-full bg-[#1c1c1c]/80 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 w-72 h-72 bg-zinc-800 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -right-4 -top-4 w-72 h-72 bg-zinc-900 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-zinc-700 rounded-full mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800 relative z-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300 block mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-zinc-100 placeholder-zinc-500 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-300 block mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-zinc-100 placeholder-zinc-500 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded-lg border-zinc-600 bg-zinc-700 text-zinc-300 focus:ring-zinc-600 focus:ring-offset-zinc-800"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-zinc-300"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-700 text-zinc-100 py-3 px-4 rounded-xl hover:bg-indigo-600 font-medium"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
