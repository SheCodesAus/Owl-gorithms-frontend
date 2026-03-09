import Avatar from "./Avatar";

function AvatarGroup({ users = [], max = 3, size = "sm" }) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - visibleUsers.length;

  const extraSizeClass =
    size === "xs"
      ? "h-7 w-7 text-[10px]"
      : size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "md"
      ? "h-10 w-10 text-sm"
      : "h-12 w-12 text-base";

  return (
    <div className="flex items-center">
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.id || `${user.display_name}-${index}`}
          user={user}
          size={size}
          className={index > 0 ? "-ml-2" : ""}
        />
      ))}

      {remainingCount > 0 && (
        <div
          className={`-ml-2 flex items-center justify-center rounded-full border border-white/70 bg-white/85 font-semibold text-[var(--heading-text)] shadow-sm ${extraSizeClass}`}
          aria-label={`${remainingCount} more members`}
          title={`${remainingCount} more members`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;