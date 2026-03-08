function NotificationsBanner() {
  return (
    <section
      className="overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(167,139,250,0.12)] backdrop-blur"
      aria-label="Notifications"
    >
      <div className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-[linear-gradient(90deg,#6B4EAA_0%,#8B6DD9_45%,#FFB1A8_100%)] px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[linear-gradient(135deg,#FF8B5E,#FF5A8A)]" />
          <div>
            <p className="text-lg font-semibold">No new notifications</p>
          </div>
        </div>

        <button type="button" className="btn-secondary !bg-white/90">
          View All
        </button>
      </div>
    </section>
  );
}

export default NotificationsBanner;