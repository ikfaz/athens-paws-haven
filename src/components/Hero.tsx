import heroImage from "@/assets/athens-hero.jpg";
import { Button } from "@/components/ui/button";
import { Coffee, Hotel, TreePine, Store, Stethoscope, Scissors } from "lucide-react";

interface HeroProps {
  onCategoryClick: (category: string) => void;
}

const Hero = ({ onCategoryClick }: HeroProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Athens with pets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-background" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-card animate-fade-in">
          Pet-Friendly Athens
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-card/90 max-w-2xl mx-auto animate-fade-in">
          Discover the best pet-friendly places in Athens. From cozy cafés to welcoming hotels.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto animate-fade-in">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("hotel")}
            className="h-auto py-4 flex-col"
          >
            <Hotel className="w-6 h-6 mb-2" />
            <span>Hotels</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("cafe")}
            className="h-auto py-4 flex-col"
          >
            <Coffee className="w-6 h-6 mb-2" />
            <span>Cafés</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("park")}
            className="h-auto py-4 flex-col"
          >
            <TreePine className="w-6 h-6 mb-2" />
            <span>Parks</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("petshop")}
            className="h-auto py-4 flex-col"
          >
            <Store className="w-6 h-6 mb-2" />
            <span>Shops</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("vet")}
            className="h-auto py-4 flex-col"
          >
            <Stethoscope className="w-6 h-6 mb-2" />
            <span>Vets</span>
          </Button>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => onCategoryClick("grooming")}
            className="h-auto py-4 flex-col"
          >
            <Scissors className="w-6 h-6 mb-2" />
            <span>Grooming</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
