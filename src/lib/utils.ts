import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripProtocol(url: string): string {
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

export function ensureProtocol(url: string): string {
  if (!url.match(/^https?:\/\//)) {
    return `https://${url}`;
  }
  return url;
}
