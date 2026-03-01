import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: listings, isLoading, error } = useListings();

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pet-Friendly Athens",
    description: "Complete directory of pet-friendly places in Athens",
    url: "https://petfriendlyathens.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen">
        <Hero onCategoryClick={scrollToCategory} />

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
              <CategorySection category="hotel" listings={listings || []} />
              <CategorySection category="cafe" listings={listings || []} />
              <CategorySection category="park" listings={listings || []} />
              <CategorySection category="petshop" listings={listings || []} />
              <CategorySection category="vet" listings={listings || []} />
              <CategorySection category="grooming" listings={listings || []} />
              <CategorySection category="taxi" listings={listings || []} />
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
