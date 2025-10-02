import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POICard } from "@/components/POICard";
import { MapPin, Calendar, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import poiBeach from "@/assets/poi-beach.jpg";
import poiTemple from "@/assets/poi-temple.jpg";
import poiMarket from "@/assets/poi-market.jpg";

const samplePOIs = [
  {
    id: "1",
    image: poiBeach,
    name: "Paradise Beach",
    rating: 4.8,
    reviewCount: 1234,
    category: "Beach",
    duration: "2-3 hours",
    distance: "5 km"
  },
  {
    id: "2",
    image: poiTemple,
    name: "Ancient Temple",
    rating: 4.9,
    reviewCount: 856,
    category: "Historic",
    duration: "1-2 hours",
    distance: "3 km"
  },
  {
    id: "3",
    image: poiMarket,
    name: "Local Market",
    rating: 4.7,
    reviewCount: 2341,
    category: "Culture",
    duration: "2-4 hours",
    distance: "1 km"
  }
];

export default function Plan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [selectedPOIs, setSelectedPOIs] = useState<string[]>([]);

  const handlePOIToggle = (id: string) => {
    setSelectedPOIs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && destination) {
      setStep(2);
    } else if (step === 2 && selectedPOIs.length > 0) {
      navigate("/itinerary");
    }
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
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Where to?
              </h1>
              <p className="text-xl text-muted-foreground">
                Tell us about your dream destination
              </p>
            </div>

            <Card className="shadow-card-hover">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-lg">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="e.g., Bali, Indonesia"
                      className="pl-10 h-12 text-lg"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dates">Travel Dates</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="dates"
                        type="date"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelers">Travelers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="travelers"
                        type="number"
                        placeholder="2"
                        className="pl-10"
                        defaultValue="2"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                  disabled={!destination}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                What interests you?
              </h1>
              <p className="text-xl text-muted-foreground">
                Select places you'd like to visit
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {samplePOIs.map((poi) => (
                <POICard
                  key={poi.id}
                  {...poi}
                  selected={selectedPOIs.includes(poi.id)}
                  onClick={() => handlePOIToggle(poi.id)}
                />
              ))}
            </div>

            <div className="max-w-2xl mx-auto flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleNext}
                disabled={selectedPOIs.length === 0}
              >
                Create Itinerary
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
