import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Award, MapPin, DollarSign, Leaf, Users } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalEarnings: 340,
    jobsCompleted: 12,
    areasHelped: 8,
    impactScore: 87,
    rank: "Community Hero",
    nextBadge: "Environmental Champion"
  };

  const recentJobs = [
    { title: "Beach Cleanup", location: "Coastal Area", reward: 25, date: "2 days ago" },
    { title: "Park Trash Pickup", location: "Central Park", reward: 15, date: "5 days ago" },
    { title: "Water Quality Report", location: "River North", reward: 20, date: "1 week ago" }
  ];

  const achievements = [
    { icon: "🌟", title: "First Job", description: "Completed your first microjob", earned: true },
    { icon: "🏆", title: "10 Jobs Done", description: "Reached 10 completed jobs", earned: true },
    { icon: "🌱", title: "Eco Warrior", description: "5 consecutive weeks active", earned: true },
    { icon: "💎", title: "50 Jobs", description: "Complete 50 microjobs", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
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
            <h1 className="text-lg font-semibold text-foreground">Impact Dashboard</h1>
            <p className="text-xs text-muted-foreground">Your environmental journey</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Stats */}
        <Card className="border-l-4 border-l-primary bg-gradient-to-br from-card to-primary/5 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl">Your Impact</span>
              <Badge className="bg-primary text-primary-foreground">
                <Award className="w-3 h-3 mr-1" />
                {stats.rank}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-card rounded-lg">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {stats.totalEarnings}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Earned</div>
              </div>
              <div className="text-center p-3 bg-card rounded-lg">
                <div className="text-3xl font-bold text-accent">{stats.jobsCompleted}</div>
                <div className="text-sm text-muted-foreground mt-1">Jobs Done</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impact Score</span>
                <span className="font-semibold text-foreground">{stats.impactScore}/100</span>
              </div>
              <Progress value={stats.impactScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Keep going to unlock: <span className="text-primary font-medium">{stats.nextBadge}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.areasHelped}</div>
                  <div className="text-xs text-muted-foreground">Areas Cleaned</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">2.4</div>
                  <div className="text-xs text-muted-foreground">Tons Collected</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{job.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location} • {job.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.reward}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-2 text-center ${
                    achievement.earned 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-muted/20 border-border opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-sm text-foreground">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{achievement.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
