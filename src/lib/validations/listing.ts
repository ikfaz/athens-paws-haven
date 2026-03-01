import { z } from "zod";

const httpUrlSchema = z.string().trim().url("Invalid URL").refine(
  (value) => value.startsWith("http://") || value.startsWith("https://"),
  "URL must start with http:// or https://"
);

const googleMapsUrlSchema = httpUrlSchema.refine(
  (value) =>
    /maps\.app\.goo\.gl|google\.[^/]+\/maps|maps\.google\.[^/]+|goo\.gl\/maps/i.test(value),
  "Enter a valid Google Maps URL"
);

const imageUrlSchema = z.string().trim().refine(
  (value) => value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://"),
  "Image URL must start with http://, https://, or /"
);

export const listingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.enum(["cafe", "hotel", "vet", "petshop", "park", "grooming", "taxi"], {
    required_error: "Please select a category",
  }),
  address: z.string().trim().min(1, "Address is required").max(200, "Address must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  website: httpUrlSchema.optional().or(z.literal("")),
  mapsLink: googleMapsUrlSchema,
  image: imageUrlSchema,
  tag: z.string().trim().optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
