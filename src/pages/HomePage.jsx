import { Link } from "react-router";
//import { useAuth } from "./context/AuthContext";
import "./homepage.css";

// SVG icons 
import iconCreateList from "../assets/icon-create-list.svg?url";
import iconTrackProgress from "../assets/icon-track-progress.svg?url";
import iconShareOthers from "../assets/icon-share-others.svg?url";


// Logo
import logo from "../assets/kickit_logo_text.png";

// Data lives outside the component so it isn't recreated on every render
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

const publicList = [
  {
    emoji: "✈️",
    title: "Places to See Before 30",
    owner: "adventurejess",
    category: "travel",
    items: [
      { text: "Northern Lights in Iceland", done: true },
      { text: "Sunrise at Angkor Wat", done: true },
      { text: "Road trip across New Zealand", done: false },
      { text: "Sleep under stars in the Sahara", done: false },
    ],
  },
  {
    emoji: "🍜",
    title: "Ultimate Food Bucket List",
    owner: "hungrymark",
    category: "food",
    items: [
      { text: "Eat ramen in Tokyo", done: true },
      { text: "Authentic Neapolitan pizza", done: true },
      { text: "Street food tour in Bangkok", done: true },
      { text: "Cook paella in Valencia", done: false },
    ],
  },
  {
    emoji: "🏔️",
    title: "Adrenaline Junkies Only",
    owner: "sendit_sam",
    category: "adventure",
    items: [
      { text: "Skydive over the Reef", done: true },
      { text: "Bungee jump in Queenstown", done: false },
      { text: "Cage dive with sharks", done: false },
      { text: "Paraglide in the Swiss Alps", done: false },
    ],
  },
  {
    emoji: "🎨",
    title: "Creative Things to Try",
    owner: "luna.creates",
    category: "creative",
    items: [
      { text: "Learn pottery from scratch", done: true },
      { text: "Paint a self-portrait", done: false },
      { text: "Write and record a song", done: false },
      { text: "Build something with my hands", done: false },
    ],
  },
  {
    emoji: "💪",
    title: "Fitness Milestones",
    owner: "coach_riley",
    category: "fitness",
    items: [
      { text: "Run a half marathon", done: true },
      { text: "Hold a 2-minute plank", done: true },
      { text: "Complete a triathlon", done: false },
      { text: "Do 10 unbroken pull-ups", done: false },
    ],
  },
  {
    emoji: "🎉",
    title: "Epic Group Chat Ideas",
    owner: "the_squad",
    category: "social",
    items: [
      { text: "Rent a house and do nothing", done: true },
      { text: "Music festival road trip", done: false },
      { text: "Sunrise hike then beach day", done: false },
      { text: "Cook-off challenge night", done: false },
    ],
  },
];

function HomePage() {
  // const { isAuthenticated } = useAuth();

  return (
    <>
      {/* ── Hero section ── */}
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">Life's too short for "maybe later"</p>
          <h1>Stop Planning<br />Start kicking it</h1>
          <p className="hero-subtitle">
                            Build your ultimate bucket list, track what you've smashed, and
                share the wins. Whether it's solo, with mates, or the group
                chat — let's actually do the thing.
          </p>

          <div className="hero-actions">
            {/* {isAuthenticated ?*/} 
              <Link to="/buckets" className="btn btn-secondary btn-lg">
                View My Buckets →
              </Link>
              <>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
                {/* ── TODO Update this link no about exists── */}
                <Link to="/" className="btn btn-outline-white btn-lg">
                  How It Works
                </Link>
              </>
          </div>
        </div>
      </section>
      

      {/* ── Features section ── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🔥 Why Kickit?</div>
            <h2>Dead simple. Actually fun.</h2>
            <p>
              No fluff, no faff. Just the tools to turn "I've always wanted
              to…" into "done that."
            </p>
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

      {/* ── PUBLIC BUCKET LISTS ── 
      <section className="public-lists-section">
        <div className="container">
          <div className="public-lists-header">
            <div>
              <div className="section-tag">🌍 Community</div>
              <h2>What people are kicking</h2>
              <p>
                Real lists from real people. Get inspired, get jealous, get
                moving.
              </p>
            </div>
            <Link to="/explore" className="btn btn-outline-navy">
              Explore All Lists
            </Link>
          </div>

          <div className="bucket-grid">
            {publicLists.map((list) => {
              const doneCount = list.items.filter((i) => i.done).length;
              const total = list.items.length;
              const pct = Math.round((doneCount / total) * 100);

              return (
                <div className="bucket-card" key={list.title}>
                
                  {/* Header 
                  <div className={`bucket-card-header ${list.category}`}>
                    <span className="bucket-emoji">{list.emoji}</span>
                    <div>
                      <h3>{list.title}</h3>
                      <span className="bucket-author">@{list.author}</span>
                    </div>
                  </div>

                  {/* Items preview 
                  <div className="bucket-card-body">
                    {list.items.map((item) => (
                      <div
                        className={`bucket-item${item.done ? " completed" : ""}`}
                        key={item.text}
                      >
                        <span
                          className={`bucket-item-check${item.done ? " done" : ""}`}
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>.  --------------*/}

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2>
              Still just <span>thinking</span> about it?
            </h2>
            <p>
              Yeah, nah. Sign up, build your list, and start ticking things
              off. Your future self will thank you.
            </p>
            {/* {!isAuthenticated && ( */}
            <Link to="/login" className="btn btn-secondary btn-lg">
              Create Your Account →
            </Link>
            {/* )} */}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="logo">
              <img src={logo} alt="Kickit" />
            </div>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
            <p className="copy">© 2026 Kickit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;