const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  trucker_admin: "Trucker Admin",
  trucker_finance: "Trucker Finance",
  driver: "Driver",
  helper: "Helper",
};

export function formatRole(role: string): string {
  return ROLE_LABELS[role] || role;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "N/A";
  const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatCurrency(amount: string | number | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return `$${num.toFixed(2)}`;
}
