import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/use-auth";

import iconCreateList from "../assets/icon-create-list.svg?url";
import iconTrackProgress from "../assets/icon-track-progress.svg?url";
import iconShareOthers from "../assets/icon-share-others.svg?url";
import logo from "../assets/kickit_logo_text.png";

const features = [
  {
    icon: iconCreateList,
    title: "Create Kickit Lists",
    desc: "Organise your dreams and goals into personalised kickit lists you can track over time.",
  },
  {
    icon: iconTrackProgress,
    title: "Track Your Progress",
    desc: "Mark items as complete and watch your adventures unfold, one tick at a time.",
  },
  {
    icon: iconShareOthers,
    title: "Share with Others",
    desc: "Inspire friends and family by sharing your kickit list and celebrating wins together.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const softScaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function HomePage() {
  const { auth } = useAuth();

  const primaryHref = auth?.access ? "/dashboard" : "/login";
  const primaryLabel = auth?.access ? "Go to Dashboard" : "Get Started";

  return (
    <>
      <section className="homepage-hero">
        <div className="homepage-hero__bg" aria-hidden="true">
          <div className="homepage-hero__orb homepage-hero__orb--one" />
          <div className="homepage-hero__orb homepage-hero__orb--two" />
          <div className="homepage-hero__orb homepage-hero__orb--three" />
          <div className="homepage-hero__noise" />
        </div>

        <div className="container">
          <div className="homepage-hero__layout">
            <motion.div
              className="homepage-hero__copy"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p className="homepage-hero__eyebrow" variants={fadeUp}>
                your life&apos;s not going to live itself
              </motion.p>

              <motion.h1 className="homepage-hero__title" variants={fadeUp}>
                Make someday
                <span> actually happen.</span>
              </motion.h1>

              <motion.p className="homepage-hero__subtitle" variants={fadeUp}>
                Turn ideas into plans, plans into memories, and all those “we
                should do that” moments into something real.
              </motion.p>

              <motion.div className="homepage-hero__actions" variants={fadeUp}>
                <Link
                  to={primaryHref}
                  className="homepage-btn homepage-btn--primary"
                >
                  {primaryLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>

              <motion.div
                className="homepage-hero__pills"
                variants={staggerContainer}
              >
                {["Dream bigger", "Track the wins", "Do it together"].map(
                  (pill) => (
                    <motion.span key={pill} variants={fadeUp}>
                      {pill}
                    </motion.span>
                  ),
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="homepage-hero__visual"
              variants={softScaleIn}
              initial="hidden"
              animate="show"
            >
              <motion.div
                className="homepage-hero__visual-shell"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="homepage-hero__visual-glow" />

                <motion.div
                  className="homepage-hero__visual-frame"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <video
                    className="homepage-hero__video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/bucket-poster.jpg"
                    aria-label="Animated Kickit bucket character"
                  >
                    <source src="/celebrate.webm" type="video/webm" />
                    <source src="/celebrate.mp4" type="video/mp4" />
                  </video>
                </motion.div>

                <motion.div
                  className="homepage-hero__badge homepage-hero__badge--top"
                  initial={{ opacity: 0, y: 16, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.55, duration: 0.55, ease: "easeOut" }}
                >
                  Big dreams. Real plans.
                </motion.div>

                <motion.div
                  className="homepage-hero__badge homepage-hero__badge--bottom"
                  initial={{ opacity: 0, y: 16, rotate: 2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.72, duration: 0.55, ease: "easeOut" }}
                >
                  Tick things off for real
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="homepage-features"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="homepage-section-heading" variants={fadeUp}>
            <div className="homepage-section-heading__tag">🔥 Why Kickit?</div>
            <h2>Dead simple. Actually fun.</h2>
            <p>
              No fluff, no faff. Just the tools to turn &quot;I&apos;ve always
              wanted to…&quot; into &quot;done that.&quot;
            </p>
          </motion.div>

          <div className="homepage-features__grid">
            {features.map((feature, index) => (
              <motion.article
                className={`homepage-feature-card homepage-feature-card--${
                  index + 1
                }`}
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="homepage-feature-card__header">
                  <div className="homepage-feature-card__icon">
                    <img src={feature.icon} alt="" aria-hidden="true" />
                  </div>
                  <h3>{feature.title}</h3>
                </div>

                <p>{feature.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="homepage-cta"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="homepage-cta__panel">
            <div className="homepage-cta__glow" aria-hidden="true" />

            <div className="homepage-cta__content">
              <h2>
                Still just <span>thinking</span> about it?
              </h2>
              <p>
                Yeah, nah. Build your list and start ticking things off. Your
                future self will thank you.
              </p>

              <Link
                to={primaryHref}
                className="homepage-btn homepage-btn--light"
              >
                {primaryLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="homepage-footer">
        <div className="container">
          <div className="homepage-footer__inner">
            <div className="homepage-footer__logo">
              <img src={logo} alt="Kickit" />
            </div>

            <ul className="homepage-footer__links">
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>

            <p className="homepage-footer__copy">
              © 2026 Kickit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
