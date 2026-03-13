import { getRelativeTime } from "../../utils/time";

function RelativeTime({ timestamp }) {
  const label = getRelativeTime(timestamp);

  if (!label) return null;

  return (
    <span className="text-sm">
      {label}
    </span>
  );
}

export default RelativeTime;