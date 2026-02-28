import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RawPlace {
  name: string;
  website?: string;
  phone?: string;
  address: string;
  image: string;
  maps_link: string;
}

interface ClassifiedPlace extends RawPlace {
  category: string;
  description: string;
}

async function classifyBatch(
  places: RawPlace[],
  apiKey: string
): Promise<ClassifiedPlace[]> {
  const namesList = places
    .map((p, i) => `${i + 1}. "${p.name}" (address: ${p.address})`)
    .join("\n");

  const response = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You classify pet-friendly places in Athens, Greece into categories and generate short descriptions.

Categories (pick the BEST match):
- "cafe" = cafes, restaurants, bars, bakeries, brunch spots, food places
- "hotel" = hotels, hostels, apartments, suites, residences, accommodation
- "park" = parks, gardens, groves, outdoor spaces, archaeological sites, beaches
- "petshop" = pet shops, pet stores, pet supply stores
- "vet" = veterinarians, animal clinics, pet hospitals, kennels, pet boarding
- "grooming" = grooming salons, pet grooming, pet spas
- "taxi" = pet taxi, pet transport services

Default to "cafe" if truly ambiguous.

For each place, write a 1-sentence pet-friendly description (max 120 chars). Mention it's pet-friendly.`,
          },
          {
            role: "user",
            content: `Classify these places and generate descriptions:\n${namesList}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_places",
              description: "Return classified places with categories and descriptions",
              parameters: {
                type: "object",
                properties: {
                  places: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "number", description: "1-based index" },
                        category: {
                          type: "string",
                          enum: ["cafe", "hotel", "park", "petshop", "vet", "grooming", "taxi"],
                        },
                        description: {
                          type: "string",
                          description: "Short pet-friendly description, max 120 chars",
                        },
                      },
                      required: ["index", "category", "description"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["places"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "classify_places" },
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("AI gateway error:", response.status, errText);
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("No tool call in AI response");
  }

  const parsed = JSON.parse(toolCall.function.arguments);
  const classified: ClassifiedPlace[] = [];

  for (const item of parsed.places) {
    const idx = item.index - 1;
    if (idx >= 0 && idx < places.length) {
      classified.push({
        ...places[idx],
        category: item.category,
        description: item.description,
      });
    }
  }

  return classified;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { places } = (await req.json()) as { places: RawPlace[] };

    if (!places || !Array.isArray(places) || places.length === 0) {
      return new Response(
        JSON.stringify({ error: "No places provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter out places with status CLOSED_PERMANENTLY
    const validPlaces = places.filter((p) => p.name && p.address && p.maps_link);

    console.log(`Processing ${validPlaces.length} places...`);

    const BATCH_SIZE = 20;
    const allClassified: ClassifiedPlace[] = [];
    let totalInserted = 0;

    for (let i = 0; i < validPlaces.length; i += BATCH_SIZE) {
      const batch = validPlaces.slice(i, i + BATCH_SIZE);
      console.log(`Classifying batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

      try {
        const classified = await classifyBatch(batch, LOVABLE_API_KEY);
        allClassified.push(...classified);

        // Insert this batch into DB
        const rows = classified.map((p) => ({
          name: p.name,
          category: p.category,
          address: p.address,
          description: p.description,
          phone: p.phone || null,
          website: p.website || null,
          maps_link: p.maps_link,
          image: p.image,
        }));

        const { error } = await supabase.from("listings").insert(rows);
        if (error) {
          console.error("Insert error for batch:", error);
        } else {
          totalInserted += rows.length;
        }
      } catch (batchError) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, batchError);
      }

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < validPlaces.length) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_processed: validPlaces.length,
        total_inserted: totalInserted,
        classified: allClassified.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Import error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
