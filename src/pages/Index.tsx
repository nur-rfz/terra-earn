import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/10 px-4">
      <div className="text-center max-w-2xl animate-fade-in">
        <div className="mb-6 flex justify-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-foreground mb-4 animate-slide-up">
          EcoAction
        </h1>
        
        <p className="text-xl text-muted-foreground mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Turn environmental data into local action
        </p>
        
        <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Complete microjobs, earn rewards, and help clean your community
        </p>
        
        <Button 
          size="lg"
          onClick={() => navigate("/onboarding")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          Get Started
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
