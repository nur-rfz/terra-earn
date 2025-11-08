import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, TrendingUp, User } from "lucide-react";

interface MicroJob {
  id: string;
  title: string;
  location: string;
  reward: number;
  duration: string;
  category: "trash" | "pollution" | "reporting";
  urgency: "low" | "medium" | "high";
  distance: string;
}

const mockJobs: MicroJob[] = [
  {
    id: "1",
    title: "Trash Pickup - Central Park",
    location: "Central Park, Zone A",
    reward: 15,
    duration: "30 min",
    category: "trash",
    urgency: "high",
    distance: "0.3 mi"
  },
  {
    id: "2",
    title: "Report Illegal Dumping",
    location: "Industrial Area, Sector 4",
    reward: 10,
    duration: "15 min",
    category: "reporting",
    urgency: "medium",
    distance: "1.2 mi"
  },
  {
    id: "3",
    title: "Beach Cleanup Initiative",
    location: "Coastal Beach Access Point",
    reward: 25,
    duration: "1 hour",
    category: "trash",
    urgency: "high",
    distance: "2.5 mi"
  },
  {
    id: "4",
    title: "Monitor Water Quality",
    location: "Riverside Park, North End",
    reward: 20,
    duration: "45 min",
    category: "pollution",
    urgency: "low",
    distance: "0.8 mi"
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [jobs] = useState<MicroJob[]>(mockJobs);

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryIcon = (category: string) => {
    return "🌱";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">🌍</span> EcoAction
            </h1>
            <p className="text-sm text-muted-foreground">Local jobs, global impact</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in">
          <Card className="shadow-sm border-primary/20">
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-primary">{jobs.length}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-accent/20">
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-accent">$70</div>
              <div className="text-xs text-muted-foreground">Potential</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Jobs
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:text-primary/80"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            My Impact
          </Button>
        </div>

        {/* Jobs List */}
        <div className="space-y-3 animate-slide-up">
          {jobs.map((job, index) => (
            <Card 
              key={job.id} 
              className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/50"
              onClick={() => navigate(`/job/${job.id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span>{getCategoryIcon(job.category)}</span>
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </CardDescription>
                  </div>
                  <Badge className={getUrgencyColor(job.urgency)} variant="outline">
                    {job.urgency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.distance}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <DollarSign className="w-4 h-4" />
                    {job.reward}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
