import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Calendar, Download, Share2, Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import poiBeach from "@/assets/poi-beach.jpg";
import poiTemple from "@/assets/poi-temple.jpg";
import poiMarket from "@/assets/poi-market.jpg";

const itineraryDays = [
  {
    day: 1,
    date: "March 15, 2025",
    activities: [
      {
        time: "09:00 AM",
        name: "Paradise Beach",
        image: poiBeach,
        duration: "3 hours",
        rating: 4.8,
        category: "Beach"
      },
      {
        time: "02:00 PM",
        name: "Local Market",
        image: poiMarket,
        duration: "2 hours",
        rating: 4.7,
        category: "Culture"
      }
    ]
  },
  {
    day: 2,
    date: "March 16, 2025",
    activities: [
      {
        time: "10:00 AM",
        name: "Ancient Temple",
        image: poiTemple,
        duration: "2 hours",
        rating: 4.9,
        category: "Historic"
      }
    ]
  }
];

export default function Itinerary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/plan")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Planning
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="accent" size="sm">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Trip Header */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              2 Day Trip
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your Bali Adventure
            </h1>
            <p className="text-xl text-muted-foreground">
              March 15-16, 2025 • 2 Travelers
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Destinations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">7 hrs</div>
                  <div className="text-sm text-muted-foreground">Activity Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">9 km</div>
                  <div className="text-sm text-muted-foreground">Total Distance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Itinerary Days */}
        <div className="max-w-4xl mx-auto space-y-8">
          {itineraryDays.map((day) => (
            <div key={day.day} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                  D{day.day}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Day {day.day}</h2>
                  <p className="text-muted-foreground">{day.date}</p>
                </div>
              </div>

              <div className="space-y-4 ml-6 border-l-2 border-border pl-6">
                {day.activities.map((activity, idx) => (
                  <Card key={idx} className="shadow-card hover:shadow-card-hover transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[200px_1fr] gap-4">
                        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-l-lg">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                          />
                          <Badge className="absolute top-3 right-3" variant="secondary">
                            {activity.category}
                          </Badge>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Clock className="w-4 h-4" />
                              {activity.time}
                            </div>
                            <h3 className="text-xl font-semibold">{activity.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-secondary text-secondary" />
                                <span className="font-medium text-sm">{activity.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">{activity.duration}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MapPin className="w-4 h-4" />
                              View Map
                            </Button>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-muted/30 rounded-lg border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Ready for your adventure?</h3>
              <p className="text-muted-foreground">Download your itinerary and access it offline</p>
            </div>
            <Button variant="hero" size="lg">
              <Download className="w-5 h-5" />
              Download Offline Pack
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
