import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CategorySection from "@/components/CategorySection";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/useSEO";
import { Listing } from "@/types/listing";

const CATEGORIES: Listing["category"][] = [
  "hotel",
  "cafe",
  "park",
  "petshop",
  "vet",
  "grooming",
  "taxi",
];

const categoryTitles: Record<Listing["category"], string> = {
  hotel: "Hotels",
  cafe: "Cafes & Restaurants",
  park: "Parks",
  petshop: "Pet Shops",
  vet: "Veterinarians & Boarding",
  grooming: "Grooming",
  taxi: "Pet Taxi",
};

const categoryIntroCopy: Record<Listing["category"], string> = {
  hotel:
    "Discover pet-friendly hotels in Athens with practical details for traveling with dogs or cats, including location and direct contact links.",
  cafe:
    "Explore dog-friendly cafes and pet-friendly restaurants in Athens to find places where you can dine or enjoy coffee with your pet.",
  park:
    "Find parks and outdoor spaces in Athens suitable for pet walks, daily exercise, and relaxed time with your companion animal.",
  petshop:
    "Browse pet shops in Athens for food, toys, grooming items, and everyday supplies for dogs, cats, and other pets.",
  vet:
    "Locate veterinary clinics and pet care services in Athens, including trusted options for routine checkups and urgent needs.",
  grooming:
    "Compare pet grooming services in Athens to find baths, trims, and hygiene care based on location and contact convenience.",
  taxi:
    "See pet taxi and pet transport options in Athens when you need safe travel support for clinic visits, airport runs, or local rides.",
};

const isCategory = (value: string | undefined): value is Listing["category"] => {
  if (!value) {
    return false;
  }
  return CATEGORIES.includes(value as Listing["category"]);
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: listings, isLoading, error } = useListings();
  const categoryIsValid = isCategory(category);

  const seoTitle = categoryIsValid
    ? `${categoryTitles[category]} | Pet-Friendly Athens`
    : "Category Not Found | Pet-Friendly Athens";
  const seoDescription = categoryIsValid
    ? `Browse all pet-friendly ${categoryTitles[category].toLowerCase()} listings in Athens.`
    : "The selected category does not exist.";
  const canonicalPath = categoryIsValid ? `/category/${category}` : "/category/not-found";

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalPath,
    keywords: categoryIsValid
      ? `pet-friendly ${categoryTitles[category].toLowerCase()} Athens, Athens pet directory`
      : undefined,
    noindex: !categoryIsValid,
  });

  if (!categoryIsValid) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-3">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Please return to the home page and choose a valid category.
          </p>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  const allListings = listings || [];
  const categoryCount = allListings.filter((item) => item.category === category).length;

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load category</h2>
          <p className="text-muted-foreground mb-4">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back To Categories
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            {isLoading ? "--" : categoryCount} listing{categoryCount === 1 ? "" : "s"}
          </div>
        </div>
      </header>

      <main>
        <section className="py-10 border-b bg-secondary/30">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryTitles[category]}</h1>
            <p className="text-muted-foreground">
              {categoryIntroCopy[category]}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {CATEGORIES.map((item) => (
                <Button key={item} variant={item === category ? "default" : "outline"} asChild size="sm">
                  <Link to={`/category/${item}`}>{categoryTitles[item]}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
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
          <CategorySection category={category} listings={allListings} />
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
