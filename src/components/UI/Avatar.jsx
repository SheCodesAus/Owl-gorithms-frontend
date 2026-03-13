import { useEffect, useState } from "react";

function getInitials(displayName = "") {
  return displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .replace(".", "")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ user, size = "sm", className = "", alt = "" }) {
  const profileImage = user?.profile_image || "";
  const displayName = user?.display_name || "User";

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [profileImage]);

  const sizeClasses = {
    xs: "h-7 w-7 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const initials = getInitials(displayName);

  if (profileImage && !imageFailed) {
    return (
      <img
        src={profileImage}
        alt={alt || `${displayName} avatar`}
        referrerPolicy="no-referrer"
        className={`rounded-full border border-white/70 object-cover shadow-sm ${sizeClasses[size]} ${className}`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full border border-white/70 bg-white/80 font-semibold text-[var(--heading-text)] shadow-sm ${sizeClasses[size]} ${className}`}
      aria-label={alt || `${displayName} avatar`}
      title={displayName}
    >
      {initials || "?"}
    </div>
  );
}

export default Avatar;
