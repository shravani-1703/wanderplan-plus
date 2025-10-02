import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Users, Heart, Search, Filter, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import poiBeach from "@/assets/poi-beach.jpg";
import poiTemple from "@/assets/poi-temple.jpg";
import poiMarket from "@/assets/poi-market.jpg";

const communityItineraries = [
  {
    id: "1",
    title: "Bali Cultural Experience",
    destination: "Bali, Indonesia",
    duration: "5 days",
    creator: "Sarah M.",
    image: poiTemple,
    topPOIs: ["Ancient Temple", "Local Market", "Paradise Beach"],
    tags: ["Culture", "Nature", "Food"],
    likes: 234,
    type: "Family"
  },
  {
    id: "2",
    title: "Adventure Paradise",
    destination: "Bali, Indonesia",
    duration: "3 days",
    creator: "John D.",
    image: poiBeach,
    topPOIs: ["Sunset Point", "Paradise Beach", "Mountain Trek"],
    tags: ["Adventure", "Nature"],
    likes: 189,
    type: "Friends"
  },
  {
    id: "3",
    title: "Food & Culture Tour",
    destination: "Bali, Indonesia",
    duration: "4 days",
    creator: "Maria L.",
    image: poiMarket,
    topPOIs: ["Traditional Restaurant", "Local Market", "Cooking Class"],
    tags: ["Food", "Culture"],
    likes: 312,
    type: "Solo"
  }
];

export default function Community() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [likedItineraries, setLikedItineraries] = useState<string[]>([]);

  const handleLike = (id: string) => {
    setLikedItineraries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleJoinRequest = (id: string) => {
    // TODO: Implement join request logic
    alert("Join request sent! The trip owner will review your request.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold">Community Trips</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            Discover Amazing Trips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse itineraries from fellow travelers and request to join their adventures
          </p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="max-w-4xl mx-auto mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pinterest-style Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {communityItineraries.map((trip) => (
            <Card
              key={trip.id}
              className="group overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {trip.topPOIs.slice(0, 2).map((poi, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {poi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3">{trip.type}</Badge>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl mb-2">{trip.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {trip.destination}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {trip.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      by {trip.creator}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trip.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(trip.id);
                      }}
                      className={likedItineraries.includes(trip.id) ? "text-red-500" : ""}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedItineraries.includes(trip.id) ? "fill-current" : ""
                        }`}
                      />
                      {trip.likes + (likedItineraries.includes(trip.id) ? 1 : 0)}
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinRequest(trip.id);
                      }}
                    >
                      Request to Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for Search */}
        {searchQuery && communityItineraries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trips found. Try different search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
