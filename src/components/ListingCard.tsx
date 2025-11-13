import { Listing } from "@/types/listing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { stripProtocol, ensureProtocol } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": listing.name,
    "description": listing.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": listing.address,
      "addressLocality": "Athens",
      "addressCountry": "GR"
    },
    ...(listing.phone && { "telephone": listing.phone }),
    ...(listing.email && { "email": listing.email }),
    ...(listing.website && { "url": `https://${listing.website}` }),
    "image": listing.image
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Card className="overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.image}
            alt={`${listing.name} - Pet-friendly ${listing.category} in Athens`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        <div className="absolute inset-0 bg-gradient-card" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{listing.name}</CardTitle>
        <CardDescription className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <span>{listing.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{listing.description}</p>
        
        <div className="space-y-2 text-sm">
          {listing.phone && (
            <a 
              href={`tel:${listing.phone}`}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{listing.phone}</span>
            </a>
          )}
          {listing.email && (
            <a 
              href={`mailto:${listing.email}`}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{listing.email}</span>
            </a>
          )}
          {listing.website && (
            <a 
              href={ensureProtocol(listing.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{stripProtocol(listing.website)}</span>
            </a>
          )}
        </div>

        <Button 
          variant="default" 
          className="w-full"
          asChild
        >
          <a 
            href={listing.mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
    </>
  );
};

export default ListingCard;
