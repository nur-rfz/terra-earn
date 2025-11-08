import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, Award } from "lucide-react";
import heroImage from "@/assets/hero-environmental.jpg";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Leaf className="w-16 h-16 text-primary" />,
      title: "Turn Data Into Action",
      description: "We analyze environmental hazard data to identify problem areas in your community that need attention.",
    },
    {
      icon: <MapPin className="w-16 h-16 text-accent" />,
      title: "Complete Local Microjobs",
      description: "Accept nearby jobs like trash pickup or reporting pollution. Each task is simple, quick, and makes a real difference.",
    },
    {
      icon: <Award className="w-16 h-16 text-primary" />,
      title: "Earn Rewards & Impact",
      description: "Get paid for your work and track your environmental impact. Watch your community transform with every job completed.",
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/home");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Hero Image */}
      <div className="w-full h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Environmental action" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-8 animate-fade-in">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md">
          <div className="mb-6 animate-scale-in">
            {currentStep.icon}
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4 animate-slide-up">
            {currentStep.title}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {currentStep.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="w-full max-w-md space-y-4">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === step 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <Button 
            onClick={handleNext}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            size="lg"
          >
            {step < steps.length - 1 ? "Next" : "Get Started"}
          </Button>

          {step < steps.length - 1 && (
            <Button 
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
