import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import GoogleLogin from "../components/GoogleLogin";
import postLogin from "../api/post-login";
import { useAuth } from "../hooks/use-auth";
import { completeLogin } from "../utils/completeLogin";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { id, value } = event.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await postLogin(credentials.username, credentials.password);
      const { access, refresh } = response;

      window.localStorage.setItem("access", access);
      if (refresh) window.localStorage.setItem("refresh", refresh);

      await completeLogin({ access, refresh, setAuth, navigate });
    } catch (error) {
      setErrors({ non_field_errors: [error.message] });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted-text)]">
            Welcome back
          </p>
          <h1 className="brand-font mt-2 text-4xl font-bold text-[var(--heading-text)]">
            Log in
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-text)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--primary-cta)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="section-card p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="form-stack">
            {/* Username */}
            <div className="form-field">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="your_username"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="form-input pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--muted-text)] transition hover:text-[var(--heading-text)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {errors.non_field_errors && (
              <motion.p
                className="form-error-text text-center"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.non_field_errors.join(" ")}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="primary-gradient-button mt-2 w-full rounded-full py-3.5 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="relative my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--dividers)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-text)]">
              or
            </span>
            <div className="h-px flex-1 bg-[var(--dividers)]" />
          </div>

          <GoogleLogin />
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;