import { useRef } from "react";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import { listings } from "@/data/listings";

const Index = () => {
  const cafeRef = useRef<HTMLElement>(null);
  const hotelRef = useRef<HTMLElement>(null);
  const vetRef = useRef<HTMLElement>(null);
  const petshopRef = useRef<HTMLElement>(null);

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen">
      <Hero onCategoryClick={scrollToCategory} />
      
      <div className="bg-background">
        <CategorySection category="cafe" listings={listings} />
        <CategorySection category="hotel" listings={listings} />
        <CategorySection category="vet" listings={listings} />
        <CategorySection category="petshop" listings={listings} />
      </div>

      <footer className="bg-secondary/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 Pet-Friendly Athens. Discover the best places for you and your pet.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
