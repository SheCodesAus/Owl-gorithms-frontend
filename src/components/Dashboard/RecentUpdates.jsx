function RecentUpdates({ bucketList }) {
  const updates = [
    {
      id: 1,
      icon: "✚",
      title: 'Steven added "Visit the pyramids"',
      meta: "2 hours ago",
    },
    {
      id: 2,
      icon: "✓",
      title: 'Ian completed "Climb Mt Fuji"',
      meta: "yesterday",
    },
    {
      id: 3,
      icon: "🔥",
      title: '"Visit Rome" is trending',
      meta: "Top voted item",
    },
  ];

  return (
    <div>
      <h3 className="section-title !text-[1.25rem]">Recent updates</h3>

      <div className="mt-4 space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F9C5B6,#C1B8F5)] text-sm font-bold text-[#4F3B97]">
              {update.icon}
            </div>

            <div className="min-w-0">
              <p className="body-text leading-6">{update.title}</p>
              <p className="meta-text mt-1">{update.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentUpdates;