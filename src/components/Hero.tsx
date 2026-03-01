import heroImage from "@/assets/athens-hero.jpg";
import { Button } from "@/components/ui/button";
import { Coffee, Hotel, TreePine, Store, Stethoscope, Scissors, Car } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface HeroProps {
  onCategoryClick: (category: string) => void;
  onExploreClick: () => void;
}

const Hero = ({ onCategoryClick, onExploreClick }: HeroProps) => {
  const handleCategoryClick = (category: string) => {
    trackEvent("category_nav_click", { category, source: "hero" });
    onCategoryClick(category);
  };

  const handleExploreClick = () => {
    trackEvent("browse_categories_click", { source: "hero" });
    onExploreClick();
  };

  const handleBusinessCtaClick = () => {
    trackEvent("list_business_click", { source: "hero" });
  };

  return (
    <header className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Pet-friendly locations in Athens, Greece - Dogs and owners enjoying outdoor cafes and parks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-card animate-fade-in">
          Pet-Friendly Athens
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-card/90 max-w-2xl mx-auto animate-fade-in">
          Discover the best pet-friendly places in Athens. From cozy cafes to welcoming hotels.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-fade-in">
          <Button size="lg" variant="default" onClick={handleExploreClick}>
            Browse Categories
          </Button>
          <Button size="lg" variant="hero" asChild>
            <a
              href="mailto:hello@petfriendlyathens.com?subject=List%20my%20pet-friendly%20business"
              onClick={handleBusinessCtaClick}
            >
              List Your Business
            </a>
          </Button>
        </div>

        <nav aria-label="Category navigation" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 max-w-6xl mx-auto animate-fade-in">
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("hotel")}
            className="h-auto py-4 flex-col"
          >
            <Hotel className="w-6 h-6 mb-2" />
            <span>Hotels</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("cafe")}
            className="h-auto py-4 flex-col"
          >
            <Coffee className="w-6 h-6 mb-2" />
            <span>Cafes & Restaurants</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("park")}
            className="h-auto py-4 flex-col"
          >
            <TreePine className="w-6 h-6 mb-2" />
            <span>Parks</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("petshop")}
            className="h-auto py-4 flex-col"
          >
            <Store className="w-6 h-6 mb-2" />
            <span>Shops</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("vet")}
            className="h-auto py-4 flex-col"
          >
            <Stethoscope className="w-6 h-6 mb-2" />
            <span>Vets</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("grooming")}
            className="h-auto py-4 flex-col"
          >
            <Scissors className="w-6 h-6 mb-2" />
            <span>Grooming</span>
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={() => handleCategoryClick("taxi")}
            className="h-auto py-4 flex-col"
          >
            <Car className="w-6 h-6 mb-2" />
            <span>Pet Taxi</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Hero;
