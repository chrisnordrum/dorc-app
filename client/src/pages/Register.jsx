import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  // Form input states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Form status states
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setError(null);

    try {
      setLoading(true);

      // Pass the form data to the register function
      await register(username, password);

      setSuccess(true);

      // Redirect to Quest page
      navigate("/quest");
    } catch (error) {
      //setError(error.message);
      console.error(error.message); // remove this later
      setError("Registration is not connected yet"); // just for now
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
              Ready to be a DORC?
            </h2>
            <p className="text-sm md:text-base text-white/90 max-w-sm">
              Join our community today and create your account in just a few
              steps.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center">
          <div className="w-full max-w-md mx-auto px-6 py-8 sm:px-8 md:px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="mb-2">
                <h1 className="text-fg text-left text-3xl font-bold">
                  Create Your Account
                </h1>
                <p className="text-sm text-fg/70 mt-2">
                  Fill in your details to get started.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <label className="sr-only">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="p-3 rounded-full bg-bg border border-border text-fg w-full outline-none focus:ring-2 focus:ring-accent/30"
                />

                <label className="sr-only">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="p-3 rounded-full bg-bg border border-border text-fg w-full outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <input
                type="email"
                placeholder="Email"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <button
                disabled={loading}
                type="submit"
                className="bg-accent text-white p-3 px-7 rounded-full font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

              {success && (
                <span className="text-sm text-center text-green-600">
                  Account created successfully
                </span>
              )}
              {error && (
                <span className="text-sm text-center text-red-500">
                  {error}
                </span>
              )}

              <p className="text-sm text-center text-fg/70 mt-2">
                Already have an account?{" "}
                <span className="text-accent font-medium cursor-pointer">
                  Sign in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
