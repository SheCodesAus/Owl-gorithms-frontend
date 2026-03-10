import { useState } from "react";
import { useParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";

// Kickit Colours
const COLORS = {
  primary: "#6B4EAA",
  accent: "#FF5A5F",
  border: "#A78BFA",
  bodyText: "#0F172A",
  mutedText: "#6B6880",
  surface: "#EEEAF7",
  ctaText: "#FFFFFF",
  background: "#F7F6FB",
  white: "#FFFFFF",
};

// Icons
const GlobeIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// Mock Data
const MOCK_DATA = {
  id: 1,
  title: "European Adventure 2026",
  description: "All the things we want to see and do on our big Europe trip!",
  is_public: true,
  is_open: true,
  date_created: "2025-12-15T09:00:00Z",
  has_deadline: true,
  deadline: "2026-12-31T00:00:00Z",
  owner: { username: "chelsea_m" },
  items: [
    {
      id: 1,
      title: "Visit the Eiffel Tower",
      description: "Go at sunset for the best view",
      tag: "travel",
      is_completed: true,
      completed_at: "2026-03-01T14:00:00Z",
      date_created: "2025-01-15T09:00:00Z",
      created_by: { username: "chelsea_m" },
    },
    {
      id: 2,
      title: "Authentic pasta making class / experience",
      description: "Find a local trattoria or Nonna! No tourist traps!",
      tag: "food",
      is_completed: false,
      date_created: "2025-01-15T09:00:00Z",
      created_by: { username: "sarah_j" },
    },
    {
      id: 3,
      title: "Hike in the Swiss Alps",
      description: "Grindelwald or Zermatt",
      tag: "adventure",
      is_completed: false,
      date_created: "2026-01-16T10:00:00Z",
      created_by: { username: "chelsea_m" },
    },
    {
      id: 4,
      title: "Morning yoga in Barcelona",
      tag: "wellness",
      is_completed: false,
      date_created: "2026-01-17T08:00:00Z",
      created_by: { username: "mia_k" },
    },
    {
      id: 5,
      title: "Attend a local festival",
      description: "Experience real European culture",
      tag: "social",
      is_completed: false,
      date_created: "2025-12-18T11:00:00Z",
      created_by: { username: "sarah_j" },
    },
    {
      id: 6,
      title: "Take a cooking class in Florence",
      tag: "learning",
      is_completed: true,
      completed_at: "2026-02-20T16:00:00Z",
      date_created: "2026-01-19T09:00:00Z",
      created_by: { username: "chelsea_m" },
    },
    {
      id: 7,
      title: "Sketch the Colosseum",
      description: "Bring the sketchbook!",
      tag: "creative",
      is_completed: false,
      date_created: "2026-01-20T10:00:00Z",
      created_by: { username: "mia_k" },
    },
  ],
};

const MOCK_DATA_2 = {
  id: 2,
  title: "Jones Family Bucket List 2026",
  description:
    "Things we want to do together as a family this year — big and small!",
  is_public: false,
  is_open: true,
  date_created: "2025-12-01T08:00:00Z",
  has_deadline: true,
  deadline: "2026-12-31T00:00:00Z",
  owner: { username: "bill_smithy" },
  items: [
    {
      id: 1,
      title: "Road trip along the Great Ocean Road",
      description: "Stay at least 3 nights, stop at every lookout",
      tag: "travel",
      is_completed: false,
      date_created: "2025-02-01T08:00:00Z",
      created_by: { username: "jan_smith" },
    },
    {
      id: 2,
      title: "Sunday dumpling making at home",
      description: "Grandma's recipe, everyone helps",
      tag: "food",
      is_completed: true,
      completed_at: "2025-02-15T12:00:00Z",
      date_created: "2025-02-01T08:00:00Z",
      created_by: { username: "mary_smith" },
    },
    {
      id: 3,
      title: "Try a family surf lesson",
      description: "Even Dad has to get in the water",
      tag: "adventure",
      is_completed: false,
      date_created: "2025-02-02T09:00:00Z",
      created_by: { username: "bill_smithy" },
    },
    {
      id: 4,
      title: "Digital detox weekend",
      description: "No phones Friday night to Sunday morning",
      tag: "wellness",
      is_completed: false,
      date_created: "2025-02-03T10:00:00Z",
      created_by: { username: "mary_smith" },
    },
    {
      id: 5,
      title: "Host a big family games night",
      description: "Invite the cousins, make it a tournament",
      tag: "social",
      is_completed: true,
      completed_at: "2025-03-10T19:00:00Z",
      date_created: "2025-02-04T11:00:00Z",
      created_by: { username: "mary_smith" },
    },
    {
      id: 6,
      title: "Visit a local museum together",
      description: "Melbourne Museum — check the dinosaur exhibit",
      tag: "learning",
      is_completed: false,
      date_created: "2025-02-05T09:00:00Z",
      created_by: { username: "jan_smith" },
    },
    {
      id: 7,
      title: "Harry Styles Concert",
      description: "Disco, lots",
      tag: "creative",
      is_completed: false,
      date_created: "2025-02-06T10:00:00Z",
      created_by: { username: "bill_smithy" },
    },
  ],
};

const MOCK_DATA_3 = {
  id: 3,
  title: "NZ Girls Getaway 🥝",
  description:
    "Long weekend in New Zealand — Queenstown bound. No boys, no excuses.",
  is_public: false,
  is_open: true,
  date_created: "2026-03-01T09:00:00Z",
  has_deadline: true,
  deadline: "2026-07-20T00:00:00Z",
  owner: { username: "sarah_j" },
  items: [
    {
      id: 1,
      title: "Fly into Queenstown",
      description: "Book the window seats, obvs",
      tag: "travel",
      is_completed: true,
      completed_at: "2025-03-15T10:00:00Z",
      date_created: "2025-03-01T09:00:00Z",
      created_by: { username: "sarah_j" },
    },
    {
      id: 2,
      title: "Eat at Fergburger",
      description: "The queue is worth it, go at 10pm",
      tag: "food",
      is_completed: false,
      date_created: "2025-03-01T09:00:00Z",
      created_by: { username: "mia_k" },
    },
    {
      id: 3,
      title: "Bungee jump at Kawarau Bridge",
      description: "The original bungee — 43 metres!",
      tag: "adventure",
      is_completed: false,
      date_created: "2025-03-02T10:00:00Z",
      created_by: { username: "celeste_m" },
    },
    {
      id: 4,
      title: "Morning hot springs soak",
      description: "Hanmer Springs if we have time",
      tag: "wellness",
      is_completed: false,
      date_created: "2025-03-03T08:00:00Z",
      created_by: { username: "sarah_j" },
    },
    {
      id: 5,
      title: "Bar hop on Queenstown's main strip",
      description: "Start at Sundeck, end at Vinyl",
      tag: "social",
      is_completed: false,
      date_created: "2025-03-04T11:00:00Z",
      created_by: { username: "mia_k" },
    },
    {
      id: 6,
      title: "Take a Māori cultural tour",
      description: "Te Ana Māori Rock Art Centre",
      tag: "learning",
      is_completed: false,
      date_created: "2025-03-05T09:00:00Z",
      created_by: { username: "celeste_m" },
    },
    {
      id: 7,
      title: "Golden hour photoshoot at Lake Wakatipu",
      description: "Bring the good camera, not just phones",
      tag: "creative",
      is_completed: false,
      date_created: "2025-03-06T10:00:00Z",
      created_by: { username: "sarah_j" },
    },
  ],
};

const MOCK_DATA_4 = {
  id: 4,
  title: "Level Up — 30s Edition",
  description:
    "Things I want to do, build, and experience before I turn 35. No excuses.",
  is_public: true,
  is_open: true,
  date_created: "2026-01-01T00:00:00Z",
  has_deadline: true,
  deadline: "2026-12-31T00:00:00Z",
  owner: { username: "jake_dev" },
  items: [
    {
      id: 1,
      title: "Solo trip to Japan",
      description: "Tokyo, Kyoto, Osaka — at least 2 weeks",
      tag: "travel",
      is_completed: false,
      date_created: "2025-12-01T00:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 2,
      title: "Do a ramen crawl in Tokyo",
      description: "At least 5 different bowls in one day",
      tag: "food",
      is_completed: false,
      date_created: "2026-01-02T09:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 3,
      title: "Complete a sprint triathlon",
      description: "750m swim, 20km bike, 5km run",
      tag: "adventure",
      is_completed: false,
      date_created: "2026-01-03T07:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 4,
      title: "30 days no alcohol",
      description: "Dry July — actually do it this time",
      tag: "wellness",
      is_completed: true,
      completed_at: "2026-01-31T00:00:00Z",
      date_created: "2025-01-04T08:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 5,
      title: "Host a dinner party for 10+",
      description: "Cook everything from scratch, no shortcuts",
      tag: "social",
      is_completed: false,
      date_created: "2026-01-05T11:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 6,
      title: "Build and ship a side project",
      description:
        "Something people actually use, not just a tutorial clone",
      tag: "learning",
      is_completed: false,
      date_created: "2026-01-06T09:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 7,
      title: "Learn to play one song on guitar",
      description: "Doesn't have to be perfect, just recognisable",
      tag: "creative",
      is_completed: false,
      date_created: "2026-01-07T10:00:00Z",
      created_by: { username: "jake_dev" },
    },
    {
      id: 8,
      title: "Join a run club",
      description: "Run club, once a month at least",
      tag: "social",
      is_completed: false,
      date_created: "2026-01-07T10:00:00Z",
      created_by: { username: "jake_dev" },
    },
  ],
};

const ALL_LISTS = [MOCK_DATA, MOCK_DATA_2, MOCK_DATA_3, MOCK_DATA_4];

function BucketListsPage() {
  const { id } = useParams();
  const [deletedItems, setDeletedItems] = useState(new Set());
  const [votes, setVotes] = useState({});
  const [itemStatuses, setItemStatuses] = useState({});

  // Find the specific list by ID
  const currentList = ALL_LISTS.find((list) => list.id === parseInt(id));

  if (!currentList) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", color: COLORS.mutedText }}>
          <h2 style={{ color: COLORS.accent }}>List not found</h2>
          <p>The bucket list you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleDeleteItem = (item) => {
    setDeletedItems((prev) => new Set(prev).add(item.id));
  };

  const handleUpvote = (itemId) => {
    setVotes((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleSetStatus = (itemId, status) => {
    setItemStatuses((prev) => ({
      ...prev,
      [itemId]: status,
    }));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        fontFamily: "'Inter', sans-serif",
        color: COLORS.bodyText,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C4B5D4; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "40px",
              fontWeight: "700",
              margin: "0 0 10px",
              color: COLORS.bodyText,
              lineHeight: "1.2",
              letterSpacing: "-0.02em",
            }}
          >
            {currentList.title}
          </h1>
          <p
            style={{
              color: COLORS.mutedText,
              fontSize: "16px",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "600px",
            }}
          >
            {currentList.description}
          </p>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(() => {
            const visibleItems = currentList.items.filter(
              (item) => !deletedItems.has(item.id)
            );

            // Sort items by upvote count (descending)
            const sortedItems = [...visibleItems].sort((a, b) => {
              const aVotes = votes[a.id] || 0;
              const bVotes = votes[b.id] || 0;
              return bVotes - aVotes;
            });

            if (sortedItems.length === 0) {
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: COLORS.mutedText,
                    fontSize: "15px",
                    background: COLORS.white,
                    borderRadius: "16px",
                    border: "1px solid #E2DAF5",
                  }}
                >
                  Nothing here yet — make a plan, do something new!
                </div>
              );
            }

            return sortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
                onUpvote={handleUpvote}
                onSetStatus={handleSetStatus}
                itemStatus={itemStatuses[item.id] || "planned"}
                votes={votes}
              />
            ));
          })()}
        </div>
      </div>
    </div>
  );
}

export default BucketListsPage;