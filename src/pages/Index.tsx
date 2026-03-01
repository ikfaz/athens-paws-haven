import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck, MapPinned, Handshake } from "lucide-react";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useSEO } from "@/hooks/useSEO";
import { trackEvent } from "@/lib/analytics";
import { Listing } from "@/types/listing";

const CATEGORY_ORDER: Listing["category"][] = [
  "hotel",
  "cafe",
  "park",
  "petshop",
  "vet",
  "grooming",
  "taxi",
];

const FAQ_ITEMS = [
  {
    question: "How do I find truly pet-friendly places in Athens?",
    answer:
      "Use the category filters and check listing details like contact info and map links before you visit. Call ahead for the latest pet policy.",
  },
  {
    question: "Are all listings verified?",
    answer:
      "We review and maintain listings regularly, but venue policies can change. We recommend confirming rules directly with each business.",
  },
  {
    question: "Can I add my pet-friendly business?",
    answer:
      "Yes. Use the \"List Your Business\" call-to-action and share your details. We review submissions to keep the guide useful and trustworthy.",
  },
  {
    question: "Is this guide free to use?",
    answer:
      "Yes. Pet owners can use the full directory for free to discover cafes, hotels, parks, vets, grooming services, pet shops, and transport.",
  },
];

const Index = () => {
  useSEO({
    title: "Pet-Friendly Athens Greece | Dog & Cat Cafes, Hotels & Parks",
    description:
      "Discover verified pet-friendly places in Athens, Greece. Find dog-friendly cafes, pet-friendly hotels, parks, vets, groomers, and pet shops with maps and contact details.",
    canonicalPath: "/",
    keywords:
      "pet-friendly Athens Greece, dog-friendly cafes Athens, pet hotels Athens, dog parks Athens, pet shops Athens, veterinarians Athens, pet grooming Athens, pet taxi Athens",
  });

  const { data: listings, isLoading, error } = useListings();
  const initialQuery =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") || "" : "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<Listing["category"] | "all">("all");

  const allListings = listings || [];
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (activeCategory !== "all" && listing.category !== activeCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        listing.name,
        listing.address,
        listing.description,
        listing.tag || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [activeCategory, allListings, normalizedQuery]);

  const totalListings = allListings.length;
  const totalCategories = new Set(allListings.map((listing) => listing.category)).size;
  const taggedListings = allListings.filter((listing) => listing.tag).length;

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToDirectory = () => {
    const element = document.getElementById("directory");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryFilterClick = (category: Listing["category"] | "all") => {
    setActiveCategory(category);
    trackEvent("directory_filter_click", { filter: category });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      if (normalizedQuery) {
        currentUrl.searchParams.set("q", normalizedQuery);
      } else {
        currentUrl.searchParams.delete("q");
      }
      window.history.replaceState({}, "", currentUrl.toString());
    }

    trackEvent("directory_search_submit", {
      query_length: normalizedQuery.length,
      has_query: normalizedQuery.length > 0,
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");
    const utmCampaign = params.get("utm_campaign");

    if (utmSource || utmMedium || utmCampaign) {
      trackEvent("campaign_landing", {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      });
    }
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load listings</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </main>
    );
  }

  const pageStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Pet-Friendly Athens",
      url: "https://petfriendlyathens.com",
      description: "Complete directory of pet-friendly places in Athens",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://petfriendlyathens.com/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Pet-Friendly Athens",
      url: "https://petfriendlyathens.com",
      logo: "https://petfriendlyathens.com/favicon.jpg",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <div className="min-h-screen">
        <Hero onCategoryClick={scrollToCategory} onExploreClick={scrollToDirectory} />

        <main className="bg-background">
          <section id="directory" className="py-12 border-b bg-secondary/30">
            <div className="container mx-auto px-4 space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Find The Best Match In Seconds</h2>
                <p className="text-muted-foreground">
                  Search by name, neighborhood, or service type and quickly discover where your pet is welcome.
                </p>
              </div>

              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-10 h-11"
                    placeholder="Search listings (e.g., Kolonaki, pet-friendly cafe, grooming)"
                    aria-label="Search pet-friendly listings"
                  />
                </div>
              </form>

              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant={activeCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilterClick("all")}
                >
                  All Categories
                </Button>
                {CATEGORY_ORDER.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilterClick(category)}
                    className="capitalize"
                  >
                    {category === "petshop" ? "Pet Shop" : category}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <article className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-3xl font-bold">{isLoading ? "--" : totalListings}</p>
                  <p className="text-sm text-muted-foreground">Active listings</p>
                </article>
                <article className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-3xl font-bold">{isLoading ? "--" : totalCategories}</p>
                  <p className="text-sm text-muted-foreground">Service categories</p>
                </article>
                <article className="rounded-xl bg-background border p-4 text-center">
                  <p className="text-3xl font-bold">{isLoading ? "--" : taggedListings}</p>
                  <p className="text-sm text-muted-foreground">Highlighted picks</p>
                </article>
              </div>
            </div>
          </section>

          {isLoading ? (
            <div className="container mx-auto px-4 py-16">
              <div className="space-y-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-64" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredListings.length > 0 ? (
            <>
              {CATEGORY_ORDER.map((category) => (
                <CategorySection key={category} category={category} listings={filteredListings} />
              ))}
            </>
          ) : (
            <section className="container mx-auto px-4 py-16 text-center">
              <h3 className="text-2xl font-bold mb-3">No Results For This Search Yet</h3>
              <p className="text-muted-foreground mb-6">
                Try another keyword or switch to \"All Categories\" to see more options.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  trackEvent("directory_reset_filters");
                }}
              >
                Reset Filters
              </Button>
            </section>
          )}

          <section className="py-16 bg-secondary/40">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="rounded-xl border bg-background p-6">
                <ShieldCheck className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg mb-2">Reliable Information</h3>
                <p className="text-sm text-muted-foreground">
                  Each listing includes practical details such as address, phone, website, and maps links.
                </p>
              </article>
              <article className="rounded-xl border bg-background p-6">
                <MapPinned className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg mb-2">Intent-Based Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Browse by category or search by location keywords to match your plan for today.
                </p>
              </article>
              <article className="rounded-xl border bg-background p-6">
                <Handshake className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg mb-2">Business Growth Channel</h3>
                <p className="text-sm text-muted-foreground">
                  Pet-friendly brands can reach high-intent visitors looking for services in Athens.
                </p>
              </article>
            </div>
          </section>

          <section id="faq" className="py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} className="rounded-lg border bg-card p-4">
                    <summary className="font-semibold cursor-pointer">{item.question}</summary>
                    <p className="text-sm text-muted-foreground mt-3">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-secondary/50 py-8 mt-16" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-center md:text-left">
                (c) {new Date().getFullYear()} Pet-Friendly Athens. Discover the best places for you and your pet.
              </p>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <Button variant="link" asChild className="text-muted-foreground">
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button variant="link" asChild className="text-muted-foreground">
                  <Link to="/terms-of-service">Terms of Service</Link>
                </Button>
                <Button variant="link" asChild className="text-muted-foreground">
                  <Link to="/cookie-policy">Cookie Policy</Link>
                </Button>
                <Button variant="link" asChild className="text-muted-foreground">
                  <a href="#faq">FAQ</a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <a
                    href="mailto:hello@petfriendlyathens.com?subject=Add%20my%20pet-friendly%20business"
                    onClick={() => trackEvent("list_business_click", { source: "footer" })}
                  >
                    List Your Business
                  </a>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/admin/login">Admin</Link>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
