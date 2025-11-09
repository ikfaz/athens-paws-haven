import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listingSchema, ListingFormData } from "@/lib/validations/listing";
import { Listing } from "@/types/listing";

interface ListingFormProps {
  onSubmit: (data: ListingFormData) => void;
  defaultValues?: Partial<Listing>;
  isLoading?: boolean;
}

export const ListingForm = ({ onSubmit, defaultValues, isLoading }: ListingFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      category: defaultValues.category,
      address: defaultValues.address,
      description: defaultValues.description,
      phone: defaultValues.phone || "",
      email: defaultValues.email || "",
      website: defaultValues.website || "",
      mapsLink: defaultValues.mapsLink,
      image: defaultValues.image,
      tag: defaultValues.tag || "",
    } : undefined,
  });

  const category = watch("category");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} placeholder="e.g., Cozy Paws Café" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={category}
          onValueChange={(value) => setValue("category", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cafe">Café</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="vet">Veterinary</SelectItem>
            <SelectItem value="petshop">Pet Shop</SelectItem>
            <SelectItem value="park">Park</SelectItem>
            <SelectItem value="grooming">Grooming</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input id="address" {...register("address")} placeholder="123 Pet Street, Athens" />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe the pet-friendly features..."
          rows={4}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" {...register("phone")} placeholder="+30 123 456 7890" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" {...register("email")} placeholder="info@example.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input id="website" {...register("website")} placeholder="https://example.com" />
        {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapsLink">Google Maps Link *</Label>
        <Input
          id="mapsLink"
          {...register("mapsLink")}
          placeholder="https://maps.google.com/..."
        />
        {errors.mapsLink && <p className="text-sm text-destructive">{errors.mapsLink.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          {...register("image")}
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tag">Tag (optional)</Label>
        <Input id="tag" {...register("tag")} placeholder="e.g., Featured, New, Popular" />
        {errors.tag && <p className="text-sm text-destructive">{errors.tag.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : defaultValues ? "Update Listing" : "Add Listing"}
      </Button>
    </form>
  );
};
