import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, Award, Target, Users, Leaf, Trophy, CheckCircle2, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [completions, setCompletions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobCompletions();
  }, []);

  const fetchJobCompletions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to view your history");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from('job_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setCompletions(data || []);
    } catch (error: any) {
      console.error('Error fetching completions:', error);
      toast.error("Failed to load job history");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalEarned: completions.reduce((sum, c) => sum + parseFloat(c.reward_amount || 0), 0),
    jobsCompleted: completions.length,
    impactScore: Math.min(completions.length * 5, 100),
    hoursContributed: completions.length * 0.5
  };

  const achievements = [
    { icon: "🌟", title: "First Job", description: "Completed your first microjob", earned: completions.length >= 1 },
    { icon: "🏆", title: "10 Jobs Done", description: "Reached 10 completed jobs", earned: completions.length >= 10 },
    { icon: "🌱", title: "Eco Warrior", description: "Complete 5 jobs", earned: completions.length >= 5 },
    { icon: "💎", title: "50 Jobs", description: "Complete 50 microjobs", earned: completions.length >= 50 },
  ];

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
            <h1 className="text-lg font-semibold text-foreground">Impact Dashboard</h1>
            <p className="text-xs text-muted-foreground">Your environmental journey</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <Card className="border-l-4 border-l-primary animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl">Your Impact</CardTitle>
            <CardDescription>Track your environmental contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                  <DollarSign className="w-6 h-6" />
                  {stats.totalEarned.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Earned</div>
              </div>
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <div className="text-3xl font-bold text-accent">{stats.jobsCompleted}</div>
                <div className="text-sm text-muted-foreground mt-1">Jobs Done</div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impact Score</span>
                <span className="font-semibold text-foreground">{stats.impactScore}/100</span>
              </div>
              <Progress value={stats.impactScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete more jobs to increase your impact!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stats.hoursContributed.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{completions.length}</div>
                  <div className="text-xs text-muted-foreground">Tasks Done</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock badges by completing jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
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

        {/* Job History with Photos */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Completed Jobs
            </CardTitle>
            <CardDescription>
              Your job history with verification photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-4">Loading...</p>
            ) : completions.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No completed jobs yet. Start making an impact!
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate("/home")}
                >
                  Find Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {completions.map((completion) => (
                  <div key={completion.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Job #{completion.job_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(completion.completed_at).toLocaleDateString()} at {new Date(completion.completed_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        ${parseFloat(completion.reward_amount).toFixed(2)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Before</p>
                        <div className="aspect-video rounded border border-border overflow-hidden bg-muted">
                          {completion.before_photo_url ? (
                            <img
                              src={completion.before_photo_url}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No photo
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">After</p>
                        <div className="aspect-video rounded border border-border overflow-hidden bg-muted">
                          {completion.after_photo_url ? (
                            <img
                              src={completion.after_photo_url}
                              alt="After"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              No photo
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        completion.status === 'verified' 
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-accent/10 text-accent border-accent/20'
                      }`}
                    >
                      {completion.status === 'pending_verification' ? '⏳ Pending Verification' : '✓ Verified'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
