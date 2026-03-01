import { useState } from "react";
import { Listing } from "@/types/listing";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { toSafeHttpUrl } from "@/lib/utils";
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

  const categoryMeta: Record<Listing["category"], { color: string; label: string }> = {
    cafe: { color: "bg-amber-500", label: "Cafe" },
    hotel: { color: "bg-blue-500", label: "Hotel" },
    vet: { color: "bg-green-500", label: "Vet" },
    petshop: { color: "bg-purple-500", label: "Pet Shop" },
    park: { color: "bg-emerald-500", label: "Park" },
    grooming: { color: "bg-pink-500", label: "Grooming" },
    taxi: { color: "bg-cyan-500", label: "Pet Taxi" },
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
              listings.map((listing) => {
                const safeMapsUrl = toSafeHttpUrl(listing.mapsLink);
                const category = categoryMeta[listing.category];

                return (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.name}</TableCell>
                    <TableCell>
                      <Badge className={category.color}>
                        {category.label}
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
                          onClick={() => {
                            if (safeMapsUrl) {
                              window.open(safeMapsUrl, "_blank", "noopener,noreferrer");
                            }
                          }}
                          title="Open in Maps"
                          disabled={!safeMapsUrl}
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
                );
              })
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
