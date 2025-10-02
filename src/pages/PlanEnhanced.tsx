import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Calendar, Users, ArrowRight, ArrowLeft, User, UserPlus, Heart, Mountain, Landmark, Utensils, Palette, Sparkles, Loader as Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, POI } from "@/lib/supabase";
import { toast } from "sonner";

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

export default function PlanEnhanced() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedPOIs, setSelectedPOIs] = useState<string[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (destination && step === 2) {
      fetchPOIs();
    }
  }, [destination, step]);

  const fetchPOIs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pois')
        .select('*')
        .eq('destination', destination)
        .order('rating', { ascending: false });

      if (error) throw error;
      setPois(data || []);

      if (!data || data.length === 0) {
        toast.info('No POIs found for this destination. Using sample data.');
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
      toast.error('Failed to load POIs');
    } finally {
      setLoading(false);
    }
  };

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
    ? pois.filter(poi => selectedMoods.includes(poi.category))
    : pois;

  const handleNext = async () => {
    if (step === 1 && destination && tripType && startDate && endDate) {
      setStep(2);
    } else if (step === 2 && selectedPOIs.length > 0) {
      if (!user) {
        toast.error('Please sign in to save your trip');
        navigate('/login');
        return;
      }

      setSaving(true);
      try {
        const { data: trip, error: tripError } = await supabase
          .from('trips')
          .insert({
            user_id: user.id,
            destination,
            trip_type: tripType as any,
            start_date: startDate,
            end_date: endDate,
            num_travelers: parseInt(travelers),
            status: 'planned',
          })
          .select()
          .single();

        if (tripError) throw tripError;

        navigate('/accommodation', {
          state: {
            tripId: trip.id,
            destination,
            tripType,
            travelers,
            startDate,
            endDate,
            selectedPOIs,
          },
        });
      } catch (error: any) {
        console.error('Error creating trip:', error);
        toast.error(error.message || 'Failed to create trip');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
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

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="start-date"
                          type="date"
                          className="pl-10"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="end-date"
                          type="date"
                          className="pl-10"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate}
                        />
                      </div>
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
                  disabled={!destination || !tripType || !startDate || !endDate}
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredPOIs.length === 0 ? (
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No POIs available for this destination yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredPOIs.map((poi) => (
                  <Card
                    key={poi.id}
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
                          src={poi.image_url || 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg'}
                          alt={poi.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
                          <span>⏱️ {Math.floor(poi.typical_duration / 60)}h</span>
                        </div>
                        {poi.opening_time && poi.closing_time && (
                          <p className="text-sm text-muted-foreground">
                            {poi.opening_time} - {poi.closing_time}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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
                disabled={selectedPOIs.length === 0 || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to Accommodation
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
