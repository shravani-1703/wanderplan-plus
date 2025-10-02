import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">TravelPlanner</h1>
          <Button variant="outline" onClick={() => navigate("/community")}>
            <Users className="w-4 h-4" />
            Community Trips
          </Button>
        </div>
      </header>

      <Hero />
      <Features />
    </div>
  );
};

export default Index;
