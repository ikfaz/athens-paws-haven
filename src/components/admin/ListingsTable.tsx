import { useState } from "react";
import { Listing } from "@/types/listing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ListingsTableProps {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
  onDelete: (id: string) => void;
}

export const ListingsTable = ({ listings, onEdit, onDelete }: ListingsTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cafe: "bg-amber-500",
      hotel: "bg-blue-500",
      vet: "bg-green-500",
      petshop: "bg-purple-500",
      park: "bg-emerald-500",
      grooming: "bg-pink-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No listings found. Add your first listing to get started!
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(listing.category)}>
                      {listing.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{listing.address}</TableCell>
                  <TableCell>
                    {listing.tag && (
                      <Badge variant="outline">{listing.tag}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(listing.mapsLink, "_blank")}
                        title="Open in Maps"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(listing)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(listing.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
