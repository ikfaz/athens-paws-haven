import heroImage from "@/assets/athens-hero.jpg";
import { Button } from "@/components/ui/button";

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
        
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
          <Button variant="hero" size="lg" onClick={() => onCategoryClick("cafe")}>
            Cafés
          </Button>
          <Button variant="hero" size="lg" onClick={() => onCategoryClick("hotel")}>
            Hotels
          </Button>
          <Button variant="hero" size="lg" onClick={() => onCategoryClick("vet")}>
            Veterinarians
          </Button>
          <Button variant="hero" size="lg" onClick={() => onCategoryClick("petshop")}>
            Pet Shops
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
