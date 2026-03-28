import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import GoogleLogin from "../components/GoogleLogin";
import FormModal from "../components/UI/FormModal";

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {
  const videoRef = useRef(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Login video autoplay failed:", error);
      }
    };

    const onLoaded = () => {
      tryPlay();
    };

    video.addEventListener("loadeddata", onLoaded);
    tryPlay();

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (loginErrors[name]) {
      setLoginErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (registerErrors[name]) {
      setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginErrors({});

    const newErrors = {};
    if (!loginData.username.trim()) newErrors.username = "Username is required";
    if (!loginData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      return;
    }

    setIsLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.non_field_errors?.[0] ||
            "Invalid username or password."
        );
      }

      if (data?.access) localStorage.setItem("access", data.access);
      if (data?.refresh) localStorage.setItem("refresh", data.refresh);

      window.location.href = "/account";
    } catch (error) {
      setLoginErrors({
        general: error.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterErrors({});

    const newErrors = {};

    if (!registerData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!registerData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!registerData.password2) {
      newErrors.password2 = "Please confirm your password";
    } else if (registerData.password !== registerData.password2) {
      newErrors.password2 = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setRegisterErrors(newErrors);
      return;
    }

    setIsRegisterLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          first_name: registerData.firstName,
          last_name: registerData.lastName,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const fieldErrors = {};

        if (data?.username?.[0]) fieldErrors.username = data.username[0];
        if (data?.email?.[0]) fieldErrors.email = data.email[0];
        if (data?.password?.[0]) fieldErrors.password = data.password[0];
        if (data?.detail) fieldErrors.general = data.detail;

        if (Object.keys(fieldErrors).length > 0) {
          setRegisterErrors(fieldErrors);
          return;
        }

        throw new Error("Registration failed. Please try again.");
      }

      setIsRegisterOpen(false);
      setRegisterData({
        username: "",
        email: "",
        password: "",
        password2: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      setRegisterErrors({
        general: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-page__orb login-page__orb--one" />
        <div className="login-page__orb login-page__orb--two" />
        <div className="login-page__orb login-page__orb--three" />
        <div className="login-page__noise" />
      </div>

      <div className="container">
        <motion.div
          className="login-page__layout"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <section className="login-page__copy">
            <motion.p
              className="login-page__eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
            >
              Welcome to Kickit
            </motion.p>

            <motion.h1
              className="login-page__title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.55 }}
            >
              Get back in
              <span> and start chasing it.</span>
            </motion.h1>

            <motion.p
              className="login-page__subtitle"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Jump straight in and start building bucket lists with your people.
              Big plans, little wins, chaotic group votes — all in one place.
            </motion.p>

            <motion.div
              className="login-page__pills"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.55 }}
            >
              <span>One click in</span>
              <span>Plan together</span>
              <span>Track the wins</span>
            </motion.div>

            <motion.div
              className="login-page__auth-shell"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              <div className="login-page__auth-card">
                <form className="form-stack" onSubmit={handleLoginSubmit}>
                  {loginErrors.general ? (
                    <p className="form-error-text">{loginErrors.general}</p>
                  ) : null}

                  <div className="form-field">
                    <label className="form-label" htmlFor="login-username">
                      Username
                    </label>
                    <input
                      id="login-username"
                      name="username"
                      type="text"
                      className="form-input"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      disabled={isLoginLoading}
                      autoComplete="username"
                    />
                    {loginErrors.username ? (
                      <p className="form-error-text">{loginErrors.username}</p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label className="form-label" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      disabled={isLoginLoading}
                      autoComplete="current-password"
                    />
                    {loginErrors.password ? (
                      <p className="form-error-text">{loginErrors.password}</p>
                    ) : null}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="login-button"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </div>
                </form>

                <div className="login-page__divider" aria-hidden="true">
                  <span />
                  <p>or</p>
                  <span />
                </div>

                <GoogleLogin />

                <button
                  type="button"
                  className="login-page__register-button"
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Create account
                </button>
              </div>
            </motion.div>
          </section>

          <section className="login-page__visual">
            <div className="login-page__visual-shell">
              <div className="login-page__visual-glow" />

              <div className="login-page__visual-frame">
                <div className="login-page__video-safe">
                  <video
                    ref={videoRef}
                    className="login-page__video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/hello-still.png"
                    aria-label="Animated Kickit mascot video"
                  >
                    <source src="/hello.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <FormModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Create your Kickit account"
        subtitle="Start building bucket lists with your people."
        maxWidth="max-w-2xl"
      >
        <form className="form-stack" onSubmit={handleRegisterSubmit}>
          {registerErrors.general ? (
            <p className="form-error-text">{registerErrors.general}</p>
          ) : null}

          <div className="form-field">
            <label className="form-label" htmlFor="register-username">
              Username *
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Choose a username"
              value={registerData.username}
              onChange={handleRegisterChange}
              disabled={isRegisterLoading}
              autoComplete="username"
            />
            {registerErrors.username ? (
              <p className="form-error-text">{registerErrors.username}</p>
            ) : null}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-email">
              Email *
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="your.email@example.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              disabled={isRegisterLoading}
              autoComplete="email"
            />
            {registerErrors.email ? (
              <p className="form-error-text">{registerErrors.email}</p>
            ) : null}
          </div>

          <div className="login-modal__row">
            <div className="form-field">
              <label className="form-label" htmlFor="register-firstName">
                First Name
              </label>
              <input
                id="register-firstName"
                name="firstName"
                type="text"
                className="form-input"
                placeholder="First name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                disabled={isRegisterLoading}
                autoComplete="given-name"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="register-lastName">
                Last Name
              </label>
              <input
                id="register-lastName"
                name="lastName"
                type="text"
                className="form-input"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                disabled={isRegisterLoading}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-password">
              Password *
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={registerData.password}
              onChange={handleRegisterChange}
              disabled={isRegisterLoading}
              autoComplete="new-password"
            />
            <p className="form-helper-text">
              Password must be at least 8 characters long, and not too common.
            </p>
            {registerErrors.password ? (
              <p className="form-error-text">{registerErrors.password}</p>
            ) : null}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="register-password2">
              Confirm Password *
            </label>
            <input
              id="register-password2"
              name="password2"
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              value={registerData.password2}
              onChange={handleRegisterChange}
              disabled={isRegisterLoading}
              autoComplete="new-password"
            />
            {registerErrors.password2 ? (
              <p className="form-error-text">{registerErrors.password2}</p>
            ) : null}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setIsRegisterOpen(false)}
              disabled={isRegisterLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="login-button"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </FormModal>
    </main>
  );
}

export default LoginPage;