import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
}

const SITE_NAME = "Pet-Friendly Athens";
const SITE_URL = "https://petfriendlyathens.com";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.jpg`;

const upsertMetaTag = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const useSEO = ({
  title,
  description,
  canonicalPath = "/",
  keywords,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
}: SEOConfig) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    document.title = title;

    upsertMetaTag("name", "description", description);
    upsertMetaTag("name", "author", SITE_NAME);
    upsertMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    if (keywords) {
      upsertMetaTag("name", "keywords", keywords);
    }

    upsertMetaTag("property", "og:title", ogTitle ?? title);
    upsertMetaTag("property", "og:description", ogDescription ?? description);
    upsertMetaTag("property", "og:type", ogType);
    upsertMetaTag("property", "og:url", canonicalUrl);
    upsertMetaTag("property", "og:image", ogImage);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("property", "og:locale", "en_US");

    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", ogTitle ?? title);
    upsertMetaTag("name", "twitter:description", ogDescription ?? description);
    upsertMetaTag("name", "twitter:image", ogImage);

    upsertCanonical(canonicalUrl);
  }, [
    canonicalPath,
    description,
    keywords,
    noindex,
    ogDescription,
    ogImage,
    ogTitle,
    ogType,
    title,
  ]);
};

