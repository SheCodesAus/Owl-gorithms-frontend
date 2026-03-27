import { motion } from "framer-motion";
import GoogleLogin from "../components/GoogleLogin";

function LoginPage() {
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
              Jump straight in and start building bucket lists with your
              people. Big plans, little wins, chaotic group votes — all in
              one place.
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
                <GoogleLogin />
              </div>
            </motion.div>
          </section>

          <section className="login-page__visual">
            <motion.div
              className="login-page__visual-shell"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <div className="login-page__visual-glow" />

              <motion.div
                className="login-page__visual-frame"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <video
                  className="login-page__video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/login-poster.jpg"
                  aria-label="Animated Kickit mascot video"
                >
                  <source src="/hello.webm" type="video/webm" />
                  <source src="/hello.mp4" type="video/mp4" />
                </video>
              </motion.div>

            </motion.div>
          </section>
        </motion.div>
      </div>
    </main>
  );
}

export default LoginPage;