import { z } from "zod";

export const listingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.enum(["cafe", "hotel", "vet", "petshop", "park", "grooming"], {
    required_error: "Please select a category",
  }),
  address: z.string().trim().min(1, "Address is required").max(200, "Address must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  mapsLink: z.string().trim().min(1, "Google Maps link is required"),
  image: z.string().trim().min(1, "Image URL is required"),
  tag: z.string().trim().optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
