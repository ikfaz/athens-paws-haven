import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/types/listing";
import { toast } from "@/hooks/use-toast";

// Fetch all listings
export const useListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform database format to app format
      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as Listing["category"],
        address: item.address,
        description: item.description,
        phone: item.phone || undefined,
        email: item.email || undefined,
        website: item.website || undefined,
        mapsLink: item.maps_link,
        image: item.image,
        tag: item.tag || undefined,
      })) as Listing[];
    },
  });
};

// Fetch listings by category
export const useListingsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["listings", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as Listing["category"],
        address: item.address,
        description: item.description,
        phone: item.phone || undefined,
        email: item.email || undefined,
        website: item.website || undefined,
        mapsLink: item.maps_link,
        image: item.image,
        tag: item.tag || undefined,
      })) as Listing[];
    },
  });
};

// Add new listing
export const useAddListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: Omit<Listing, "id">) => {
      const { data, error } = await supabase
        .from("listings")
        .insert({
          name: listing.name,
          category: listing.category,
          address: listing.address,
          description: listing.description,
          phone: listing.phone || null,
          email: listing.email || null,
          website: listing.website || null,
          maps_link: listing.mapsLink,
          image: listing.image,
          tag: listing.tag || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast({
        title: "Success",
        description: "Listing added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update listing
export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...listing }: Partial<Listing> & { id: string }) => {
      const { data, error } = await supabase
        .from("listings")
        .update({
          name: listing.name,
          category: listing.category,
          address: listing.address,
          description: listing.description,
          phone: listing.phone || null,
          email: listing.email || null,
          website: listing.website || null,
          maps_link: listing.mapsLink,
          image: listing.image,
          tag: listing.tag || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast({
        title: "Success",
        description: "Listing updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete listing
export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
