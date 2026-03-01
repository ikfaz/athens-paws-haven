import { useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ListingForm } from "@/components/admin/ListingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddListing } from "@/hooks/useListings";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft } from "lucide-react";

const AddListing = () => {
  useSEO({
    title: "Add Listing | Pet-Friendly Athens Admin",
    description: "Create a new listing in the Pet-Friendly Athens admin panel.",
    canonicalPath: "/admin/add-listing",
    noindex: true,
  });

  const navigate = useNavigate();
  const addMutation = useAddListing();

  const handleSubmit = (data: any) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        navigate("/admin/dashboard");
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary/20">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Add New Listing</CardTitle>
              <CardDescription>
                Create a new pet-friendly location. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ListingForm onSubmit={handleSubmit} isLoading={addMutation.isPending} />
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AddListing;
