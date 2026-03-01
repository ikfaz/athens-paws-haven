import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useListings, useDeleteListing } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import { Plus, LogOut, Home } from "lucide-react";
import { ImportListings } from "@/components/admin/ImportListings";
import { Listing } from "@/types/listing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListingForm } from "@/components/admin/ListingForm";
import { useUpdateListing } from "@/hooks/useListings";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: listings, isLoading } = useListings();
  const deleteMutation = useDeleteListing();
  const updateMutation = useUpdateListing();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleUpdate = (data: any) => {
    if (!editingListing) return;

    updateMutation.mutate(
      { id: editingListing.id, ...data },
      {
        onSuccess: () => {
          setEditingListing(null);
        },
      }
    );
  };

  const getCategoryCount = (category: string) => {
    return listings?.filter((l) => l.category === category).length || 0;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary/20">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Listings</CardTitle>
                <CardDescription>All pet-friendly places</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{listings?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Distribution overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>Cafes: {getCategoryCount("cafe")}</p>
                  <p>Hotels: {getCategoryCount("hotel")}</p>
                  <p>Vets: {getCategoryCount("vet")}</p>
                  <p>Pet Shops: {getCategoryCount("petshop")}</p>
                  <p>Parks: {getCategoryCount("park")}</p>
                  <p>Grooming: {getCategoryCount("grooming")}</p>
                  <p>Pet Taxi: {getCategoryCount("taxi")}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => navigate("/admin/add-listing")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Listing
                </Button>
                <ImportListings />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Listings</CardTitle>
              <CardDescription>Manage your pet-friendly locations</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ListingsTable
                  listings={listings || []}
                  onEdit={handleEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          {editingListing && (
            <ListingForm
              onSubmit={handleUpdate}
              defaultValues={editingListing}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
};

export default Dashboard;
