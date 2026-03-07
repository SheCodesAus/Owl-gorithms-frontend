import { Link } from "react-router";
//import { useAuth } from "./context/AuthContext";
import "./homepage.css";

// Data lives outside the component so it isn't recreated on every render
const features = [
  {
    icon: "🪣",
    title: "Create Kickit Lists",
    desc: "Organise your dreams and goals into personalised kickit lists you can track over time.",
  },
  {
    icon: "✅",
    title: "Track Your Progress",
    desc: "Mark items as complete and watch your adventures unfold, one tick at a time.",
  },
  {
    icon: "🌍",
    title: "Share with Others",
    desc: "Inspire friends and family by sharing your kickit list and celebrating wins together.",
  },
];

function HomePage() {
  // const { isAuthenticated } = useAuth();

  return (
    <>
      {/* ── Hero section ── */}
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">Welcome to Kickit</p>
          <h1>Your life's adventures,<br />all in one place.</h1>
          <p className="hero-subtitle">
            Build, track, and share your kickit list. Whether it's climbing a
            mountain, learning to bake or deciding what activity will make it out of the group chat — Let's lock it in.
          </p>

          <div className="hero-actions">
            {/* {isAuthenticated ?*/} 
              <Link to="/buckets" className="btn btn-secondary btn-lg">
                View My Buckets →
              </Link>
              <>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Get Started — It's Free
                </Link>
                <Link to="/about" className="btn btn-outline-white btn-lg">
                  Learn More
                </Link>
              </>
          </div>
        </div>
      </section>

      {/* ── Features section ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need to live boldly</h2>
            <p>Kickit gives you the tools to turn your wish list into a done list.</p>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to start ticking things off?</h2>
          <p>Join Kickit today and make your kickit list a reality.</p>

          //{/*!isAuthenticated && (*/}
            <Link to="/login" className="btn btn-secondary btn-lg">
              Create Your Account
            </Link>
        </div>
      </section>
    </>
  );
}

export default HomePage;