import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateUsername, validatePassword } from "../utils/validators";
import { sanitizeUsername, sanitizePassword } from "../utils/sanitizer";

import googleIcon from "../assets/images/google.svg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    alert("Google login clicked");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setError(null);

    const cleanedUsername = sanitizeUsername(username);
    const cleanedPassword = sanitizePassword(password);

    const newErrors = {};

    if (!cleanedUsername) {
      newErrors.username = "Username is required.";
    } else if (!validateUsername(cleanedUsername)) {
      newErrors.username =
        "Username must be 3 to 20 characters and use only letters, numbers, or underscores.";
    }

    if (!cleanedPassword) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(cleanedPassword)) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      await login(cleanedUsername, cleanedPassword);

      setSuccess(true);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-start justify-center px-4 pt-10 pb-10 mb-8">
      <div className="bg-card w-full max-w-6xl border border-border rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 min-h-[260px] md:min-h-[650px]">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80"
            alt="Register"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 md:p-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome back, DORC.
            </h2>
            <p className="text-sm md:text-base text-white/90 max-w-sm">
              Your fellow DORCs have been waiting for you! Sign in to track your
              quests and conquer your day.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center">
          <div className="w-full max-w-md mx-auto px-6 py-8 sm:px-8 md:px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="mb-2">
                <h1 className="text-fg text-left text-3xl font-bold">
                  Sign In
                </h1>
                <p className="text-sm text-fg/70 mt-2">
                  Fill in your details to get started.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                  className={`p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.username ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.username && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.username}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className={`p-3 rounded-full bg-bg border text-fg outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.password ? "border-red-500" : "border-border"
                  }`}
                />
                {errors.password && (
                  <span className="text-sm text-red-500 px-2">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="bg-accent text-white p-3 px-7 rounded-full font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {success && (
                <span className="text-sm text-center text-green-600">
                  Signed in successfully
                </span>
              )}

              {error && (
                <span className="text-sm text-center text-red-500">
                  {error}
                </span>
              )}

              <div>
                <p className="text-center">or</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-full border border-border bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>

              <p className="text-sm text-center text-fg/70 mt-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-accent font-medium cursor-pointer"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
