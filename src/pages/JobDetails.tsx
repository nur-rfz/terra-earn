import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { JobClaimFlow } from "@/components/JobClaimFlow";

interface Job {
  id: string;
  title: string;
  location: string;
  reward: number;
  duration: number | string;
  category: string;
  urgency: string;
  distance: string;
  description: string;
  lat: number;
  lng: number;
  reportedAt: string;
}

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completionId, setCompletionId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobDetails();
    checkAuthAndJobStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-environmental-jobs');
      
      if (error) throw error;
      
      const foundJob = data?.jobs?.find((j: Job) => j.id === id);
      if (foundJob) {
        setJob(foundJob);
      } else {
        toast.error("Job not found");
        navigate("/home");
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error("Failed to load job details");
    }
  };

  const checkAuthAndJobStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to accept jobs");
      navigate("/login");
      return;
    }

    // Check if user has already claimed this job
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('job-actions', {
        body: { action: 'check', jobId: id },
      });

      if (error) throw error;

      if (data?.data?.completion) {
        setCompletionId(data.data.completion.id);
        setStatus(data.data.completion.status);
      }
    } catch (error) {
      console.error('Error checking job status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = () => {
    checkAuthAndJobStatus();
  };

  const requirements = [
    "Smartphone for photo verification",
    "Comfortable walking shoes",
    "Weather-appropriate clothing"
  ];

  const steps = [
    "Accept the job and head to location",
    "Check in using the app when you arrive",
    "Complete the cleanup task",
    "Take before/after photos",
    "Submit for verification"
  ];

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (!status) return { text: "Available", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30" };
    
    switch(status) {
      case "claimed": return { text: "Claimed", color: "bg-accent/10 text-accent border-accent/20" };
      case "in_progress": return { text: "In Progress", color: "bg-primary/10 text-primary border-primary/20" };
      case "completed": return { text: "Completed", color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30" };
      case "pending_verification": return { text: "Under Review", color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30" };
      default: return { text: "Available", color: "bg-muted text-muted-foreground border-border" };
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
              <Badge className={getStatusBadge().color} variant="outline">
                {getStatusBadge().text}
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
                  {typeof job.duration === 'number' ? `${job.duration} min` : job.duration}
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
              {requirements.map((req, index) => (
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
              {steps.map((step, index) => (
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

        {/* Job Claim Flow */}
        {!loading && (
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <JobClaimFlow
              jobId={id!}
              jobTitle={job.title}
              rewardAmount={job.reward}
              completionId={completionId}
              status={status}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default JobDetails;
