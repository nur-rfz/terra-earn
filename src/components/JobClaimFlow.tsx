import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Camera, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JobClaimFlowProps {
  jobId: string;
  jobTitle: string;
  rewardAmount: number;
  completionId: string | null;
  status: string | null;
  onStatusChange: () => void;
}

export const JobClaimFlow = ({
  jobId,
  jobTitle,
  rewardAmount,
  completionId,
  status,
  onStatusChange,
}: JobClaimFlowProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleClaim = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('job-actions', {
        body: { action: 'claim', jobId },
      });

      if (error) throw error;

      toast({
        title: "Job claimed!",
        description: "You can now start working on this job",
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error claiming job:', error);
      toast({
        title: "Failed to claim job",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke('job-actions', {
        body: { action: 'start', completionId },
      });

      if (error) throw error;

      toast({
        title: "Job started!",
        description: "Good luck with the cleanup!",
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error starting job:', error);
      toast({
        title: "Failed to start job",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, type: 'before' | 'after'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${jobId}-${type}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('job-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('job-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleComplete = async () => {
    if (!beforePhoto || !afterPhoto) {
      toast({
        title: "Photos required",
        description: "Please upload both before and after photos",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload photos
      const beforeUrl = await uploadPhoto(beforePhoto, 'before');
      const afterUrl = await uploadPhoto(afterPhoto, 'after');

      // Complete the job
      const { error } = await supabase.functions.invoke('job-actions', {
        body: {
          action: 'complete',
          completionId,
          rewardAmount,
          photoUrls: { before: beforeUrl, after: afterUrl },
          notes,
        },
      });

      if (error) throw error;

      toast({
        title: "Job completed! 🎉",
        description: `You've earned $${rewardAmount}! Photos are being verified.`,
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error completing job:', error);
      toast({
        title: "Failed to complete job",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'before') {
        setBeforePhoto(file);
      } else {
        setAfterPhoto(file);
      }
    }
  };

  // Not claimed yet
  if (!status) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Ready to make a difference?
          </CardTitle>
          <CardDescription>Claim this job to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleClaim} 
            disabled={loading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              'Claim This Job'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Claimed but not started
  if (status === 'claimed') {
    return (
      <Card className="border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            Job Claimed
          </CardTitle>
          <CardDescription>Ready to start the cleanup?</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleStart} 
            disabled={loading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              'Start Working'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // In progress - show photo upload
  if (status === 'in_progress') {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Complete the Job</CardTitle>
          <CardDescription>Upload before and after photos to verify your work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="before-photo">Before Photo</Label>
              <div className="relative">
                <input
                  id="before-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'before')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('before-photo')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {beforePhoto ? beforePhoto.name.slice(0, 15) + '...' : 'Upload'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="after-photo">After Photo</Label>
              <div className="relative">
                <input
                  id="after-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'after')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('after-photo')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {afterPhoto ? afterPhoto.name.slice(0, 15) + '...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about the cleanup..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleComplete} 
            disabled={loading || !beforePhoto || !afterPhoto} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              `Complete Job & Earn $${rewardAmount}`
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Completed or pending verification
  if (status === 'completed' || status === 'pending_verification') {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            Job Completed!
          </CardTitle>
          <CardDescription>
            Your work is being verified. Reward will be credited soon.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return null;
};