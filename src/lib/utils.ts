import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripProtocol(url: string): string {
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

export function ensureProtocol(url: string): string {
  const trimmedUrl = url.trim();
  if (!trimmedUrl.match(/^https?:\/\//i)) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
}

export function toSafeHttpUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(ensureProtocol(url));
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function toSafeImageSrc(url: string): string {
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  return toSafeHttpUrl(trimmedUrl) ?? "/placeholder.svg";
}
