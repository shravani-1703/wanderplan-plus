import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface POICardProps {
  image: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  duration?: string;
  distance?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const POICard = ({
  image,
  name,
  rating,
  reviewCount,
  category,
  duration,
  distance,
  selected = false,
  onClick
}: POICardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 shadow-card hover:shadow-card-hover",
        "hover:-translate-y-1",
        selected && "ring-2 ring-primary shadow-card-hover"
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="backdrop-blur-sm bg-card/90">
            {category}
          </Badge>
        </div>
        {selected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl-custom">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          )}
          {distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{distance}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
