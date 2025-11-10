import { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";
import { Coffee, Hotel, Stethoscope, Store, TreePine, Scissors, Car } from "lucide-react";

interface CategorySectionProps {
  category: "cafe" | "hotel" | "vet" | "petshop" | "park" | "grooming" | "taxi";
  listings: Listing[];
}

const categoryInfo = {
  cafe: {
    title: "Pet-Friendly Cafes & Restaurants",
    icon: Coffee,
    description: "Enjoy coffee and treats with your furry companion",
  },
  hotel: {
    title: "Pet-Friendly Hotels",
    icon: Hotel,
    description: "Comfortable stays for you and your pet",
  },
  vet: {
    title: "Veterinarians & Boarding",
    icon: Stethoscope,
    description: "Professional care for your pet's health",
  },
  petshop: {
    title: "Pet Shops",
    icon: Store,
    description: "Everything your pet needs in one place",
  },
  park: {
    title: "Dog Parks & Outdoor Spaces",
    icon: TreePine,
    description: "Open spaces for your dog to play and socialize",
  },
  grooming: {
    title: "Grooming Salons",
    icon: Scissors,
    description: "Professional grooming services for your pet",
  },
  taxi: {
    title: "Pet Taxi Friendly",
    icon: Car,
    description: "Safe and comfortable transportation for your pet",
  },
};

const CategorySection = ({ category, listings }: CategorySectionProps) => {
  const info = categoryInfo[category];
  const Icon = info.icon;
  
  const categoryListings = listings.filter((listing) => listing.category === category);

  if (categoryListings.length === 0) return null;

  return (
    <section id={category} className="py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">{info.title}</h2>
            <p className="text-muted-foreground">{info.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {categoryListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
