import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"available" | "accepted" | "in-progress" | "completed">("available");

  // Mock job data
  const job = {
    id,
    title: "Trash Pickup - Central Park",
    location: "Central Park, Zone A",
    reward: 15,
    duration: "30 min",
    category: "trash",
    urgency: "high",
    distance: "0.3 mi",
    description: "Help keep our park clean by collecting litter in designated Zone A. Trash bags and gloves will be provided at the park entrance. Focus on areas around benches and pathways.",
    requirements: [
      "Smartphone for photo verification",
      "Comfortable walking shoes",
      "Weather-appropriate clothing"
    ],
    steps: [
      "Accept the job and head to location",
      "Check in using the app when you arrive",
      "Complete the cleanup task",
      "Take before/after photos",
      "Submit for verification"
    ]
  };

  const handleAcceptJob = () => {
    setStatus("accepted");
    toast.success("Job accepted! Head to the location to begin.", {
      description: "Don't forget to check in when you arrive."
    });
  };

  const handleStartJob = () => {
    setStatus("in-progress");
    toast.info("Job started! Complete the task and submit photos when done.");
  };

  const handleCompleteJob = () => {
    setStatus("completed");
    toast.success("Job completed! Your submission is being verified.", {
      description: `You earned $${job.reward}!`
    });
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  const getStatusColor = () => {
    switch(status) {
      case "accepted": return "bg-accent/10 text-accent border-accent/20";
      case "in-progress": return "bg-primary/10 text-primary border-primary/20";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Job Details</h1>
            <p className="text-xs text-muted-foreground">Review and accept</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Status Card */}
        <Card className="border-l-4 border-l-primary animate-fade-in">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  {job.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-base">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </CardDescription>
              </div>
              <Badge className={getStatusColor()} variant="outline">
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {job.reward}
                </div>
                <div className="text-xs text-muted-foreground">Reward</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                  <Clock className="w-5 h-5" />
                  {job.duration}
                </div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {job.distance}
                </div>
                <div className="text-xs text-muted-foreground">Distance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              What You'll Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {req}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {job.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </main>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border shadow-lg">
        <div className="container mx-auto">
          {status === "available" && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              size="lg"
              onClick={handleAcceptJob}
            >
              Accept Job
            </Button>
          )}
          {status === "accepted" && (
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
              size="lg"
              onClick={handleStartJob}
            >
              Start Job
            </Button>
          )}
          {status === "in-progress" && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              size="lg"
              onClick={handleCompleteJob}
            >
              Complete & Submit
            </Button>
          )}
          {status === "completed" && (
            <Button 
              className="w-full bg-primary/10 text-primary"
              size="lg"
              disabled
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
