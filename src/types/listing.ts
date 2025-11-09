export interface Listing {
  id: string;
  name: string;
  category: "cafe" | "hotel" | "vet" | "petshop";
  address: string;
  description: string;
  phone: string;
  email: string;
  mapsLink: string;
  image: string;
}
