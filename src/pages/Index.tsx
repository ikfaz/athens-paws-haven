import { Link, useNavigate } from "react-router-dom";
import { Coffee, Hotel, TreePine, Store, Stethoscope, Scissors, Car } from "lucide-react";
import Hero from "@/components/Hero";
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

const categoryMeta: Record<
  Listing["category"],
  { label: string; description: string; icon: typeof Hotel }
> = {
  hotel: {
    label: "Hotels",
    description: "Pet-friendly stays and accommodation",
    icon: Hotel,
  },
  cafe: {
    label: "Cafes & Restaurants",
    description: "Places to eat and drink with pets",
    icon: Coffee,
  },
  park: {
    label: "Parks",
    description: "Outdoor spaces for walks and play",
    icon: TreePine,
  },
  petshop: {
    label: "Pet Shops",
    description: "Food, toys, and pet essentials",
    icon: Store,
  },
  vet: {
    label: "Vets",
    description: "Veterinary clinics and pet care",
    icon: Stethoscope,
  },
  grooming: {
    label: "Grooming",
    description: "Bathing and grooming services",
    icon: Scissors,
  },
  taxi: {
    label: "Pet Taxi",
    description: "Transport services for pets",
    icon: Car,
  },
};

const Index = () => {
  useSEO({
    title: "Pet-Friendly Athens Categories | Hotels, Cafes, Parks & More",
    description:
      "Choose a category to browse pet-friendly places in Athens. Hotels, cafes, parks, pet shops, vets, grooming, and pet taxi services.",
    canonicalPath: "/",
    keywords:
      "pet-friendly Athens categories, pet-friendly hotels Athens, pet-friendly cafes Athens, vets Athens, pet shops Athens",
  });

  const navigate = useNavigate();
  const { data: listings, isLoading, error } = useListings();
  const allListings = listings || [];

  const scrollToCategories = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToCategory = (category: string) => {
    navigate(`/category/${category}`);
  };

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load categories</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </main>
    );
  }

  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pet-Friendly Athens",
    url: "https://petfriendlyathens.com",
    description: "Category directory for pet-friendly places in Athens",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageStructuredData) }}
      />
      <div className="min-h-screen">
        <Hero onCategoryClick={goToCategory} onExploreClick={scrollToCategories} />

        <main className="bg-background">
          <section id="categories" className="py-16">
            <div className="container mx-auto px-4">
              <header className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse By Category</h2>
                <p className="text-muted-foreground">
                  Select a category to see all listings that belong to it.
                </p>
              </header>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CATEGORY_ORDER.map((category) => (
                    <div key={category} className="rounded-lg border p-6 space-y-3">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CATEGORY_ORDER.map((category) => {
                    const meta = categoryMeta[category];
                    const Icon = meta.icon;
                    const count = allListings.filter((listing) => listing.category === category).length;

                    return (
                      <article key={category} className="rounded-lg border p-6 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-6 h-6 text-primary" />
                          <h3 className="text-xl font-semibold">{meta.label}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{meta.description}</p>
                        <p className="text-sm mb-4">
                          <span className="font-semibold">{count}</span> listing{count === 1 ? "" : "s"}
                        </p>
                        <Button asChild className="w-full">
                          <Link to={`/category/${category}`}>View {meta.label}</Link>
                        </Button>
                      </article>
                    );
                  })}
                </div>
              )}
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
