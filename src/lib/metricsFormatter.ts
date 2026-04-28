/**
 * Format days ago into readable format
 * e.g., "2 days ago", "Aug 2024", "Just now"
 */
export function formatDaysAgo(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Just now";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

/**
 * Format member since date
 * e.g., "Aug 2024", "Sep 2023"
 */
export function formatMemberSince(date: Date): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

/**
 * Format response time from seconds to human readable
 * e.g., "< 1 hour", "5 hours", "1 day"
 */
export function formatResponseTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (hours === 0) {
    if (minutes === 0) return "Just now";
    return `${minutes} ${minutes === 1 ? "min" : "mins"}`;
  }
  if (days === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  return `${days} ${days === 1 ? "day" : "days"}`;
}

/**
 * Format large numbers with abbreviations
 * e.g., 1000 -> "1K", 1000000 -> "1M"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
