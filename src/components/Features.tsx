import { Map, Sparkles, Shield, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const features = [{
  icon: Sparkles,
  title: "AI-Powered Itineraries",
  description: "Get personalized trip plans tailored to your preferences, budget, and travel style.",
  color: "text-primary"
}, {
  icon: Map,
  title: "Smart Route Planning",
  description: "Optimized routes that save time and help you discover the best spots along the way.",
  color: "text-secondary"
}, {
  icon: Shield,
  title: "Safety First",
  description: "Real-time safety alerts, SOS features, and emergency contacts for peace of mind.",
  color: "text-accent"
}, {
  icon: Download,
  title: "Offline Access",
  description: "Download your itinerary and maps to access everything without internet connection.",
  color: "text-muted-foreground"
}];
export const Features = () => {
  return <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need for
            
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make travel planning effortless and enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg gradient-card flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};