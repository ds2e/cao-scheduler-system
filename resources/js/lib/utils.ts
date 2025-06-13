import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDurationFromSecond(s: number): string {
  const hours: number = Math.floor(s / 3600);
  const minutes: number = Math.floor((s % 3600) / 60);
  const seconds: number = s % 60;

  const parts: Array<string> = [];
  if (hours) parts.push(`${hours}std`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || (!hours && !minutes)) parts.push(`${seconds}s`);

  return parts.join(':');
}
