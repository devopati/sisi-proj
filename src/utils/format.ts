const shillings = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });
const shortShillings = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

// 4500000 → "Ksh 4,500,000"
export const formatKES = (amount: number) => shillings.format(amount);

// 4500000 → "Ksh 4.5M"
export const formatShortKES = (amount: number) => shortShillings.format(amount);

// 48200 → "48,200"
export const formatNumber = (value: number) => value.toLocaleString("en-KE");

// "2026-03-02" → "2 Mar 2026"
export const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not set";

export const getDaysLeft = (endDate: string | null) => {
  if (!endDate) return null;

  const dueDate = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDaysLeft = (endDate: string | null, status?: string) => {
  if (!endDate) return "";
  if (status === "Completed") return "Finished";

  const daysLeft = getDaysLeft(endDate);
  if (daysLeft === null) return "";
  if (daysLeft > 0) return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"}`;
  return "Due today";
};

// Matches the server: only these projects have money committed
export const isFunded = (status: string) => ["Approved", "In Progress", "Completed"].includes(status);
