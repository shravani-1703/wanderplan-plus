import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import { useNavigate } from "react-router-dom";
export const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Travel destination" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-card mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Next Adventure
            
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Plan unforgettable trips with AI-powered itineraries, discover hidden gems, and travel smarter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button variant="hero" size="xl" onClick={() => navigate("/plan")} className="min-w-[200px]">
              <MapPin className="w-5 h-5" />
              Start Planning
            </Button>
            
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Travelers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

    </section>;
};