export const PRIORITIES = ["low", "medium", "high"] as const;
export const CATEGORIES = ["payment", "delivery", "complaint", "other"] as const;

export type Priority = (typeof PRIORITIES)[number];
export type Category = (typeof CATEGORIES)[number];

type Badge = { label: string; className: string };

const NEUTRAL_BADGE = "bg-zinc-100 text-zinc-700";

const PRIORITY_BADGES: Record<Priority, Badge> = {
  low: { label: "Низький", className: "bg-zinc-100 text-zinc-700" },
  medium: { label: "Середній", className: "bg-amber-100 text-amber-800" },
  high: { label: "Високий", className: "bg-red-100 text-red-700" },
};

const CATEGORY_BADGES: Record<Category, Badge> = {
  payment: { label: "Оплата", className: "bg-blue-100 text-blue-800" },
  delivery: { label: "Доставка", className: "bg-violet-100 text-violet-800" },
  complaint: { label: "Скарга", className: "bg-orange-100 text-orange-800" },
  other: { label: "Інше", className: "bg-zinc-100 text-zinc-700" },
};

// Unknown stored values fall back to the raw value with a neutral badge
export function priorityBadge(value: string): Badge {
  return (
    PRIORITY_BADGES[value as Priority] ?? { label: value, className: NEUTRAL_BADGE }
  );
}

export function categoryBadge(value: string): Badge {
  return (
    CATEGORY_BADGES[value as Category] ?? { label: value, className: NEUTRAL_BADGE }
  );
}
