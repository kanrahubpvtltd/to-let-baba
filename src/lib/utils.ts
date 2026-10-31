import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number into Indian Rupee currency string (e.g. ₹14,500)
 */
export function formatIndianPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format standard number using Indian comma grouping (e.g. 1,00,000)
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Clean & normalize Indian 10-digit phone number
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

/**
 * Format phone number as +91 XXXXX XXXXX
 */
export function formatPhoneNumber(phone: string): string {
  const digits = cleanPhoneNumber(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Generate standard direct WhatsApp chat link
 */
export function getWhatsAppLink(phone: string, title: string, id?: string): string {
  const digits = cleanPhoneNumber(phone);
  const text = encodeURIComponent(
    `Hi, I am interested in your property listed on To-Let Baba: "${title}"${id ? ` (Ref: #${id.slice(0, 6)})` : ""}. Is it still available for rent?`
  );
  return `https://wa.me/91${digits}?text=${text}`;
}

/**
 * Human readable relative time format (e.g. "2 hours ago", "Yesterday")
 */
export function getTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}
