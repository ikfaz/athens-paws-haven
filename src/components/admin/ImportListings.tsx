import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface RawPlace {
  name: string;
  website?: string;
  phone?: string;
  address: string;
  image: string;
  maps_link: string;
}

export const ImportListings = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = async (file: File): Promise<RawPlace[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

    // Detect if first row is headers
    const firstRow = rows[0] as string[];
    const hasHeaders = firstRow?.some(
      (cell) =>
        typeof cell === "string" &&
        ["name", "site", "phone", "full_address"].includes(cell.toLowerCase())
    );

    const dataRows = hasHeaders ? rows.slice(1) : rows;
    const places: RawPlace[] = [];

    for (const row of dataRows) {
      const cells = row as any[];
      if (!cells || cells.length < 17) continue;

      const name = String(cells[0] || "").trim();
      const website = String(cells[1] || "").trim();
      const phone = String(cells[2] || "").trim();
      const address = String(cells[3] || "").trim();
      const status = String(cells[15] || "").trim();
      const mapsLink = String(cells[16] || "").trim();

      // Use the large photo (col 13) or small photo (col 12)
      const image = String(cells[13] || cells[12] || "").trim();

      // Skip empty rows, header rows, or permanently closed places
      if (!name || name === "name" || !address || !mapsLink) continue;
      if (status === "CLOSED_PERMANENTLY") continue;

      places.push({
        name,
        website: website || undefined,
        phone: phone || undefined,
        address,
        image: image || "/placeholder.svg",
        maps_link: mapsLink,
      });
    }

    return places;
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setProgress("Parsing file...");

    try {
      const places = await parseFile(file);

      if (places.length === 0) {
        toast({
          title: "No data found",
          description: "The file doesn't contain valid place data.",
          variant: "destructive",
        });
        return;
      }

      setProgress(`Found ${places.length} places. Sending for AI classification...`);

      // Send in batches of 60 to the edge function (which will sub-batch internally)
      const BATCH_SIZE = 60;
      let totalInserted = 0;

      for (let i = 0; i < places.length; i += BATCH_SIZE) {
        const batch = places.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(places.length / BATCH_SIZE);

        setProgress(
          `Processing batch ${batchNum}/${totalBatches} (${batch.length} places)...`
        );

        const { data, error } = await supabase.functions.invoke(
          "import-listings",
          { body: { places: batch } }
        );

        if (error) {
          console.error("Import batch error:", error);
          toast({
            title: `Batch ${batchNum} failed`,
            description: error.message,
            variant: "destructive",
          });
        } else {
          totalInserted += data?.total_inserted || 0;
        }
      }

      setProgress("");
      toast({
        title: "Import complete!",
        description: `Successfully imported ${totalInserted} listings out of ${places.length} places.`,
      });

      // Reload to see new listings
      window.location.reload();
    } catch (err) {
      console.error("Import error:", err);
      toast({
        title: "Import failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ods,.xlsx,.xls,.csv"
        onChange={handleImport}
        className="hidden"
        disabled={isImporting}
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {progress || "Importing..."}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Import from Spreadsheet
          </>
        )}
      </Button>
      {progress && (
        <p className="text-xs text-muted-foreground mt-2">{progress}</p>
      )}
    </div>
  );
};
