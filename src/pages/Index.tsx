import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/useSEO";
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
  const allListings = listings || [];

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToListings = () => {
    const firstCategory = document.getElementById(CATEGORY_ORDER[0]);
    if (firstCategory) {
      firstCategory.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Pet-Friendly Athens",
      url: "https://petfriendlyathens.com",
      logo: "https://petfriendlyathens.com/favicon.jpg",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <div className="min-h-screen">
        <Hero onCategoryClick={scrollToCategory} onExploreClick={scrollToListings} />

        <main className="bg-background">
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
          ) : (
            <>
              {CATEGORY_ORDER.map((category) => (
                <CategorySection key={category} category={category} listings={allListings} />
              ))}
            </>
          )}
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
