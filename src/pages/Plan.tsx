import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { POICard } from "@/components/POICard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Calendar, Users, ArrowRight, ArrowLeft, User, UserPlus, Heart, Mountain, Landmark, Utensils, Palette, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import poiBeach from "@/assets/poi-beach.jpg";
import poiTemple from "@/assets/poi-temple.jpg";
import poiMarket from "@/assets/poi-market.jpg";

const tripTypes = [
  { 
    id: "solo", 
    label: "Solo", 
    icon: User,
    description: "Travel at your own pace, explore freely",
    benefits: ["Complete flexibility", "Self-discovery", "Meet new people"]
  },
  { 
    id: "family", 
    label: "Family", 
    icon: Heart,
    description: "Quality time with loved ones",
    benefits: ["Kid-friendly activities", "Group discounts", "Shared memories"]
  },
  { 
    id: "friends", 
    label: "Friends", 
    icon: UserPlus,
    description: "Adventure with your crew",
    benefits: ["Shared experiences", "Split costs", "More fun activities"]
  },
  { 
    id: "stranger", 
    label: "Join Trip", 
    icon: Users,
    description: "Meet fellow travelers",
    benefits: ["Make new friends", "Share costs", "Local insights"]
  }
];

const moodCategories = [
  { id: "adventure", label: "Adventure", icon: Mountain, color: "text-orange-500" },
  { id: "historical", label: "Historical", icon: Landmark, color: "text-amber-600" },
  { id: "nature", label: "Nature", icon: Sparkles, color: "text-green-500" },
  { id: "food", label: "Food", icon: Utensils, color: "text-red-500" },
  { id: "culture", label: "Culture", icon: Palette, color: "text-purple-500" }
];

const samplePOIs = [
  {
    id: "1",
    image: poiBeach,
    name: "Paradise Beach",
    rating: 4.8,
    reviewCount: 1234,
    category: "nature",
    duration: "2-3 hours",
    distance: "5 km",
    openingHours: "6:00 AM - 7:00 PM"
  },
  {
    id: "2",
    image: poiTemple,
    name: "Ancient Temple",
    rating: 4.9,
    reviewCount: 856,
    category: "historical",
    duration: "1-2 hours",
    distance: "3 km",
    openingHours: "9:00 AM - 6:00 PM"
  },
  {
    id: "3",
    image: poiMarket,
    name: "Local Market",
    rating: 4.7,
    reviewCount: 2341,
    category: "culture",
    duration: "2-4 hours",
    distance: "1 km",
    openingHours: "7:00 AM - 9:00 PM"
  },
  {
    id: "4",
    image: poiBeach,
    name: "Sunset Point",
    rating: 4.6,
    reviewCount: 892,
    category: "adventure",
    duration: "1-2 hours",
    distance: "8 km",
    openingHours: "Open 24 hours"
  },
  {
    id: "5",
    image: poiMarket,
    name: "Traditional Restaurant",
    rating: 4.9,
    reviewCount: 1567,
    category: "food",
    duration: "1-2 hours",
    distance: "2 km",
    openingHours: "11:00 AM - 11:00 PM"
  }
];

export default function Plan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [dates, setDates] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPOIs, setSelectedPOIs] = useState<string[]>([]);

  const handleMoodToggle = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId) ? prev.filter(m => m !== moodId) : [...prev, moodId]
    );
  };

  const handlePOIToggle = (id: string) => {
    setSelectedPOIs(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredPOIs = selectedMoods.length > 0
    ? samplePOIs.filter(poi => selectedMoods.includes(poi.category))
    : samplePOIs;

  const handleNext = () => {
    if (step === 1 && destination && tripType) {
      setStep(2);
    } else if (step === 2 && selectedPOIs.length > 0) {
      navigate("/itinerary", { state: { destination, tripType, travelers, dates, selectedPOIs } });
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step >= 1 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`w-16 h-0.5 transition-all ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step >= 2 ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {step === 1 && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Where to?
              </h1>
              <p className="text-xl text-muted-foreground">
                Tell us about your dream destination and travel style
              </p>
            </div>

            <Card className="shadow-card-hover">
              <CardContent className="p-8 space-y-8">
                {/* Destination Input */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-lg">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder="Search destinations... (e.g., Bali, Paris, Tokyo)"
                      className="pl-10 h-14 text-lg"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                {/* Trip Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg">Trip Type</Label>
                  <TooltipProvider>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tripTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = tripType === type.id;
                        return (
                          <Tooltip key={type.id}>
                            <TooltipTrigger asChild>
                              <Card
                                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                                  isSelected
                                    ? "ring-2 ring-primary shadow-xl bg-primary/5"
                                    : "hover:shadow-card-hover"
                                }`}
                                onClick={() => setTripType(type.id)}
                              >
                                <CardContent className="p-6 flex flex-col items-center gap-3">
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    <Icon className="w-6 h-6" />
                                  </div>
                                  <span className="font-medium text-center">{type.label}</span>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <p className="font-medium">{type.description}</p>
                                <ul className="text-sm space-y-1">
                                  {type.benefits.map((benefit, idx) => (
                                    <li key={idx}>• {benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </div>

                {/* Dates and Travelers */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dates">Travel Dates</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="dates"
                        type="date"
                        className="pl-10"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="travelers"
                        type="number"
                        placeholder="2"
                        className="pl-10"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                  disabled={!destination || !tripType}
                >
                  Continue to POI Selection
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
                Filter by mood and select places you'd like to visit
              </p>
            </div>

            {/* Mood Filter Panel */}
            <Card className="max-w-4xl mx-auto shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {moodCategories.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMoods.includes(mood.id);
                    return (
                      <Badge
                        key={mood.id}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 transition-all duration-300 hover:scale-105 ${
                          isSelected ? "shadow-lg" : ""
                        }`}
                        onClick={() => handleMoodToggle(mood.id)}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${mood.color}`} />
                        {mood.label}
                      </Badge>
                    );
                  })}
                  {selectedMoods.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer px-4 py-2"
                      onClick={() => setSelectedMoods([])}
                    >
                      Clear Filters
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* POI Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredPOIs.map((poi) => (
                <div key={poi.id} className="group">
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedPOIs.includes(poi.id)
                        ? "ring-2 ring-primary shadow-xl"
                        : ""
                    }`}
                    onClick={() => handlePOIToggle(poi.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                        <img
                          src={poi.image}
                          alt={poi.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <Badge className="absolute top-3 left-3 capitalize">
                          {poi.category}
                        </Badge>
                        {selectedPOIs.includes(poi.id) && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg">{poi.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⭐ {poi.rating}</span>
                          <span>⏱️ {poi.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{poi.openingHours}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {selectedPOIs.length > 0 && (
              <Card className="max-w-4xl mx-auto shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedPOIs.length} place{selectedPOIs.length !== 1 ? "s" : ""} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPOIs([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                Generate Itinerary
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
