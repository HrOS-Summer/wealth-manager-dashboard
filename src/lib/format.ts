/**
 * Formats a number as Indian Rupee currency.
 */
export const formatCurrency = (n?: number) =>
  n?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }) || "-";

/**
 * Formats a number as a percentage string.
 */
export const pct = (n?: number | null) =>
  n == null ? "-" : `${n.toFixed(2)}%`;

/**
 * Returns a Tailwind CSS class for green or red text based on a number's sign.
 */
export const gainColor = (n: number) => (n >= 0 ? "text-green-600" : "text-red-600");

/**
 * Returns a Tailwind CSS class for green or red background based on a number's sign.
 */
export const gainBg = (n: number) => (n >= 0 ? "bg-green-50" : "bg-red-50");
