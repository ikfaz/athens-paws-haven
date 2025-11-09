export interface Listing {
  id: string;
  name: string;
  category: "cafe" | "hotel" | "vet" | "petshop" | "park" | "grooming";
  address: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  mapsLink: string;
  image: string;
  tag?: string;
}
