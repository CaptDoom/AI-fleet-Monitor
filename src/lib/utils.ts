import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTokens(num: number, includeSuffix: boolean = true): string {
  if (num === -1) return 'Unlimited';
  let formatted = '';
  if (num >= 1000000000) {
    formatted = (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    formatted = (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    formatted = (num / 1000).toFixed(1) + 'K';
  } else {
    formatted = num.toString();
  }
  return includeSuffix ? `${formatted} Tokens` : formatted;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 5) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return past.toLocaleDateString();
}
