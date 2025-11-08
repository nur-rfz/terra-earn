import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, DollarSign, Clock, TrendingUp, User, Map as MapIcon, List, Loader2, RefreshCw } from "lucide-react";
import MapView from "@/components/MapView";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MicroJob {
  id: string;
  title: string;
  location: string;
  reward: number;
  duration: number | string;
  category: "trash" | "pollution" | "reporting";
  urgency: "low" | "medium" | "high" | "critical";
  distance: string;
  lat: number;
  lng: number;
  description?: string;
  reportedAt?: string;
}

const mockJobs: MicroJob[] = [
  {
    id: "1",
    title: "Trash Pickup - Central Park",
    location: "Central Park, Zone A",
    reward: 15,
    duration: 30,
    category: "trash",
    urgency: "high",
    distance: "0.3 mi",
    lat: 40.785091,
    lng: -73.968285
  },
  {
    id: "2",
    title: "Report Illegal Dumping",
    location: "Industrial Area, Sector 4",
    reward: 10,
    duration: 15,
    category: "reporting",
    urgency: "medium",
    distance: "1.2 mi",
    lat: 40.778912,
    lng: -73.956542
  },
  {
    id: "3",
    title: "Beach Cleanup Initiative",
    location: "Coastal Beach Access Point",
    reward: 25,
    duration: 60,
    category: "trash",
    urgency: "high",
    distance: "2.5 mi",
    lat: 40.792865,
    lng: -73.978523
  },
  {
    id: "4",
    title: "Monitor Water Quality",
    location: "Riverside Park, North End",
    reward: 20,
    duration: 45,
    category: "pollution",
    urgency: "low",
    distance: "0.8 mi",
    lat: 40.788234,
    lng: -73.965432
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<MicroJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const previousJobIds = useRef<Set<string>>(new Set());

  const fetchJobs = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const { data, error } = await supabase.functions.invoke('get-environmental-jobs');
      
      if (error) throw error;
      
      if (data?.jobs) {
        const newJobs = data.jobs;
        
        // Detect new critical/high urgency jobs
        if (isAutoRefresh && previousJobIds.current.size > 0) {
          const criticalNewJobs = newJobs.filter(
            (job: MicroJob) => 
              !previousJobIds.current.has(job.id) && 
              (job.urgency === 'critical' || job.urgency === 'high')
          );
          
          if (criticalNewJobs.length > 0) {
            toast({
              title: "🚨 New Critical Jobs Available!",
              description: `${criticalNewJobs.length} urgent cleanup ${criticalNewJobs.length === 1 ? 'opportunity' : 'opportunities'} nearby`,
              duration: 5000,
            });
          }
        }
        
        // Update jobs and track IDs
        previousJobIds.current = new Set(newJobs.map((job: MicroJob) => job.id));
        setJobs(newJobs);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (!isAutoRefresh) {
        toast({
          title: "Error loading jobs",
          description: "Failed to load environmental jobs. Please try again.",
          variant: "destructive",
        });
        // Fallback to mock data
        setJobs(mockJobs);
        previousJobIds.current = new Set(mockJobs.map(job => job.id));
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchJobs(true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case "critical": return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDuration = (duration: number | string) => {
    if (typeof duration === 'string') return duration;
    return `${duration} min`;
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

        {/* View Toggle and Jobs */}
        <Tabs defaultValue="list" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Nearby Jobs
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchJobs(true)}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              {!loading && (
                <span className="text-xs text-muted-foreground">
                  Updated {Math.floor((new Date().getTime() - lastRefresh.getTime()) / 1000)}s ago
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TabsList className="grid w-[140px] grid-cols-2">
                <TabsTrigger value="list" className="text-xs">
                  <List className="w-4 h-4 mr-1" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map" className="text-xs">
                  <MapIcon className="w-4 h-4 mr-1" />
                  Map
                </TabsTrigger>
              </TabsList>
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
          </div>

          <TabsContent value="list" className="mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
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
                          {formatDuration(job.duration)}
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
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <MapView jobs={jobs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
