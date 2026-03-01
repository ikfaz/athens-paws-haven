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

function parseImageDimensions(url: string): { width: number; height: number } | null {
  const sizeTokenMatch = url.match(/w(\d+)-h(\d+)/i);
  if (sizeTokenMatch) {
    const width = Number(sizeTokenMatch[1]);
    const height = Number(sizeTokenMatch[2]);
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }

  try {
    const parsed = new URL(url);
    const width = Number(parsed.searchParams.get("w") || parsed.searchParams.get("width"));
    const height = Number(parsed.searchParams.get("h") || parsed.searchParams.get("height"));
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return { width, height };
    }
  } catch {
    return null;
  }

  return null;
}

export function getImageQualityScore(imageUrl: string): number {
  const safeImageUrl = toSafeImageSrc(imageUrl);
  if (safeImageUrl === "/placeholder.svg") {
    return 0;
  }

  const dimensions = parseImageDimensions(safeImageUrl);
  if (!dimensions) {
    // Valid image URL, but unknown size: medium priority.
    return 2;
  }

  const area = dimensions.width * dimensions.height;
  if (area >= 800000) {
    return 4;
  }
  if (area >= 250000) {
    return 3;
  }
  return 2;
}
