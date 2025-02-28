import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatDate = (date?: string | Date) => {
  if (!date) return null;
  date = typeof date === "string" ? new Date(date) : date;

  const theDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return `${theDate}, ${time}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
