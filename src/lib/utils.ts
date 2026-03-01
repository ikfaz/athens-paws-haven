import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripProtocol(url: string): string {
  return url.replace(/^(https?:\/\/)?(www\.)?/, "");
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

const BLOCKED_IMAGE_PATTERNS = [
  /maps\.app\.goo\.gl/i,
  /google\.[^/]+\/maps/i,
  /maps\.google\.[^/]+/i,
  /goo\.gl\/maps/i,
  /\/gps-cs-s\//i,
  /\/gps-proxy\//i,
];

export function isBlockedImageUrl(url: string): boolean {
  return BLOCKED_IMAGE_PATTERNS.some((pattern) => pattern.test(url));
}

export function isLikelyImageUrl(url: string): boolean {
  const safeUrl = toSafeHttpUrl(url);
  if (!safeUrl) {
    return false;
  }

  if (isBlockedImageUrl(safeUrl)) {
    return false;
  }

  const parsed = new URL(safeUrl);
  const pathname = parsed.pathname.toLowerCase();
  const hasImageExtension = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/.test(pathname);
  const isGoogleusercontentPhoto =
    parsed.hostname.endsWith("googleusercontent.com") &&
    (pathname.startsWith("/p/") || /w\d+-h\d+/.test(parsed.search + parsed.pathname));
  const isStreetViewPixels = parsed.hostname === "streetviewpixels-pa.googleapis.com";

  return hasImageExtension || isGoogleusercontentPhoto || isStreetViewPixels;
}

export function toSafeImageSrc(url: string): string {
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  if (!isLikelyImageUrl(trimmedUrl)) {
    return "/placeholder.svg";
  }

  return toSafeHttpUrl(trimmedUrl) ?? "/placeholder.svg";
}
